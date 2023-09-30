import {useEffect} from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import {setFingerprint} from '../zustand/utils';

window.requestIdleCallback =
  window.requestIdleCallback ||
  function (cb) {
    return setTimeout(function () {
      var start = Date.now();
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

window.cancelIdleCallback =
  window.cancelIdleCallback ||
  function (id) {
    clearTimeout(id);
  };

/* const options = {
  excludes: {
    // userAgent: true,
    language: true,
    excludeScreenResolution: true,
    // excludeAvailableScreenResolution:true,

    // IMPORTANT !!!
    enumerateDevices: true,
    excludeAdBlock: true,
  },
}; */

export default function Fingeprint() {
  useEffect(() => {
    // if (window?.requestIdleCallback) {
    requestIdleCallback(async function () {
      const fp = await FingerprintJS.load();
      // const fp = fpPromise(options);
      // const values = components.map(function (component) {
      //   return component.value;
      // });
      // const hash = Fingerprint2.x64hash128(values.join(''), 31);
      const result = await fp.get();
      const {languages, audio, ...components} = result.components;
      const extendedComponents = {
        // enumerateDevices,
        // excludeAdBlock,
        ...components,
      };

      // Optionally, you can make a visitor identifier from your custom list of components
      const visitorId = FingerprintJS.hashComponents(extendedComponents);

      // console.log(result.visitorId);
      setFingerprint(visitorId); // result.visitorId
    });
    /* } else {
      setTimeout(async function () {
        const components = await FingerprintJS.getPromise(options);
        const values = components.map(function (component) {
          return component.value;
        });
        const hash = FingerprintJS.x64hash128(values.join(''), 31);
        setFingerprint(hash);
      }, 500);
    } */
  }, []);

  return null;
}
