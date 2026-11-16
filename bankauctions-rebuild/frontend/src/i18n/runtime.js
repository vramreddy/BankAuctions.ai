// React-managed translation boundary. No MutationObserver or direct DOM rewriting:
// refs, handlers, component state and machine-readable values remain unchanged.
import React, { createContext, useContext, forwardRef } from 'react';
import { useLanguage } from './LanguageContext.jsx';
import { translate } from './translation.js';
const TranslationDisabled = createContext(false);
const protectedTags = new Set(['script', 'style', 'code', 'pre', 'textarea']);
const textAttributes = ['title', 'placeholder', 'aria-label', 'alt'];
export const LocalizedHost = forwardRef(function LocalizedHost({ hostType, hostProps }, ref) {
  const { language } = useLanguage();
  const parentDisabled = useContext(TranslationDisabled);
  const disabled = parentDisabled || protectedTags.has(hostType) || hostProps.translate === 'no' || hostProps['data-no-translate'];
  const props = { ...hostProps, ref };
  const localize = value => Array.isArray(value) ? value.map(localize) : translate(value, language);
  if (!disabled) {
    props.children = localize(props.children);
    for (const attribute of textAttributes) {
      if (typeof props[attribute] === 'string') props[attribute] = translate(props[attribute], language);
    }
    // An option without an explicit value must submit its original value, not the translated label.
    if (hostType === 'option' && props.value === undefined && typeof hostProps.children === 'string') props.value = hostProps.children;
  }
  const element = React.createElement(hostType, props);
  return disabled && !parentDisabled ? React.createElement(TranslationDisabled.Provider, { value: true }, element) : element;
});
export function localizeElement(factory, type, props, ...args) {
  if (typeof type !== 'string') return factory(type, props, ...args);
  const { ref, ...hostProps } = props || {};
  return factory(LocalizedHost, { hostType: type, hostProps, ref }, ...args);
}
