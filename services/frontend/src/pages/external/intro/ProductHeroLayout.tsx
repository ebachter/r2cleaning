import {Theme} from '@mui/material';
import Container from '@mui/material/Container';
import {Box} from '@mui/material';
import {ReactNode} from 'react';

// const backgroundImage = '/landing-bg.jpg';
const backgroundImage = '/cl_start_bg.webp';

const temp = {
  root: (theme: Theme) => ({
    color: theme.palette.common.white,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    pt: 8,
    pb: 4,
    /* [theme.breakpoints.up('sm')]: {
      height: '70vh',
      minHeight: 500,
      maxHeight: 1300,
    }, */
  }),
  backdrop: (theme: Theme) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.5,
    zIndex: -1,
  }),
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    zIndex: -2,
    opacity: 0.9,
    backgroundImage: `url(${backgroundImage})`,
    backgroundColor: '#7fc7d9', // Average color of the background image.
    backgroundPosition: 'center',
  },
};

function ProductHeroLayout(props: {children: ReactNode}) {
  const {children} = props;

  return (
    <Box component="section" sx={temp.root}>
      <Container>
        {/*<img
          src="/static/themes/onepirate/productHeroWonder.png"
          alt="wonder"
          width="147"
          height="80"
        />*/}
        {children}
        <Box component="div" sx={temp.backdrop} />
        <Box component="div" sx={temp.background} />
      </Container>
    </Box>
  );
}

export default ProductHeroLayout;
