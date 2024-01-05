import '@expo/metro-runtime';
import {registerRootComponent} from 'expo';
import {store} from './redux/store';
import {Provider} from 'react-redux';
import App from './App';

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(Root);
