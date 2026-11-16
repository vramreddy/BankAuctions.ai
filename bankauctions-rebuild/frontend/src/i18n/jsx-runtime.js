import { jsx as reactJsx, jsxs as reactJsxs } from 'react/jsx-runtime';
import { localizeElement } from './runtime.js';
export { Fragment } from 'react/jsx-runtime';
export const jsx = (type, props, ...args) => localizeElement(reactJsx, type, props, ...args);
export const jsxs = (type, props, ...args) => localizeElement(reactJsxs, type, props, ...args);
