import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DetailsScreen from './screens/details';
import HomeScreen from './screens/home';
import OrderScreen from './screens/order';
import {Provider} from 'react-redux';
import {store} from './redux/store';
import {MD3LightTheme as DefaultTheme, PaperProvider} from 'react-native-paper';

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // primary: 'tomato',
    // secondary: 'yellow',
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={
              {
                // headerShown: false,
              }
            }
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
            <Stack.Screen
              name="Order"
              component={OrderScreen}
              options={{title: 'Заказ'}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}
