import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import {useState} from 'react';

type TypeSex = 'any' | 'male' | 'female';

export default function () {
  const [sex, setSex] = useState('any');

  return (
    <FormControl sx={{mt: 5, ml: 1}}>
      <FormLabel>Пол персонала</FormLabel>
      <RadioGroup
        row
        value={sex}
        onChange={(e) => setSex(e.target.value as TypeSex)}
      >
        <FormControlLabel value="any" control={<Radio />} label="любой" />
        <FormControlLabel value="mail" control={<Radio />} label="муж" />
        <FormControlLabel value="female" control={<Radio />} label="жен" />
      </RadioGroup>
    </FormControl>
  );
}
