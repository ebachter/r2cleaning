import {createTheme, responsiveFontSizes} from '@mui/material/styles';
import {blueGrey} from '@mui/material/colors';

// const defaultTheme = createMuiTheme();

// Create a theme instance.
/* const theme = createMuiTheme({
  palette: {
    primary: {
      // main: '#556cd6',
      main: '#3f51b5',
    },
    secondary: {
      main: '#2a6ba0', // '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#f5f5f5',
    },
    background2: {
      default: '#fff'
    },
    background3: {
      default: '#red'
    }
  },

  overrides: {
    MuiListItemText: {
      root: {
        marginLeft: defaultTheme.spacing(1),
      }
    },
    MuiLink: {
      //root: {
      //  color: 'inherit',
      //  textDecoration: 'inherit',
      //},
    },
  },

  button: {
    root: {
      backgroundColor: "red",
      "&:hover": {
        backgroundColor: "green"
      }
    }
  },

  forms: {
    main: {
      backgroundColor: '#fff5f8',
      colors: {
        primary: '#19857b',
      }
    }
  }
});*/

// ////////////////////////////

let rawTheme2 = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // indigo
    },
    secondary: {
      main: '#FEC070',
    },
    customNeutral: {
      main: blueGrey[900], // '#64748B',
      // contrastText: '#fff',
    },
    customWhite: {
      main: 'white',
      contrastText: '#3f51b5',
    },
  },
  typography: {
    fontFamily: ['HelveticaNeue', '"Open Sans"', 'Arial', 'sans-serif'].join(
      ',',
    ),
    button: {
      textTransform: 'none',
    },
  },
});

rawTheme2.typography.h4 = {
  ...rawTheme2.typography.h4,
  fontSize: '2.4rem',
};

rawTheme2.typography.h3 = {
  ...rawTheme2.typography.h3,
  fontSize: '2.7rem',
  /*   '@media (min-width:600px)': {
    fontSize: '1.5rem',
  },
  [rawTheme2.breakpoints.up('md')]: {
    fontSize: '2.4rem',
  }, */
};

rawTheme2 = responsiveFontSizes(rawTheme2);

let rawTheme = createTheme({
  palette: {
    secondary: {
      main: '#FEC070', // '#19857b',
    },
  },
  typography: {
    fontFamily: ['HelveticaNeue', '"Open Sans"', 'Arial', 'sans-serif'].join(
      ',',
    ),

    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  /* 
    primary: {
      light: '#63ccff',
      main: '#009be5',
      dark: '#006db3',
    },
  },*/

  shape: {
    borderRadius: 8,
  },

  /* forms: {
    main: {
      backgroundColor: '#fff5f8',
      colors: {
        primary: '#19857b',
      },
    },
  }, */
});

const fontHeader = {
  color: rawTheme.palette.text.primary,
  fontWeight: rawTheme.typography.fontWeightMedium,
  // fontFamily: rawTheme.typography.fontFamilySecondary,
  textTransform: 'uppercase',
};

const theme = {
  ...rawTheme,

  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: rawTheme.palette.primary.main,
      },
    },
    MuiButton: {
      label: {
        textTransform: 'none',
      },
      contained: {
        /* boxShadow: 'none',
        '&:active': {
          boxShadow: 'none',
        },*/
        // Custom
        /*  backgroundColor: "red",
        "&:hover": {
          backgroundColor: "green"
        }*/
      },
    },
    MuiTabs: {
      root: {
        marginLeft: rawTheme.spacing(1),
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: rawTheme.palette.common.white,
      },
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        margin: '0 16px',
        minWidth: 0,
        padding: 0,
        [rawTheme.breakpoints.up('md')]: {
          padding: 0,
          minWidth: 0,
        },
      },
    },
    MuiIconButton: {
      root: {
        padding: rawTheme.spacing(1),
      },
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4,
        fontSize: '18px',
      },
    },
    MuiDivider: {
      root: {
        // backgroundColor: '#404854',
      },
    },
    MuiListItemText: {
      primary: {
        fontWeight: rawTheme.typography.fontWeightMedium,
      },
    },
    MuiListItemIcon: {
      root: {
        color: 'inherit',
        marginRight: 10,
        '& svg': {
          fontSize: 20,
        },
        minWidth: 0,
      },
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32,
      },
    },
  },
  props: {
    MuiTab: {
      disableRipple: true,
    },
  },
  mixins: {
    ...rawTheme.mixins,
    toolbar: {
      minHeight: 66, // 48,
    },
  },

  typography: {
    ...rawTheme.typography,
    fontHeader,
    h1: {
      ...rawTheme.typography.h1,
      ...fontHeader,
      letterSpacing: 0,
      fontSize: 60,
    },
    h2: {
      ...rawTheme.typography.h2,
      ...fontHeader,
      fontSize: 48,
    },
    h3: {
      ...rawTheme.typography.h3,
      // ...fontHeader,
      fontSize: 42,
    },
    h4: {
      ...rawTheme.typography.h4,
      //...fontHeader,
      fontSize: 36,
    },
    h5: {
      ...rawTheme.typography.h5,
      fontSize: 30,
      fontWeight: rawTheme.typography.fontWeightLight,
    },
    h6: {
      ...rawTheme.typography.h6,
      // ...fontHeader,
      fontSize: 24,
    },
    subtitle1: {
      ...rawTheme.typography.subtitle1,
      fontSize: 20,
    },
    body1: {
      ...rawTheme.typography.body2,
      fontWeight: rawTheme.typography.fontWeightRegular,
      fontSize: 16,
    },
    body2: {
      ...rawTheme.typography.body1,
      fontSize: 14,
    },
    body3: {
      ...rawTheme.typography.body2,
      fontSize: 12,
    },
  },
};

export default rawTheme2;
