import Button from '@mui/material/Button';
import {useTranslation} from 'react-i18next';
import {Link, useLocation} from 'react-router-dom';
import Grid from '@mui/material/Grid';
import {Theme, Typography, useMediaQuery} from '@mui/material';
import LanguageChange from './LanguageChange';

const footerMargin = {
  marginBottom: '100px',
  marginTop: '20px',
};

const items: {
  url: string;
  label?: string;
  trans?: 'contact';
}[] = [
  {url: '/', label: 'Home'},
  {url: '/login', label: 'Login'},
  // {url: '/about', label: 'About'},
  {url: '/contact', trans: 'contact'},
];

function FooterComponent() {
  const smDownHidden = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );
  // , t, i18n, initialLanguage, router
  const {t} = useTranslation('footer', {useSuspense: false});
  let location = useLocation();

  return (
    <div style={footerMargin}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {items.map(({url, label, trans}, i) => (
          <Button
            disabled={location.pathname === url}
            component={Link}
            to={url}
            key={i}
          >
            {label && label.toUpperCase()}
            {trans && t(trans).toUpperCase()}
          </Button>
        ))}
        {smDownHidden && <LanguageChange color="primary" />}
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        style={{marginTop: '10px'}}
      >
        <Typography variant={'body2'} color={'primary'}>
          2023 &copy; Cleaning.TECH
        </Typography>
      </Grid>
    </div>
  );
}

export default FooterComponent;
