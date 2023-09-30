import {Grid} from '@mui/material';
import {CustomDivider, ExtTypoPageTitle, ExtTypoTextMain} from './CustomTypo';

const ExtPageHeaderText = ({title, text}: {title: string; text: string}) => (
  <Grid item xs={12} sm={12} marginTop={6}>
    <ExtTypoPageTitle>
      {title}
      <CustomDivider />
    </ExtTypoPageTitle>

    <ExtTypoTextMain color="light">{text}</ExtTypoTextMain>
  </Grid>
);

export default ExtPageHeaderText;
