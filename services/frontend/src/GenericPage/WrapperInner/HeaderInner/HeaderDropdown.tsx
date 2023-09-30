import {useState, MouseEvent} from 'react';
import {makeStyles} from '@mui/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import {useSelector} from 'react-redux';
import Avatar from '@mui/material/Avatar';
import {Link} from 'react-router-dom';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Divider from '@mui/material/Divider';
import BusinessIcon from '@mui/icons-material/Business';
import PieChartIcon from '@mui/icons-material/PieChart';
import {MdArrowDropDown} from 'react-icons/md';
import subHeaderBgColors from '../../../globalData/varsSubHeaderBgColors';
import {RootState} from '../../../redux/store';
import {fnUserLogout} from '../../../utils/fnsAuth';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  avatar: {},
}));

const menuPoints = () => [
  {
    text: 'Settings',
    icon: (
      <SettingsApplicationsIcon style={{color: subHeaderBgColors.settings}} />
    ),
    url: '/settings',
    color: subHeaderBgColors.settings,
  },

  {
    text: 'Analytics',
    icon: <PieChartIcon style={{color: subHeaderBgColors.analytics}} />,
    url: '/analytics',
    color: subHeaderBgColors.analytics,
  },
  {
    text: 'Administration',
    icon: <BusinessIcon style={{color: subHeaderBgColors.admin}} />,
    url: '/admin',
    color: subHeaderBgColors.admin,
  },

  {
    text: 'Sign out',
    icon: <ExitToAppIcon style={{color: subHeaderBgColors.logout}} />,
    action: fnUserLogout,
    color: subHeaderBgColors.others,
  },
];

export default function MenuAppBar() {
  const userData = useSelector((state: RootState) => state.user);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleMenu(event: MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <Button
        component="span"
        aria-label="Account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
        startIcon={
          userData.user_image_hash && (
            <Avatar
              className={classes.avatar}
              src={
                userData?.user_image_hash
                  ? `${process.env.REACT_APP_DOMAIN_STATIC_FILES}/images/users/${userData.user_image_hash}`
                  : undefined
              }
              alt={userData.name}
              variant="circular"
            />
          )
        }
        endIcon={<MdArrowDropDown />}
      >
        <Typography>{userData.name}</Typography>
      </Button>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        {menuPoints().map(({text, url, action, icon}, i) => [
          <MenuItem
            {...(url ? {component: Link, to: url} : {})}
            {...(action && {onClick: () => action()})}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <Typography variant="inherit">{text}</Typography>
          </MenuItem>,
          <Divider />,
        ])}
      </Menu>
    </>
  );
}
