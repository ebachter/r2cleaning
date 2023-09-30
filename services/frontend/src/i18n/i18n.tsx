import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';

// import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import footerEn from './en/footer.json';
import footerDe from './de/footer.json';
import translationEn from './en/translation.json';
import translationDe from './de/translation.json';
import externalEn from './en/external.json';
import externalDe from './de/external.json';

export const defaultNS = 'trans';
export const resources = {
  en: {
    trans: translationEn,
    footer: footerEn,
    external: externalEn,
  },
  de: {
    trans: translationDe,
    footer: footerDe,
    external: externalDe,
  },
} as const;

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // lng: 'en',
    ns: ['trans', 'footer', 'external'],
    defaultNS,
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV !== 'production' ? true : false,
    react: {
      /* bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '', */
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
      useSuspense: false,
    },
  });
/*   .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // preload: true,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV !== 'production' && true,
    defaultNS: 'trans',
    ns: ['trans', 'common', 'footer', 'external'],
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    resources: resources,

    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
    useSuspense: false,
  }); */
/*.then((err, t) => {
    if (err) return console.log('something went wrong loading', err);
  });;*/

//  i18n.addResourceBundle('en', 'trans', translationEn, true, true);
//  i18n.addResourceBundle('de', 'trans', translationDe, true, true);

/* i18n.addResourceBundle('en', 'footer', footerEn, true, true);
i18n.addResourceBundle('de', 'footer', footerDe, true, true);
i18n.addResourceBundle('en', 'external', externalEn, true, true);
i18n.addResourceBundle('de', 'external', externalDe, true, true); */

export default i18next;

export const t = i18next.t;
