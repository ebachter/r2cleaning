import {FormControlLabel, Radio, RadioGroup} from '@mui/material';
import {useState} from 'react';
import {ObjectTypes} from '../../../types/typesCleaning';

export default function ({
  objectType,
  setObjectType,
}: {
  objectType: ObjectTypes;
  setObjectType: (o: ObjectTypes) => void;
}) {
  return (
    <RadioGroup
      row
      value={objectType}
      onChange={(e) => setObjectType(e.target.value as ObjectTypes)}
    >
      <FormControlLabel
        value="appartment"
        control={<Radio />}
        label="Квартира"
      />
      <FormControlLabel value="entrance" control={<Radio />} label="Подъезд" />
      <FormControlLabel value="house" control={<Radio />} label="Дом" />
      <FormControlLabel value="office" control={<Radio />} label="Офис" />
    </RadioGroup>
  );
}
