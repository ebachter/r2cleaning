import {Grid, Paper} from '@mui/material';
import {ReactNode} from 'react';

const LineGrey = ({
  children,
  alignItems,
}: {
  children: ReactNode;
  alignItems?: 'flex-start' | 'flex-end';
}) => (
  <Paper
    elevation={0}
    square
    style={{
      marginBottom: 20,
      padding: '40px 20px 40px 20px',
      // padding: '40px 20px 40px 20px',
      // paddingTop: 40,
      // paddingBottom: 40,
      backgroundColor: '#F5F5F5',
      marginTop: '6rem',
    }}
  >
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems={alignItems || 'center'}
    >
      {children}
    </Grid>
  </Paper>
);

export default LineGrey;
