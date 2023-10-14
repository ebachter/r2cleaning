import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {useImmer} from 'use-immer';
import {prices} from '../../../../prices';

export default function IndeterminateCheckbox() {
  const [state, setState] = useImmer({
    selected: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((draft) => {
      draft.selected = event.target.checked;
    });
  };

  return (
    <div>
      <FormControlLabel
        label={`Выбрать (${prices.house.bathroom}р.)`}
        control={<Checkbox checked={state.selected} onChange={handleChange} />}
      />
    </div>
  );
}
