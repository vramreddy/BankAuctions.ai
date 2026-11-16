# Application languages

Supported selections: English (en), Hindi (hi), Tamil (ta), Telugu (te), Kannada (kn), Malayalam (ml).

`LanguageProvider` stores the selection in `ba_language`, synchronizes other tabs and updates the document language. `UtilityBar` presents the native-script selector. React's configured JSX runtime translates displayed string children and text attributes at render time; it does not mutate the DOM or change route values, IDs, input values or API payloads. Set `translate="no"` on content that must retain its original text. Do not use translated strings for business logic.

## Coverage and remaining work

This is an initial local catalog, NOT complete application translation. `catalog.js` covers common interface labels, categories, city names and selected homepage text in five target languages. Unregistered phrases and arbitrary API descriptions remain in English. Brand names, addresses and source notices are retained. Image lettering and PDFs are not translated. Long page descriptions, validation/server messages, exports and all future inventory content still need explicit translations. No translation provider or external runtime request is configured.

Add complete phrases as rows with six pipe-separated columns (English, Hindi, Tamil, Telugu, Kannada, Malayalam). Avoid word-by-word substitution: translate whole sentences with placeholders in a future message API for variable text. Translations should receive native-speaker review, especially legal and auction terminology.

Tests: `npx vitest run src/i18n/translation.test.jsx`
Build: `npm run build`
