const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../public/js/i18n.js'), 'utf8');

function element({ dataset = {}, attributes = {}, innerHTML = '' } = {}) {
  const attrs = new Map(Object.entries(attributes));
  const listeners = new Map();
  return {
    dataset,
    innerHTML,
    textContent: innerHTML,
    parentElement: null,
    getAttribute: (name) => attrs.has(name) ? attrs.get(name) : null,
    setAttribute: (name, value) => attrs.set(name, String(value)),
    removeAttribute: (name) => attrs.delete(name),
    hasAttribute: (name) => attrs.has(name),
    addEventListener: (name, handler) => listeners.set(name, handler),
    click: () => listeners.get('click')?.(),
  };
}

function setup({ languages = ['en-US'], stored = null, storageThrows = false, readyState = 'complete' } = {}) {
  const storage = new Map(stored ? [['language', stored]] : []);
  const captured = [];
  const heading = element({ dataset: { i18n: 'experience.title' }, innerHTML: 'Experience' });
  const label = element({ dataset: { i18nLabel: 'hero.videoLabel' }, attributes: { 'aria-label': 'ASCII portrait animation' } });
  const description = element({ dataset: { i18nContent: 'meta.description' }, attributes: { content: 'Senior Frontend Developer' } });
  const cvLink = element({ dataset: { i18nHref: 'hero.cvHref' }, attributes: { href: 'assets/documents/Aleksandr_Zamashkin_Frontend.pdf' } });
  const toggle = element({ attributes: { 'aria-expanded': 'true' }, innerHTML: 'Show less' });
  const group = element({ attributes: { hidden: '' } });
  const en = element({ dataset: { language: 'en' }, attributes: { 'aria-pressed': 'true' } });
  const ru = element({ dataset: { language: 'ru' }, attributes: { 'aria-pressed': 'false' } });
  en.parentElement = group;
  ru.parentElement = group;

  const selectors = {
    '[data-i18n]': [heading],
    '[data-i18n-label]': [label],
    '[data-i18n-content]': [description],
    '[data-i18n-href]': [cvLink],
    '[data-language]': [en, ru],
    '[data-story-toggle]': [toggle],
  };
  const htmlClasses = new Set();
  const documentListeners = new Map();
  const documentElement = {
    lang: 'en',
    classList: {
      add: (name) => htmlClasses.add(name),
      remove: (name) => htmlClasses.delete(name),
      contains: (name) => htmlClasses.has(name),
    },
  };
  const window = {
    localStorage: {
      getItem(key) { if (storageThrows) throw new Error('blocked'); return storage.get(key) ?? null; },
      setItem(key, value) { if (storageThrows) throw new Error('blocked'); storage.set(key, value); },
    },
    posthog: { capture: (...args) => captured.push(args) },
  };

  vm.runInNewContext(source, {
    window,
    navigator: { languages, language: languages[0] },
    document: {
      documentElement,
      readyState,
      addEventListener: (name, handler) => documentListeners.set(name, handler),
      querySelectorAll: (selector) => selectors[selector] ?? [],
    },
  });

  return { window, storage, captured, documentElement, documentListeners, heading, label, description, cvLink, toggle, group, en, ru };
}

test('uses the first supported browser language', () => {
  const page = setup({ languages: ['de-DE', 'ru-RU', 'en'] });

  assert.equal(page.window.siteI18n.language, 'ru');
  assert.equal(page.documentElement.lang, 'ru');
  assert.equal(page.heading.innerHTML, 'Опыт');
  assert.equal(page.label.getAttribute('aria-label'), 'Анимированный ASCII-портрет');
  assert.equal(page.description.getAttribute('content'), 'Senior фронтенд-разработчик, опыт более 7 лет');
  assert.equal(page.toggle.textContent, 'Свернуть');
  assert.equal(page.ru.getAttribute('aria-pressed'), 'true');
  assert.equal(page.en.getAttribute('aria-pressed'), 'false');
  assert.equal(page.group.hasAttribute('hidden'), false);
});

test('hides a non-English page until the markup is translated', () => {
  const page = setup({ languages: ['ru-RU'], readyState: 'loading' });

  assert.equal(page.documentElement.lang, 'ru');
  assert.equal(page.documentElement.classList.contains('i18n-pending'), true);
  assert.equal(page.heading.innerHTML, 'Experience');

  page.documentListeners.get('DOMContentLoaded')();
  assert.equal(page.heading.innerHTML, 'Опыт');
  assert.equal(page.documentElement.classList.contains('i18n-pending'), false);
});

test('never hides the English page', () => {
  const page = setup({ languages: ['en-US'], readyState: 'loading' });

  assert.equal(page.documentElement.classList.contains('i18n-pending'), false);
});

test('Ukrainian, Belarusian and Kazakh browsers get Russian', () => {
  for (const tag of ['uk-UA', 'be', 'kk-KZ']) {
    assert.equal(setup({ languages: [tag, 'en'] }).window.siteI18n.language, 'ru', tag);
  }
  assert.equal(setup({ languages: ['en-US', 'uk'] }).window.siteI18n.language, 'en');
});

test('falls back to English for unsupported browser languages', () => {
  const page = setup({ languages: ['de-DE', 'fr'] });

  assert.equal(page.window.siteI18n.language, 'en');
  assert.equal(page.heading.innerHTML, 'Experience');
  assert.equal(page.window.siteI18n.t('experience.readMore'), 'Read more');
});

test('a saved choice wins over the browser language', () => {
  const page = setup({ languages: ['ru-RU'], stored: 'en' });

  assert.equal(page.window.siteI18n.language, 'en');
  assert.equal(page.heading.innerHTML, 'Experience');
});

test('switching language updates the page, saves the choice and restores English text', () => {
  const page = setup({ languages: ['en-US'] });

  page.ru.click();
  assert.equal(page.heading.innerHTML, 'Опыт');
  assert.equal(page.storage.get('language'), 'ru');
  assert.equal(JSON.stringify(page.captured), JSON.stringify([['language_changed', { language: 'ru' }]]));

  assert.equal(page.cvLink.getAttribute('href'), 'assets/documents/Aleksandr_Zamashkin_Frontend_RU.pdf');

  page.en.click();
  assert.equal(page.heading.innerHTML, 'Experience');
  assert.equal(page.cvLink.getAttribute('href'), 'assets/documents/Aleksandr_Zamashkin_Frontend.pdf');
  assert.equal(page.label.getAttribute('aria-label'), 'ASCII portrait animation');
  assert.equal(page.toggle.textContent, 'Show less');
  assert.equal(page.storage.get('language'), 'en');
});

test('works when storage is unavailable', () => {
  const page = setup({ languages: ['ru'], storageThrows: true });

  assert.equal(page.window.siteI18n.language, 'ru');
  page.en.click();
  assert.equal(page.window.siteI18n.language, 'en');
});

test('every linked document exists in public/', () => {
  const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
  const documents = [...`${html}\n${source}`.matchAll(/assets\/documents\/[^"'\s]+/g)].map(([match]) => match);

  assert.ok(documents.length >= 2);
  for (const document of new Set(documents)) {
    assert.ok(fs.existsSync(path.join(__dirname, '../public', document)), `Missing ${document}`);
  }
});
