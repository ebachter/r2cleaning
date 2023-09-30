import {withStyles} from '@mui/styles';
import Button from '@mui/material/Button';

export default withStyles((theme) => ({
  root: {
    borderRadius: 7,
    fontWeight: theme.typography.fontWeightMedium,
    fontFamily: theme.typography.fontFamilySecondary,
    padding: theme.spacing(1, 4),
    fontSize: theme.typography.pxToRem(14),
    boxShadow: 'none',
    '&:active, &:focus': {
      boxShadow: 'none',
    },
  },
  sizeSmall: {
    padding: theme.spacing(1, 3),
    fontSize: theme.typography.pxToRem(13),
  },
  sizeLarge: {
    padding: theme.spacing(1, 5),
    fontSize: theme.typography.pxToRem(16),
  },
}))(Button) as typeof Button;
