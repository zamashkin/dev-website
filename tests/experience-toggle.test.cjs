const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../public/js/script.js'), 'utf8');

function setup({ reducedMotion = false } = {}) {
  const classes = new Set();
  const cardClasses = new Set();
  const attributes = new Map([['aria-expanded', 'false']]);
  const frames = new Map();
  const listeners = new Map();
  let frameId = 0;

  const story = {
    id: 'story-aventica',
    style: { height: '' },
    scrollHeight: 300,
    classList: {
      add: (name) => classes.add(name),
      remove: (name) => classes.delete(name),
      toggle(name, force) { if (force) classes.add(name); else classes.delete(name); },
      contains: (name) => classes.has(name),
    },
    getBoundingClientRect() {
      return { height: this.style.height ? Number.parseFloat(this.style.height) : classes.has('is-expanded') ? 300 : 96 };
    },
    addEventListener(name, handler) { listeners.set(name, handler); },
    get offsetHeight() { return this.getBoundingClientRect().height; },
  };
  const card = {
    classList: { add: (name) => cardClasses.add(name) },
    querySelector: (selector) => selector === '.experience-story' ? story : null,
  };
  const button = {
    textContent: 'Read more',
    closest: (selector) => selector === '.experience-card' ? card : null,
    setAttribute: (name, value) => attributes.set(name, value),
    getAttribute: (name) => attributes.get(name),
    addEventListener(name, handler) { listeners.set(`button:${name}`, handler); },
  };

  vm.runInNewContext(source, {
    navigator: {},
    document: {
      querySelector: () => null,
      querySelectorAll: (selector) => selector === '[data-story-toggle]' ? [button] : [],
    },
    window: {
      matchMedia: () => ({ matches: reducedMotion }),
      requestAnimationFrame(callback) { frames.set(++frameId, callback); return frameId; },
      cancelAnimationFrame(id) { frames.delete(id); },
    },
    getComputedStyle: () => ({
      getPropertyValue: (name) => name === '--preview-height' ? '96px' : '',
    }),
  });

  return {
    button, story, classes, cardClasses, frames,
    click() { listeners.get('button:click')?.(); },
    finishTransition() { listeners.get('transitionend')?.({ propertyName: 'height' }); },
    nextFrame() {
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach((callback) => callback());
    },
  };
}

test('opens the story and animates from the preview to its full height', () => {
  const page = setup();
  assert(page.cardClasses.has('is-interactive'));

  page.click();

  assert.equal(page.button.getAttribute('aria-expanded'), 'true');
  assert.equal(page.button.textContent, 'Show less');
  assert.equal(page.story.style.height, '96px');
  page.nextFrame();
  assert.equal(page.story.style.height, '300px');
});

test('closes an expanded story to its preview height', () => {
  const page = setup();
  page.click();
  page.nextFrame();
  page.finishTransition();
  assert.equal(page.story.style.height, '');

  page.click();

  assert.equal(page.button.getAttribute('aria-expanded'), 'false');
  assert.equal(page.button.textContent, 'Read more');
  assert.equal(page.story.style.height, '300px');
  page.nextFrame();
  assert.equal(page.story.style.height, '96px');
  page.finishTransition();
  assert.equal(page.story.style.height, '');
  assert(!page.classes.has('is-expanded'));
});

test('changes disclosure state without scheduling animation under reduced motion', () => {
  const page = setup({ reducedMotion: true });

  page.click();
  assert.equal(page.button.getAttribute('aria-expanded'), 'true');
  assert.equal(page.story.style.height, '');
  assert.equal(page.frames.size, 0);

  page.click();
  assert.equal(page.button.getAttribute('aria-expanded'), 'false');
  assert.equal(page.story.style.height, '');
  assert.equal(page.frames.size, 0);
});

test('rapid toggles keep only the latest height change', () => {
  const page = setup();

  page.click();
  page.click();

  assert.equal(page.frames.size, 1);
  page.nextFrame();
  assert.equal(page.button.getAttribute('aria-expanded'), 'false');
  assert.equal(page.story.style.height, '96px');
});
