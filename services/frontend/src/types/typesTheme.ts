import {Theme} from '@mui/material/styles';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

declare module '@mui/material/styles' {
  interface Palette {
    customNeutral: Palette['primary'];
    customWhite: Palette['primary'];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    customNeutral?: PaletteOptions['primary'];
    customWhite?: PaletteOptions['primary'];
  }
}

// Update the Button's color prop options
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    customNeutral: true;
    customWhite: true;
  }
}
