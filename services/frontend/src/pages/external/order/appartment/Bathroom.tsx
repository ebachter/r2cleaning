import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {useImmer} from 'use-immer';
import {setBathroomOfAppartment} from '../../../../redux/sliceCleaning';
import {useAppSelector} from '../../../../hooks/hooksRedux';

export default function IndeterminateCheckbox() {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBathroomOfAppartment(event.target.checked);
  };
  const bathroom = useAppSelector(
    (state) => state.cleaning.options.appartment.bathroom,
  );

  return (
    <div>
      <FormControlLabel
        label={`Выбрать (${bathroom.price}р.)`}
        control={<Checkbox checked={bathroom.value} onChange={handleChange} />}
      />
    </div>
  );
}
