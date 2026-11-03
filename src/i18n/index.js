import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

// Languages with a dedicated locale file. As contributors add translations,
// register them here and add an entry to AVAILABLE_LOCALES so the language
// picker in Settings → Regional & Units shows the new option.
register('en', () => import('./en.json'));
register('fr', () => import('./fr.json'));
register('de', () => import('./de.json'));
register('es', () => import('./es.json'));
register('ru', () => import('./ru.json'));
register('nb', () => import('./nb.json'));
register('pt-BR', () => import('./pt_BR.json'));

export const AVAILABLE_LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'ru', label: 'Русский' },
  { code: 'nb', label: 'Norsk bokmål' },
  { code: 'pt-BR', label: 'Português (Brasil)' },
];

export function initI18n(initialLocale) {
  init({
    fallbackLocale: 'en',
    initialLocale: initialLocale || browserDefaultLocale(),
    // Log missing-key warnings to the browser console only in dev — in
    // production builds they'd spam the console for users running a locale
    // that isn't fully translated yet.
    warnOnMissingMessages: !!import.meta.env.DEV,
  });
}

// Convert the browser's locale into one of the locale codes registered above.
// Keep Norwegian aliases and prefer pt-BR for browsers configured in Portuguese.
export function resolveBrowserLocale(browserLocale) {
  const normalized = String(browserLocale || '').trim().replace(/_/g, '-').toLowerCase();
  if (!normalized) return 'en';
  const exact = AVAILABLE_LOCALES.find(({ code }) => code.toLowerCase() === normalized);
  if (exact) return exact.code;
  let short = normalized.split('-')[0];
  if (short === 'pt') return 'pt-BR';
  // Browsers set to Norwegian may say no or nn; the translation is Bokmål.
  if (short === 'no' || short === 'nn') short = 'nb';
  return AVAILABLE_LOCALES.find(({ code }) => code === short)?.code || 'en';
}

export function browserDefaultLocale() {
  return resolveBrowserLocale(getLocaleFromNavigator());
}
