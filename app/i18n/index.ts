import i18n, { LanguageDetectorModule } from 'i18next';
import type { TFunction } from 'i18next';
import { initReactI18next, Trans, useTranslation } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import { en, es } from './locales';

const languageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  detect: () => getLocales()[0].languageCode,
};

const resources = { en, es } as const;

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // Already escaped by react
    },
  });

export default i18n;

export { resources, Trans, useTranslation };
export type { TFunction };
