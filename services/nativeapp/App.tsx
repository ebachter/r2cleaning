import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAppSelector} from './redux/store';
import {MD3LightTheme as DefaultTheme, PaperProvider} from 'react-native-paper';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import * as material from '@eva-design/material';
import {default as evaTheme} from './eva-custom-theme.json'; // <-- Import app theme
import {trpc, trpcClientOptions} from './trpc';
import {useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import AppHeader from './components/Header';
import {mergeLocal} from './redux/functionsDispatch';
import {navigationRef} from './RootNavigation';
import SnackbarComp from './components/Snackbar';
import {allRoutes, screens} from './routes';
import ModalAddObject from './modals/AddObject';
import {RootStackParamList} from './types/typesNavigation';
import './i18n';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
    screens,
  },
};

export default function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {queries: {retry: false, refetchOnWindowFocus: false}},
      }),
  );
  const [trpcClient] = useState(() => trpc.createClient(trpcClientOptions));
  const sessionToken = useAppSelector((state) => state.session.sessionToken);

  const auth = (currentRouteName: keyof RootStackParamList) => {
    // console.log('--currentRouteName--', currentRouteName);
    // console.log('--sessionToken--', sessionToken);
    if (currentRouteName === 'Intro' && !sessionToken) {
      navigationRef.current?.navigate('Start');
    } else if (
      allRoutes[currentRouteName].protected !== false &&
      !sessionToken
    ) {
      navigationRef.current?.navigate('Start');
      mergeLocal({modals: {login: {open: true}, forwardTo: currentRouteName}});
    }
    if (currentRouteName === 'Start' && sessionToken) {
      navigationRef.current?.navigate('Intro');
    }
  };

  return (
    <>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ApplicationProvider
            {...material}
            theme={{...material.light, ...evaTheme}}
          >
            <PaperProvider theme={paperTheme}>
              <IconRegistry icons={EvaIconsPack} />
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

                  /* if (
                    allRoutes[currentRouteName].protected !== false &&
                    sessionToken
                  ) */
                }}
              >
                <Stack.Navigator
                  /* screenOptions={{ headerShown: false, }} */
                  initialRouteName={'Intro'}
                >
                  <>
                    {Object.entries(allRoutes).map(([name, o], i) => {
                      return (
                        <Stack.Screen
                          key={i}
                          name={name as keyof RootStackParamList}
                          component={o.component}
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
                  </>
                </Stack.Navigator>
                <ModalAddObject />
              </NavigationContainer>
              <SnackbarComp />
            </PaperProvider>
          </ApplicationProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </>
  );
}
