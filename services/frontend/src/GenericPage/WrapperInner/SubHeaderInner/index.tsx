import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Breadcrumbs from './Breadcrumbs';
import SettingsMenu from './SettingsMenu';
import {GenericPageType} from '../../../types/typesGenericPage';
// import SubHeaderActions from './SubHeaderActions';
// import subHeaderBgColors from '../../../globalData/subHeaderBgColors';

/* const useStyles = makeStyles((theme) => ({
  bgTransparent: {
    backgroundColor: 'transparent',
  },
})); */

function SubHeaderInner({
  settingsMenu,
}: {
  settingsMenu?: GenericPageType['settingsMenu'];
}) {
  // const rootDir = location.path.split('/')[1];
  // const bgColor = subHeaderBgColors[rootDir] || subHeaderBgColors['others'];

  return (
    <>
      <Paper
        elevation={0}
        style={{
          padding: '15px 5px 10px',
          margin: '0 auto',
          maxWidth: 900,
          marginBottom: 10,
          backgroundColor: 'inherit',
        }}
      >
        <Grid
          justifyContent="space-between"
          alignItems="center"
          container
          spacing={0}
        >
          <Grid item>
            <Breadcrumbs />
          </Grid>

          {settingsMenu && (
            <Grid item>
              {/* <SubHeaderActions /> */}
              <SettingsMenu settingsMenu={settingsMenu} />
            </Grid>
          )}
        </Grid>
      </Paper>
    </>
  );
}

export default SubHeaderInner;
