import {useEffect, ReactNode} from 'react';
import {useSelector} from 'react-redux';
import Paper from '@mui/material/Paper';
import {useTranslation} from 'react-i18next';
import {useIdleTimer} from 'react-idle-timer';
import DialogGenericPopupNew from '../../GenericPopup';
import Drawer from './Drawer';
import {BroadcastChannel} from 'broadcast-channel';
import {varUserIdleTimeoutMinutes} from '../../globalData/varsConstants';
import {RootState} from '../../redux/store';
import {fnUserLogout} from '../../utils/fnsAuth';

const kickoutChannel = new BroadcastChannel('kickout-event');

function WrapperInner(props: {
  bgTransparent?: boolean;
  subHeader?: boolean;
  bodyMargin?: boolean;
  children: ReactNode;
}) {
  const language = useSelector((state: RootState) => state.user.language);
  const {i18n} = useTranslation();

  useEffect(() => {
    if (language) i18n.changeLanguage(language);
  }, [language, i18n]);

  useEffect(() => {
    const handler = () => {
      fnUserLogout({withRedirect: true});
    };
    kickoutChannel.addEventListener('message', handler);

    return () => {
      kickoutChannel.removeEventListener('message', handler);
    };
  }, []);

  const {isLeader} = useIdleTimer({
    timeout: varUserIdleTimeoutMinutes,
    onIdle: () => {
      if (isLeader()) {
        fnUserLogout({withRedirect: true});
      }
    },
    // onActive: (m) => console.log('onActive', m),
    // onAction: (m) => console.log('onAction', m),
    // debounce: 500,
    throttle: 2000,
    crossTab: true,
    syncTimers: 1000,
    leaderElection: true,
    // onMessage: (msg) => console.log('received:', msg),
    // emitOnSelf: false,
  });

  return (
    <>
      <DialogGenericPopupNew />
      <Drawer>
        {/* {props.subHeader !== false && <SubHeaderInner />} */}
        <Paper
          elevation={props.bgTransparent ? 0 : 3}
          sx={{
            minHeight: 405,
            padding: props.bodyMargin === false ? 0 : '10px 20px',
            margin: '0 auto',
            maxWidth: `${process.env.REACT_APP_MAX_CONTENT_WIDTH}px`,
            backgroundColor: props.bgTransparent ? 'transparent' : 'inherit',
          }}
        >
          {props.children}
        </Paper>
      </Drawer>
      {/*  <AppContractTemplateInfo /> */}
    </>
  );
}

/* WrapperInner.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  bodyMargin: PropTypes.bool,
}; */

export default WrapperInner;
