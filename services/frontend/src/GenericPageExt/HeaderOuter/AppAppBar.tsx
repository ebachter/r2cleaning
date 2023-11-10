import {Link, useLocation} from 'react-router-dom';
import MuiLink from '@mui/material/Link';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import {makeStyles} from '@mui/styles';
import MenuDropDown from './MenuDropDown';
import IconImage from '../IconImage';
import Toolbar, {styles as toolbarStyles} from './Toolbar';
import LoginButton from './LoginButton';
import LanguageChange from '../Footer/LanguageChange';
import LinearProgress from './LinearProgress';
import {AppBar, Theme, useMediaQuery} from '@mui/material';

const useStyles = makeStyles((theme) => ({
  placeholder: toolbarStyles(theme).root,
  toolbar: {
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
  },
  right: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}));

function AppAppBar() {
  const location = useLocation();
  // background: 'linear-gradient(#000050, 90%, black)'

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 150,
  });

  const classes = useStyles();
  const smUpHidden = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm'),
  );
  const smDownHidden = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );

  return (
    <>
      <AppBar position="fixed" sx={{backgroundColor: 'white'}}>
        <Toolbar className={classes.toolbar} style={{backgroundColor: 'white'}}>
          {location.pathname === '/' && (
            <Fade className={classes.left} in={trigger}>
              <Box>
                <IconImage height={20} color="black" src="/cl_logo_2.png" />
              </Box>
            </Fade>
          )}
          {location.pathname !== '/' && (
            <MuiLink component={Link} to={'/'} color="inherit">
              <IconImage height={20} color="black" src="/cl_logo_2.png" />
            </MuiLink>
          )}
          <div className={classes.right}>
            {smUpHidden && (
              <>
                {[
                  // {label: 'About', link: '/about'},
                  {label: 'Заказ', link: '/order'},
                ].map((o, i) => (
                  <Button
                    key={i}
                    component={Link}
                    to={o.link}
                    color={
                      location.pathname === o.link ? 'primary' : 'customNeutral'
                    }
                    // style={{fontSize: '1rem', marginRight: '1.5rem'}}
                  >
                    <span style={{whiteSpace: 'nowrap'}}>{o.label}</span>
                  </Button>
                ))}
                <LanguageChange color="customNeutral" />
                <LoginButton />
              </>
            )}
            {smDownHidden && <MenuDropDown />}
          </div>
        </Toolbar>
        <LinearProgress />
      </AppBar>
      <div className={classes.placeholder} />
      {/*<div style={{ width: '100%', borderBottom: '1px solid grey' }} />*/}
    </>
  );
}

export default AppAppBar;
