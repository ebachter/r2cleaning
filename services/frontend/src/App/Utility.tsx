import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {popupRegisterObjectQr} from '../popups/popupObjectRegister';
import locationChange from '../utils/locationChange';
import {setPopup} from '../zustand/popup';

const Utility = () => {
  let location = useLocation();

  useEffect(() => {
    locationChange(location, false);
    if (location.pathname === '/objects/register') {
      (async () => {
        setPopup(await popupRegisterObjectQr());
      })();
    }
    return () => {
      locationChange(location, true);
    };
  }, [location]);

  return null;
};
export default Utility;
