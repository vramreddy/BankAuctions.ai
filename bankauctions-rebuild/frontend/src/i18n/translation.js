import { rows, homeRows } from './catalog.js';

export const LANGUAGES = [
  { code: 'en', name: 'English', locale: 'en-IN' },
  { code: 'hi', name: 'हिन्दी', locale: 'hi-IN' },
  { code: 'ta', name: 'தமிழ்', locale: 'ta-IN' },
  { code: 'te', name: 'తెలుగు', locale: 'te-IN' },
  { code: 'kn', name: 'ಕನ್ನಡ', locale: 'kn-IN' },
  { code: 'ml', name: 'മലയാളം', locale: 'ml-IN' }
];
export const catalogs = Object.fromEntries(LANGUAGES.slice(1).map(({ code }) => [code, {}]));
for (const row of (rows.trim() + '\n' + homeRows.trim()).split('\n')) {
  const [english, ...translations] = row.split('|');
  if (translations.length !== 5 || translations.some(value => !value.trim())) throw new Error(`Incomplete translation: ${english}`);
  LANGUAGES.slice(1).forEach(({ code }, index) => { catalogs[code][english.trim()] = translations[index]; });
}
export function validLanguage(code) {
  return LANGUAGES.some(language => language.code === code) ? code : 'en';
}
export function translate(text, language) {
  if (typeof text !== 'string' || language === 'en') return text;
  const catalog = catalogs[language];
  if (!catalog) return text;
  const normalized = text.trim().replace(/\s+/g, ' ');
  // Exact phrases preserve grammar and never rewrite IDs, URLs, form values or unknown names.
  let translated = catalog[normalized];
  if (!translated) {
    const match = normalized.match(/^(.*?)([:.!…]+)$/u);
    if (match && catalog[match[1]]) translated = catalog[match[1]] + match[2];
  }
  if (!translated) return text;
  return text.match(/^\s*/)[0] + translated + text.match(/\s*$/)[0];
}
