import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DetailsScreen from './screens/details';
import HomeScreen from './screens/home';
import OrderScreen from './screens';
import {Provider} from 'react-redux';
import {store} from './redux/store';
import {MD3LightTheme as DefaultTheme, PaperProvider} from 'react-native-paper';
import {ApplicationProvider, Layout, Text} from '@ui-kitten/components';
import * as material from '@eva-design/material';
import {default as evaTheme} from './eva-custom-theme.json'; // <-- Import app theme

const Stack = createNativeStackNavigator();

const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3f51b5',
    secondary: '#FEC070',
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={paperTheme}>
        <ApplicationProvider
          {...material}
          theme={{...material.light, ...evaTheme}}
        >
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={
                {
                  // headerShown: false,
                }
              }
            >
              <Stack.Screen
                name="Order"
                component={OrderScreen}
                options={{title: 'Заказ'}}
              />
              <Stack.Screen name="Home" component={HomeScreen} />
              {/* <Stack.Screen name="Home" component={SwipeGesture} /> */}
              <Stack.Screen name="Details" component={DetailsScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </ApplicationProvider>
      </PaperProvider>
    </Provider>
  );
}
