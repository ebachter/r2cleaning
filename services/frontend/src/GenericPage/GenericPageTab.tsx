import {Button, Grid} from '@mui/material';
import {Link} from 'react-router-dom';
import {Box} from '@mui/system';
import {GenericPageTabsType} from '../types/typesGenericPage';
import useCurrentPath from '../hooks/useCurrentPath';
import {useUtilsStore} from '../zustand/utils';

const classes = {
  activeItem: {
    borderTop: '3px solid blue',
    margin: '0 5px',
  },
  item: {
    borderTop: '3px solid transparent',
    margin: '0 5px',
  },
};

const GenericPageTabs = ({data, addQuery}: GenericPageTabsType) => {
  const {path: currentPath} = useCurrentPath();

  const searchString = useUtilsStore((state) => state.data.searchString);

  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}
      // sx={classes.grid}
    >
      {data.map(({link, label, path}, i) => {
        return (
          <Grid item key={i}>
            <Button
              component={Link}
              to={`${link}${
                addQuery && searchString ? `?q=${searchString}` : ''
              }`}
              color="primary"
            >
              {label}
            </Button>
            <Box
              component="div"
              sx={currentPath === path ? classes.activeItem : classes.item}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default GenericPageTabs;
