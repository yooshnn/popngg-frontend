import type resources from './locales';
import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: typeof resources.ko;
  }
}

export {
  defaultNamespace,
  fallbackLanguage,
  localeCookie,
  supportedLanguages,
} from './config';

export type {
  Language,
} from './config';

export { useLanguage } from './use-language';
