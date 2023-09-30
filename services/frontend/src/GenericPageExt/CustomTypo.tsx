import {Divider, Typography} from '@mui/material';
import {ReactNode} from 'react';

export const ExtTypoPageTitle = ({children}: {children: ReactNode}) => (
  <Typography variant="h3" align="center" marginTop={5}>
    {children}
  </Typography>
);

export const ExtTypoTextMain = ({
  align,
  children,
  color,
}: {
  align?: 'left';
  children: ReactNode;
  color?: 'light';
}) => (
  <Typography
    variant="h6"
    align={align || 'center'}
    sx={{
      margin: (theme) => `${theme.spacing(2)}`,
      color: (theme) =>
        color === 'light'
          ? theme.palette.text.secondary
          : theme.palette.text.primary,
      lineHeight: 1.75,
    }}
  >
    {children}
  </Typography>
);

export const CustomTypoTitle = ({
  children,
  align,
}: {
  align?: 'left';
  children: ReactNode;
}) => (
  <Typography
    // color="inherit"
    align={align || 'center'}
    variant="h4"
    margin="1.3rem"
    sx={{
      // paddingLeft: '1rem',
      // paddingRight: '1rem',
      //paddingBottom: '2rem',
      paddingTop: '3rem',
    }}
    // marked={'center'}
  >
    {children}
  </Typography>
);

export const CustomDivider = ({height}: {height?: 5}) => (
  <Divider
    sx={{
      height: 2,
      margin: (theme) => `${theme.spacing(1)} ${theme.spacing(2)}`,
      backgroundColor: (theme) => theme.palette.secondary.main,
    }}
  />
);
