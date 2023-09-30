import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import {useDispatch} from 'react-redux';
import {makeStyles} from '@mui/styles';
import {trpcFunc} from '../../../trpc';
import {enqueueSnackbar} from 'notistack';
import {getFingerprint} from '../../../zustand/utils';

// import swURL from '../lib/sw';
// https://github.com/mozilla/serviceworker-cookbook

const swURL = '/sw.js';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));

function getSubscription() {
  console.info('getSubscription 1');
  return navigator.serviceWorker.ready.then((registration) => {
    console.info('getSubscription 3');
    return registration.pushManager.getSubscription();
  });
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const SubscribeButton = () => {
  // const queue =  useSelector(state => state.notifications);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [subscribed, setSubscribed] = useState<boolean | null>(null);

  useEffect(() => {
    // Register service worker and check the initial subscription state.
    // Set the UI (button) according to the status.
    console.log('serviceWorker');

    navigator.serviceWorker.register(swURL);

    navigator.serviceWorker.ready
      .then(function (registration) {
        console.log('service worker registered');
        // subscriptionButton.removeAttribute('disabled');

        return registration.pushManager.getSubscription();
      })
      .then(function (subscription) {
        setSubscribed(subscription ? true : false);
        if (subscription) {
          console.log('Already subscribed', subscription.endpoint);
        } else console.log('Not yet subscribed');
      });

    /*.then(() => {
      log("service worker file registered");
      // subscriptionButton.removeAttribute('disabled');
      getSubscription().then(subscription => {
        if (subscription) {
          log("Already subscribed",  subscription.endpoint.split("/").pop());
          // console.info('Already subscribed', subscription.endpoint);
          // setUnsubscribeButton();
        } else {
          log("Not yet subscribed");
          // setSubscribeButton();
        }
      });
    }).catch(err => {
      // registration failed
      log("ServiceWorker registration failed: ", err);
    });*/
  }, []);

  /* subscribe = e => {
    // this.setState({ timezone: e.target.value }, () => this.updateButton());
    console.info('---subscribe---', e);
  }; */

  const setSubscribeButton = () => {
    // console.log(this.props.subscriptionStatus)
    // this.setState({ subscriptionLoading: true });
    const vapidPublicKey =
      'BG4SfSTssxwK3JdNLYJ2W800Ag0UW5PM8GeXvQZnjRZXWSMoSrtxYIANcpKXD5J1pTLVgZzoZHGWK0UKGt5225Y';

    navigator.serviceWorker
      .register(swURL)
      .then(async function (registration) {
        // Get the server's public key
        //const response = await fetch('./vapidPublicKey');
        // const vapidPublicKey = await response.text();
        // Chrome doesn't accept the base64-encoded (string) vapidPublicKey yet
        // urlBase64ToUint8Array() is defined in /tools.js
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
        // Subscribe the user
        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
      })
      .then(async function (subscription) {
        // console.log('Subscribed', subscription.endpoint);
        // const rawKey =  subscription.getKey('p256dh');
        const key = ''; // rawKey ? rawKey.toString('base64') : null;
        const rawAuthSecret = ''; // subscription.getKey ? subscription.getKey('auth') : '';
        const authSecret = ''; // rawAuthSecret ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) : '';
        const fingerprint = getFingerprint() || '';

        await trpcFunc.registerSubscriptionSaga.mutate({
          subscription,
          endpoint: subscription.endpoint,
          key,
          authSecret,
          fingerprint,
        });
        enqueueSnackbar(`Successfully registered.`, {variant: 'success'});
        // dispatch({type: 'REGISTER_SUBSCRIPTION', subscription});
      })
      .then(() => setSubscribed(true));
    /*
    navigator.serviceWorker.ready
    .then(async (reg) => reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    })).then(subscription => {
      console.log('setSubscribeButton', subscription)
      // const ths = this;
      // const machineId = subscription.endpoint.split("/").pop(); //makeId(50);

      const rawKey = subscription.getKey ? subscription.getKey("p256dh") : "";
      const key = rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : "";
      const rawAuthSecret = subscription.getKey ? subscription.getKey("auth") : "";
      const authSecret = rawAuthSecret ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) : "";

      this.props.dispatch({ type: "REGISTER_SUBSCRIPTION", subscription, key, authSecret });
      this.props.dispatch({ type: "SUBSCRIPTION_DATA_SET", value: subscription });
    });*/
  };

  const setUnsubscribeButton = () => {
    // console.log('setUnsubscribeButton')
    // this.setState({ subscriptionLoading: true });
    getSubscription().then(async (subscription) => {
      // const machineId = subscription.endpoint.split("/").pop(); //makeId(50);
      // const machineId = localStorage.getItem('machineId');
      if (subscription) {
        subscription.unsubscribe().then(() => {
          // console.info('Unsubscribed', subscription.endpoint);
          // removeSubscription(subscription.endpoint); // , machineId
          trpcFunc.removeSubscriptionSaga.mutate({
            endpoint: subscription.endpoint,
          });
          enqueueSnackbar(`Successfully unregistered`, {variant: 'success'});
          /* dispatch({
            type: 'REMOVE_SUBSCRIPTION',
            endpoint: subscription.endpoint,
          }); */
        });
      } else {
        // console.log('unsubscribe subscription was not defined')
        const subscription = await getSubscription();
        if (subscription?.endpoint) {
          const {status, subscriptionStatus} =
            await trpcFunc.loadSubscriptionStatusSaga.query({
              endpoint: subscription?.endpoint,
            });
        }
        // dispatch({type: 'LOAD_SUBSCRIPTION_STATUS', data: {status: 0}});
      }
      /* .then(() => this.setState({ subscription: false, subscriptionLoading: false })).catch(() => {
        this.setState({ subscriptionLoading: false });
        // localStorage.setItem('machineId',null);
      }); */
    }); // .bind(this));
  };

  return (
    <Button
      variant="contained"
      color="primary"
      className={classes.button}
      disabled={subscribed === null}
      onClick={subscribed ? setUnsubscribeButton : setSubscribeButton}
    >
      {subscribed ? 'UnSubscribe' : 'Subscribe'}
    </Button>
  );
};

SubscribeButton.propTypes = {
  subscriptionLoading: PropTypes.bool.isRequired,
  subscriptionStatus: PropTypes.bool.isRequired,
};

export default SubscribeButton;
