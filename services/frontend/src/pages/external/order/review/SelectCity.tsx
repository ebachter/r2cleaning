import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {FormLabel} from '@mui/material';

export default function SelectCity() {
  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
    <div>
      <FormControl variant="standard" sx={{ml: 1, mt: 3, minWidth: 120}}>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          Город
        </InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={age}
          onChange={handleChange}
          // label="Город"
        >
          <MenuItem value={'grosny'}>Грозный</MenuItem>
          <MenuItem value={'argun'}>Аргун</MenuItem>
          <MenuItem value={'gudermes'}>Гудермес</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
