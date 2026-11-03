import assert from 'node:assert/strict';
import test from 'node:test';
import { AVAILABLE_LOCALES, resolveBrowserLocale } from '../src/i18n/index.js';

test('Portuguese (Brazil) is available in the language selector', () => {
  assert.deepEqual(
    AVAILABLE_LOCALES.find(({ code }) => code === 'pt-BR'),
    { code: 'pt-BR', label: 'Português (Brasil)' },
  );
});

test('Portuguese browser variants select pt-BR', () => {
  for (const value of ['pt-BR', 'pt_BR', 'PT_br', 'pt', 'pt-PT']) {
    assert.equal(resolveBrowserLocale(value), 'pt-BR', value);
  }
});

test('existing locales and Norwegian aliases keep working', () => {
  const cases = {
    'en-US': 'en', 'fr-CA': 'fr', 'de-DE': 'de',
    'es-ES': 'es', 'ru-RU': 'ru', 'nb-NO': 'nb',
    'no-NO': 'nb', 'nn-NO': 'nb',
  };
  for (const [browser, expected] of Object.entries(cases)) {
    assert.equal(resolveBrowserLocale(browser), expected, browser);
  }
});

test('unsupported and empty locales fall back to English', () => {
  assert.equal(resolveBrowserLocale('it-IT'), 'en');
  assert.equal(resolveBrowserLocale(''), 'en');
  assert.equal(resolveBrowserLocale(null), 'en');
});
