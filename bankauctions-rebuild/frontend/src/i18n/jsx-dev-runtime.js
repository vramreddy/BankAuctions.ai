import { jsxDEV as reactJsxDEV } from 'react/jsx-dev-runtime';
import { localizeElement } from './runtime.js';
export { Fragment } from 'react/jsx-dev-runtime';
export const jsxDEV = (type, props, ...args) => localizeElement(reactJsxDEV, type, props, ...args);
