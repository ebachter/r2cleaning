import {useState} from 'react';
// import logo from './logo.svg';
// import './App.css';
import {SnackbarProvider} from 'notistack';
import {Helmet, HelmetProvider} from 'react-helmet-async';
import Routes from '../router/routes';
import Fingeprint from './Fingerprint';
import ScrollTop from './ScrollTop';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {trpcComp, trpcClientOptions} from '../trpc';
import Utility from './Utility';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {CustomRouter} from './Router';
import history from '../redux/history';
import theme from '../theme';
import {store, persistor} from '../redux/store';
import '../i18n/i18n';

function App() {
  // add action to all snackbars
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => trpcComp.createClient(trpcClientOptions));

  return (
    <>
      <Provider store={store}>
        <CustomRouter history={history}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider theme={theme}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />

              <trpcComp.Provider client={trpcClient} queryClient={queryClient}>
                <QueryClientProvider client={queryClient}>
                  <Utility />
                  <Fingeprint />
                  <HelmetProvider>
                    <Helmet
                      titleTemplate="REMROB - %s"
                      defaultTitle="Remote Robotics"
                    >
                      <meta
                        name="description"
                        content="REMROB is a universal realtime edge IoT service"
                      />
                    </Helmet>
                    <SnackbarProvider
                      autoHideDuration={5000}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      // className={classes.container}
                      maxSnack={3}
                      /* ref={notistackRef}
              action={(key) => (
                <IconButton
                  onClick={(key) => () => {
                    notistackRef.current.closeSnackbar(key);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              )} */
                    >
                      <Routes />
                      <ScrollTop />
                    </SnackbarProvider>
                  </HelmetProvider>
                </QueryClientProvider>
              </trpcComp.Provider>
            </ThemeProvider>
          </PersistGate>
        </CustomRouter>
      </Provider>
    </>
  );
}

export default App;
