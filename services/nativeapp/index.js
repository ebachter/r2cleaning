import '@expo/metro-runtime';
import {registerRootComponent} from 'expo';
import {persistor, store} from './redux/store';
import {Provider} from 'react-redux';
import App from './App';
import {PersistGate} from 'redux-persist/integration/react';
import {Text} from 'react-native-paper';

const Root = () => (
  <Provider store={store}>
    <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(Root);
