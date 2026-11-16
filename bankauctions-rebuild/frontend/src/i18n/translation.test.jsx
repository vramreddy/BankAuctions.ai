import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { LanguageContext } from './LanguageContext';
import { LANGUAGES, catalogs, translate, validLanguage } from './translation';
import { jsx } from './jsx-runtime';

const render = (code, child) => renderToStaticMarkup(React.createElement(LanguageContext.Provider, { value: { language: code } }, child));
describe('application localization', () => {
  it('has complete translations for every registered phrase in five languages', () => {
    const keys = Object.keys(catalogs.hi);
    expect(keys.length).toBeGreaterThan(150);
    for (const { code } of LANGUAGES.slice(1)) {
      expect(Object.keys(catalogs[code])).toEqual(keys);
      for (const key of keys) expect(translate(key, code)).not.toBe(key);
    }
  });
  it('translates text through the production JSX runtime in all languages', () => {
    for (const { code } of LANGUAGES) {
      expect(render(code, jsx('button', { children: 'Search' }))).toContain(translate('Search', code));
    }
  });
  it('preserves input data, option values, links and original text exclusions', () => {
    expect(render('ta', jsx('input', { value: 'Search', readOnly: true, placeholder: 'Search' }))).toContain('value="Search"');
    expect(render('ta', jsx('input', { placeholder: 'Search' }))).toContain(translate('Search', 'ta'));
    expect(render('hi', jsx('option', { children: 'Search' }))).toContain('value="Search"');
    expect(render('hi', jsx('a', { href: '/search?city=chennai', children: 'Search' }))).toContain('href="/search?city=chennai"');
    expect(render('hi', jsx('span', { translate: 'no', children: jsx('span', { children: 'Search' }) }))).toContain('Search');
  });
  it('retains whitespace and safely falls back for untranslated content', () => {
    expect(translate(' Search ', 'ta')).toBe(' ' + catalogs.ta.Search + ' ');
    expect(translate('bankauction@gmail.com', 'hi')).toBe('bankauction@gmail.com');
    expect(translate('Untranslated notice', 'ml')).toBe('Untranslated notice');
    expect(validLanguage('unsupported')).toBe('en');
  });
});
