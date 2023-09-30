import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import {setFilterString, useUtilsStore} from '../zustand/utils';
import {Theme} from '@mui/material';
import {grey} from '@mui/material/colors';
import {MdCancel, MdSearch} from 'react-icons/md';

const classes = {
  root: {
    backgroundColor: '#fcfcfb',
    borderRadius: 1,
    border: `1px solid ${grey[100]}`,

    padding: '0px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 200,
  },
  input: {
    marginLeft: (theme: Theme) => theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 0,
  },
};

export default function FilterComponent() {
  const filterString = useUtilsStore((state) => state.data.filterString);

  return (
    <Paper component="form" sx={classes.root} square elevation={0}>
      <InputBase
        sx={classes.input}
        placeholder="Filter"
        inputProps={{'aria-label': 'filter'}}
        value={filterString}
        onChange={(e) => {
          // setFilterValue(e.target.value);
          setFilterString(e.target.value);
        }}
      />
      <IconButton
        sx={classes.iconButton}
        aria-label="filter"
        onClick={() => {
          // filterValue && setFilterValue('')
          setFilterString('');
        }}
      >
        {filterString ? <MdCancel /> : <MdSearch />}
      </IconButton>
    </Paper>
  );
}
