import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DetailsScreen from './screens/ScreenDetails';
import HomeScreen from './screens/ScreenHomeExt';
import OrderScreen from './screens/ScreenOrderCreate';
import {useAppSelector} from './redux/store';
import {MD3LightTheme as DefaultTheme, PaperProvider} from 'react-native-paper';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import * as material from '@eva-design/material';
import {default as evaTheme} from './eva-custom-theme.json'; // <-- Import app theme
import {trpcComp, trpcClientOptions} from './trpc';
import {useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import ModalLogin from './modals/Login';
import ModalSignup from './modals/Signup';
import AppHeader from './components/Header';
import OrdersScreen from './screens/ScreenOrdersList';
import {connectMainSocket} from './sockets/ioMain';
import {setModals} from './redux/functionsDispatch';
import {RootStackParamList} from '@remrob/mysql';
import {navigationRef} from './RootNavigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const protectedRoutes = ['HomeInt', 'Order', 'Orders'];

const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3f51b5',
    secondary: '#FEC070',
  },
};

const linking = {
  prefixes: ['https://cleaning.tech'],
  config: {
    screens: {
      HomeExt: '',
      HomeInt: 'intro',
      Order: 'order',
      Orders: 'orders',
      // Chat: 'feed/:sort',
    },
  },
};

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => trpcComp.createClient(trpcClientOptions));
  const sessionToken = useAppSelector((state) => state.session.sessionToken);
  // const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const forwardTo = useAppSelector((state) => state.cleaning.modals.forwardTo);

  const auth = (currentRouteName: keyof RootStackParamList) => {
    console.log('--currentRouteName--', currentRouteName);
    // console.log('--sessionToken--', sessionToken);
    if (currentRouteName === 'HomeInt' && !sessionToken) {
      navigationRef.current?.navigate('HomeExt');
    } else if (protectedRoutes.includes(currentRouteName) && !sessionToken) {
      navigationRef.current?.navigate('HomeExt');
      setModals({login: true, forwardTo: currentRouteName});
    }
    if (currentRouteName === 'HomeExt' && sessionToken) {
      navigationRef.current?.navigate('HomeInt');
    }
  };

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
              <NavigationContainer
                ref={navigationRef}
                linking={linking}
                onStateChange={async () => {
                  // const previousRouteName = routeNameRef.current;
                  const currentRouteName = navigationRef.getCurrentRoute()
                    .name as keyof RootStackParamList;
                  auth(currentRouteName);
                }}
                onReady={() => {
                  // routeNameRef.current = navigationRef.getCurrentRoute().name;
                  const currentRouteName = navigationRef.getCurrentRoute()
                    .name as keyof RootStackParamList;
                  auth(currentRouteName);

                  if (
                    protectedRoutes.includes(currentRouteName) &&
                    sessionToken
                  )
                    connectMainSocket();
                }}
              >
                <Stack.Navigator
                  /* screenOptions={{
                    headerShown: false,
                  }} */
                  initialRouteName={forwardTo === 'Order' ? 'Order' : 'HomeInt'}
                >
                  <>
                    <Stack.Screen
                      name="HomeInt"
                      component={DetailsScreen}
                      options={({navigation}) => {
                        return {
                          header: () => <AppHeader showBack={false} />,
                        };
                      }}
                    />
                    <Stack.Screen
                      name="Orders"
                      component={OrdersScreen}
                      options={({navigation}) => {
                        return {
                          header: () => <AppHeader />,
                        };
                      }}
                    />
                    <Stack.Screen
                      name="Order"
                      component={OrderScreen}
                      // options={{title: 'Заказ'}}
                      options={({navigation}) => {
                        return {
                          header: () => <AppHeader />,
                        };
                      }}
                    />
                    <Stack.Screen name="HomeExt" component={HomeScreen} />
                  </>

                  {/* <Stack.Screen name="Home" component={SwipeGesture} /> */}
                </Stack.Navigator>
                <ModalLogin />
                <ModalSignup />
              </NavigationContainer>
            </ApplicationProvider>
          </PaperProvider>
        </QueryClientProvider>
      </trpcComp.Provider>
    </>
  );
}
