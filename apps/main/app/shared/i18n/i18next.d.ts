import type ko from './resources/ko/common';
import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof ko;
    };
  }
}
