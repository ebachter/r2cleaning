import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import {menuPoints} from '../../globalData/varsNavigatorMenuPoints';
import IconImage from '../../GenericPageExt/IconImage';
import HeaderInner from './HeaderInner';
import {Link, useLocation} from 'react-router-dom';

const drawerWidth = 240;

export default function ResponsiveDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const {pathname} = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar sx={{backgroundColor: (theme) => theme.palette.primary.main}}>
        <IconImage height={20} src="/cl_logo_2.png" />
      </Toolbar>
      <Divider />
      <List>
        {menuPoints.map(({label, icon, href}, i) => (
          <ListItemButton key={i} component={Link} to={href}>
            <Divider
              orientation="vertical"
              sx={{
                border: (theme) =>
                  `2px solid ${
                    pathname.startsWith(href)
                      ? theme.palette.common.white
                      : 'transparent'
                  }`,
                height: '20px',
                marginLeft: (theme) => theme.spacing(1),
                marginRight: (theme) => theme.spacing(2),
              }}
            />
            <ListItemIcon sx={{minWidth: '40px'}}>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{display: 'flex'}}>
      <CssBaseline />
      <HeaderInner
        onDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
      />
      <Box
        component="nav"
        sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: {xs: 'block', sm: 'none'},
            '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
          }}
          PaperProps={{
            sx: {
              backgroundColor: (theme) => theme.palette.primary.main,
              color: (theme) => theme.palette.common.white,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: {xs: 'none', sm: 'block'},
            '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
          }}
          PaperProps={{
            sx: {
              backgroundColor: (theme) => theme.palette.primary.main,
              color: (theme) => theme.palette.common.white,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{flexGrow: 1, p: 3, width: {sm: `calc(100% - ${drawerWidth}px)`}}}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
