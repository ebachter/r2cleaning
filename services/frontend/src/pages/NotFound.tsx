import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

const NotFound = () => (
  <Grid
    container
    direction="row"
    justifyContent="center"
    alignItems="center"
    style={{height: '100vh'}}
    spacing={1}
  >
    <Grid item>
      <Typography variant="h6">404</Typography>
    </Grid>
    <Grid item>
      <Divider orientation="vertical" sx={{height: '50px'}} />
    </Grid>
    <Grid item>
      <Typography>This page could not be found.</Typography>
    </Grid>
  </Grid>
);

export default NotFound;
