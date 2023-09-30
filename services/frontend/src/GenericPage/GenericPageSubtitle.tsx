import {Grid, Typography} from '@mui/material';
import ListItemMenu from './ListItemMenu';
import {GenericPageSubtitleType} from '../types/typesGenericPage';
import {createElement} from 'react';

const GenericPageSubtitle = ({
  icon,
  primary,
  secondary,
  menu,
}: Omit<GenericPageSubtitleType, 'type'>) => (
  <Grid
    container
    direction="row"
    justifyContent="flex-start"
    alignItems="center"
    style={{padding: '10px 0px 10px'}}
  >
    {icon && (
      <Grid item>
        {createElement(icon, {
          fontSize: '25px',
          color: 'grey',
          style: {
            marginRight: '5px',
            display: 'inline-block',
            verticalAlign: 'middle',
          },
        })}
      </Grid>
    )}
    <Grid item>
      {primary && (
        <Typography align="left" variant="h6" color="textSecondary">
          {primary}
        </Typography>
      )}
      {secondary && (
        <Typography align="left" variant="body1" color="textSecondary">
          {secondary}
        </Typography>
      )}
    </Grid>
    {menu && (
      <Grid item>
        <ListItemMenu menu_items={menu} />
      </Grid>
    )}
  </Grid>
);

export default GenericPageSubtitle;
