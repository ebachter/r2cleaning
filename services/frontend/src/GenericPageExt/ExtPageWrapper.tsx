import Grid from '@mui/material/Grid';
import {ReactNode} from 'react';
import Footer from './Footer';
import {Box} from '@mui/system';

/* const gridStyle = {
  grid: {
    margin: "10px auto",
    maxWidth: '768px'
  },
  div: {
    minHeight: '500px'
  }
}; */

const WrapperOuter = (props: {bodyMargin?: boolean; children: ReactNode}) => {
  return (
    <>
      <main>
        <Box
          sx={{
            minHeight: 600,
            // padding: "10px 20px",
            padding: props.bodyMargin === false ? 0 : '10px 20px',
            margin: '50px auto',
            paddingBottom: '5rem',
            maxWidth: `${process.env.REACT_APP_EXT_MAX_CONTENT_WIDTH}px`,
          }}
        >
          {props.children}
        </Box>
      </main>
      <footer>
        <Grid item xs={12}>
          <Grid container justifyContent="center">
            <Grid item>
              <Footer />
            </Grid>
          </Grid>
        </Grid>
      </footer>
    </>
  );
};

export default WrapperOuter;
