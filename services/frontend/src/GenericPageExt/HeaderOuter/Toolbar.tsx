import {withStyles} from '@mui/styles';
import Toolbar from '@mui/material/Toolbar';
import {Theme} from '@mui/material';

export const styles = (theme: Theme) => ({
  root: {
    height: 64,
    [theme.breakpoints.up('sm')]: {
      height: 70,
    },
  },
});

export default withStyles(styles)(Toolbar);
