import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DetailsScreen from './screens/details';
import HomeScreen from './screens/home';
import OrderScreen from './screens';
import {useAppSelector} from './redux/store';
import {MD3LightTheme as DefaultTheme, PaperProvider} from 'react-native-paper';
import {
  ApplicationProvider,
  IconRegistry,
  Layout,
  Text,
} from '@ui-kitten/components';
import * as material from '@eva-design/material';
import {default as evaTheme} from './eva-custom-theme.json'; // <-- Import app theme
import {trpcComp, trpcClientOptions} from './trpc';
import {useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import ModalLogin from './modals/Login';
import ModalSignup from './modals/Signup';

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
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => trpcComp.createClient(trpcClientOptions));
  const sessionToken = useAppSelector((state) => state.session.sessionToken);

  console.log('--sessionToken--', sessionToken);
  return (
    <>
      <trpcComp.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={paperTheme}>
            <IconRegistry icons={EvaIconsPack} />
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
                  {sessionToken ? (
                    <Stack.Screen name="Home" component={DetailsScreen} />
                  ) : (
                    <Stack.Screen name="Details" component={HomeScreen} />
                  )}
                  <Stack.Screen
                    name="Order"
                    component={OrderScreen}
                    options={{title: 'Заказ'}}
                  />
                  {/* <Stack.Screen name="Home" component={SwipeGesture} /> */}
                </Stack.Navigator>
              </NavigationContainer>
              <ModalLogin />
              <ModalSignup />
            </ApplicationProvider>
          </PaperProvider>
        </QueryClientProvider>
      </trpcComp.Provider>
    </>
  );
}
