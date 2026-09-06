const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');
const originalLabel = '<span aria-hidden="true">▣</span> Copy email';

function setup({ writeText, fallback = () => true } = {}) {
  let click;
  let removed = false;
  let focused = false;
  let fallbackCalls = 0;
  let timerId = 0;
  const timers = new Map();
  const classes = new Set();
  const button = {
    innerHTML: originalLabel,
    set textContent(value) { this.innerHTML = value; },
    dataset: { email: 'aleksandr@zamashkin.dev' },
    disabled: false,
    classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name) },
    addEventListener: (_, handler) => { click = handler; },
  };
  const field = { style: {}, setAttribute() {}, select() {}, remove() { removed = true; } };
  vm.runInNewContext(source, {
    navigator: writeText ? { clipboard: { writeText } } : {},
    document: {
      querySelector: (selector) => selector === '.copy-email' ? button : null,
      activeElement: { focus() { focused = true; } },
      createElement: () => field,
      body: { append() {} },
      execCommand() { fallbackCalls += 1; return fallback(); },
    },
    window: {
      clearTimeout: (id) => timers.delete(id),
      setTimeout(fn) { timers.set(++timerId, fn); return timerId; },
    },
  });
  return {
    button, classes, timers, field,
    click: () => click(),
    get removed() { return removed; },
    get focused() { return focused; },
    get fallbackCalls() { return fallbackCalls; },
    reset() { for (const fn of timers.values()) fn(); timers.clear(); },
  };
}

test('waits for confirmed clipboard success and ignores concurrent clicks', async () => {
  let resolve;
  let calls = 0;
  const page = setup({ writeText(text) {
    assert.equal(text, 'aleksandr@zamashkin.dev');
    calls += 1;
    return new Promise((done) => { resolve = done; });
  } });
  const pending = page.click();
  assert.equal(page.button.innerHTML, 'Copying…');
  assert.equal(page.button.disabled, true);
  await page.click();
  assert.equal(calls, 1);
  resolve();
  await pending;
  assert(page.classes.has('is-copied'));
  assert.equal(page.button.disabled, false);
  assert.equal(page.fallbackCalls, 0);
  page.reset();
  assert.equal(page.button.innerHTML, originalLabel);
});

test('fallback succeeds after clipboard rejection and cleans up', async () => {
  const page = setup({ writeText: async () => { throw new Error('Denied'); } });
  await page.click();
  assert(page.classes.has('is-copied'));
  assert.equal(page.field.value, 'aleksandr@zamashkin.dev');
  assert(page.removed && page.focused);
});

for (const [name, fallback] of [
  ['returns false', () => false],
  ['throws', () => { throw new Error('Unsupported'); }],
]) {
  test(`shows failure and cleans up when fallback ${name}`, async () => {
    const page = setup({ fallback });
    await page.click();
    assert.equal(page.button.innerHTML, 'Copy failed — retry');
    assert.equal(page.button.disabled, false);
    assert(!page.classes.has('is-copied'));
    assert(page.removed && page.focused);
    page.reset();
    assert.equal(page.button.innerHTML, originalLabel);
  });
}

test('repeated completed clicks share one reset timer and restore the original label', async () => {
  const page = setup();
  await page.click();
  await page.click();
  assert.equal(page.timers.size, 1);
  page.reset();
  assert.equal(page.button.innerHTML, originalLabel);
  assert(!page.classes.has('is-copied'));
});

test('a failed copy can be retried successfully', async () => {
  let succeed = false;
  const page = setup({ fallback: () => succeed });
  await page.click();
  assert.equal(page.button.innerHTML, 'Copy failed — retry');
  succeed = true;
  await page.click();
  assert(page.classes.has('is-copied'));
  page.reset();
  assert.equal(page.button.innerHTML, originalLabel);
});
