import {Helmet} from 'react-helmet-async';
import {Paper, Button, Typography, Grid, Theme} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import AppAppBar from '../../../GenericPageExt/HeaderOuter/AppAppBar';
import ProductHero from './ProductHero';
import ProductValues from './ProductValues';
import ProductPoints from './ProductPoints';
import Footer from '../../../GenericPageExt/Footer';
import {Trans, useTranslation} from 'react-i18next';

const classes = {
  root: {
    color: (theme: Theme) => theme.palette.common.white,
    // backgroundColor: 'theme.palette.primary', //black,
    backgroundColor: (theme: Theme) => theme.palette.primary.main, //black,
    paddingTop: '2rem',
    paddingBottom: '2rem',
  },
};

function Home() {
  const {t} = useTranslation('external');

  return (
    <div>
      <Helmet>
        <title>Remote Robotics</title>
      </Helmet>
      <AppAppBar />
      <ProductHero />
      <ProductPoints />
      <ProductValues />
      <Paper square elevation={3} sx={classes.root}>
        <Grid container justifyContent="center">
          <Typography
            variant="h6"
            align="center"
            sx={{color: (theme) => theme.palette.primary.contrastText}}
          >
            <Trans t={t} i18nKey="start.join" />
          </Typography>
        </Grid>
        <Grid container justifyContent="center" sx={{mt: 5}}>
          <Button
            size="medium"
            variant="contained"
            color="customWhite"
            component={RouterLink}
            to={'/signup'}
            // sx={{color:(theme)=>theme.palette.}}
          >
            {t('start.signup')}
          </Button>
        </Grid>
      </Paper>
      <footer>
        <Grid item xs={12}>
          <Grid container justifyContent="center">
            <Grid item>
              <Footer />
            </Grid>
          </Grid>
        </Grid>
      </footer>
      {/* <hr/>
      <Suspense fallback="loading">
        <MyComponent />
      </Suspense>*/}
    </div>
  );
}

export default Home;
