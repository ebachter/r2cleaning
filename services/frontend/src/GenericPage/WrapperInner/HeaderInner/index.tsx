import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import {AppInnerHeaderSearch} from './HeaderSearch';
import UserDropdown from './HeaderDropdown';
import {Theme, useMediaQuery} from '@mui/material';

function Header({
  drawerWidth,
  onDrawerToggle,
}: {
  drawerWidth: number;
  onDrawerToggle: () => void;
}) {
  const xsDownHidden = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm'),
  );
  const smUpHidden = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );

  return (
    <AppBar
      color="default"
      elevation={0}
      position="fixed"
      sx={{
        width: {sm: `calc(100% - ${drawerWidth}px)`},
        ml: {sm: `${drawerWidth}px`},
      }}
    >
      <Toolbar>
        {xsDownHidden && <AppInnerHeaderSearch />}

        {smUpHidden && (
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={onDrawerToggle}
            sx={{marginLeft: (theme) => -theme.spacing(1)}}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          spacing={0}
          alignItems="center"
        >
          {/* xsDownHidden && <HeaderSearch /> */}
          <UserDropdown />
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
