import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DetailsScreen from './screens/InnerHome';
import HomeScreen from './screens/OuterHome';
import OrderScreen from './screens/InnerRequestCreate';
import {useAppSelector} from './redux/store';
import {MD3LightTheme as DefaultTheme, PaperProvider} from 'react-native-paper';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import * as material from '@eva-design/material';
import {default as evaTheme} from './eva-custom-theme.json'; // <-- Import app theme
import {trpcComp, trpcClientOptions} from './trpc';
import {createElement, useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import ModalLogin from './modals/Login';
import ModalSignup from './modals/Signup';
import AppHeader from './components/Header';
import OrdersScreen from './screens/InnerRequestList';
import {connectMainSocket} from './sockets/ioMain';
import {setModals} from './redux/functionsDispatch';
import {RootStackParamList} from '@remrob/mysql';
import {navigationRef} from './RootNavigation';
import SnackbarComp from './components/Snackbar';
import {ScreenTemplate} from './components/Wrapper';
import ScreenOrderDetails from './screens/InnerRequestDetails';

const Stack = createNativeStackNavigator<RootStackParamList>();
const protectedRoutes = ['HomeInt', 'Order', 'Orders'];

export const allRoutes: {
  [file: string]: {
    name: keyof RootStackParamList;
    component: (k: any) => React.JSX.Element;
    path: string;
    showBack?: boolean;
    title?: string;
  };
} = {
  HomeExt: {name: 'HomeExt', component: HomeScreen, path: '', showBack: false},
  HomeInt: {
    name: 'HomeInt',
    component: DetailsScreen,
    path: 'intro',
    title: 'Главная',
  },
  Details: {
    name: 'Details',
    component: ScreenOrderDetails,
    path: 'details',
    title: 'Детали',
  },
  Order: {name: 'Order', component: OrderScreen, path: 'order', title: 'Заказ'},
  Orders: {
    name: 'Orders',
    component: OrdersScreen,
    path: 'orders',
    title: 'Заказы',
  },
};

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
      Details: 'details',
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
                  /* screenOptions={{ headerShown: false, }} */
                  initialRouteName={forwardTo === 'Order' ? 'Order' : 'HomeInt'}
                >
                  <>
                    {Object.entries(allRoutes).map(([Screen, o], i) => {
                      // {component, path, showback}
                      return (
                        <Stack.Screen
                          key={i}
                          name={o.name}
                          component={() => (
                            <ScreenTemplate>
                              {createElement(o.component)}
                            </ScreenTemplate>
                          )}
                          options={({navigation}) => {
                            return {
                              header: () => (
                                <AppHeader
                                  showBack={o.showBack === false ? false : true}
                                />
                              ),
                            };
                          }}
                        />
                      );
                    })}

                    {/* <Stack.Screen
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
                    <Stack.Screen name="HomeExt" component={HomeScreen} /> */}
                  </>

                  {/* <Stack.Screen name="Home" component={SwipeGesture} /> */}
                </Stack.Navigator>
                <ModalLogin />
                <ModalSignup />
                <SnackbarComp />
              </NavigationContainer>
            </ApplicationProvider>
          </PaperProvider>
        </QueryClientProvider>
      </trpcComp.Provider>
    </>
  );
}
