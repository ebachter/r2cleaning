import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './locales/en.json';
import de from './locales/de.json';
import ru from './locales/ru.json';
import {store} from '../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const resources = {en, de, ru} as const;

const initI18n = async () => {
  // let savedLanguage = store.getState().session.language;
  let savedLanguage = await AsyncStorage.getItem('language');
  console.log('>>>', savedLanguage);

  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0]
      .languageCode as typeof savedLanguage;
  }

  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources,
      lng: savedLanguage,
      // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    });
};

initI18n();

export default i18n;
