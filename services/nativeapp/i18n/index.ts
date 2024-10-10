import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './locales/en.json';
import de from './locales/de.json';
import ru from './locales/ru.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const resources = {en, de, ru} as const;

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem('language');

  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0]
      .languageCode as typeof savedLanguage;
  }

  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources,
      lng: savedLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    });
};

initI18n();

export default i18n;
