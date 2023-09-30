import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
// import HistoryIcon from '@material-ui/icons/History';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {Theme} from '@mui/material';

const staticStyle = {
  icon: {
    // fontSize: '200%',
    fontSize: '150%',
    color: (theme: Theme) => theme.palette.common.white,
  },
  iconSmall: {
    fontSize: '150%',
  },
};

export const menuPoints = [
  {
    label: 'Objects',
    icon: <SettingsInputComponentIcon sx={staticStyle.icon} />,
    href: '/objects',
  },
  {
    label: 'Widgets',
    icon: <PhotoLibraryIcon sx={staticStyle.icon} />,
    href: '/widgets',
  },
  {
    label: 'Projects',
    icon: <PeopleIcon sx={staticStyle.icon} />,
    href: '/projects',
  },
  {
    label: 'Services',
    icon: <DescriptionIcon sx={staticStyle.icon} />,
    href: '/services',
  },
  /* {
    label: 'Timeline',
    icon: <HistoryIcon sx={staticStyle.icon} />,
    href: '/timeline',
  }, */
];

const categories = [
  {
    label: 'Applications',
    children: menuPoints,
  },
];

export default categories;
export const MoreIcon = <MoreHorizIcon sx={staticStyle.icon} />;
