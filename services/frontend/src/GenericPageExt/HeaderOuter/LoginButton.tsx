import {Link, useLocation} from 'react-router-dom';
import Button from '@mui/material/Button';
import {Theme} from '@mui/material';

const classes = {
  button: {
    //textTransform: 'none',
    // fontSize: 14,
    // fontWeight: 'bold',
    // fontSize: '1rem',
    width: 'auto',
    backgroundColor: (theme: Theme) => theme.palette.primary.main,
  },
};

const LoginButton = () => {
  let location = useLocation();
  return (
    <Button
      variant="contained"
      color={location.pathname === '/login' ? 'primary' : 'primary'}
      sx={classes.button}
      component={Link}
      to={'/login'}
    >
      Login
    </Button>
  );
};
export default LoginButton;
