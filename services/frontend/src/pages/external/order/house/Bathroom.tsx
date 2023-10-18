import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {useImmer} from 'use-immer';
import {useAppSelector} from '../../../../hooks/hooksRedux';

export default function IndeterminateCheckbox() {
  const [state, setState] = useImmer({
    selected: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((draft) => {
      draft.selected = event.target.checked;
    });
  };

  const bathroom = useAppSelector(
    (state) => state.cleaning.options.appartment.bathroom,
  );

  return (
    <div>
      <FormControlLabel
        label={`Выбрать (${bathroom.price}р.)`}
        control={<Checkbox checked={state.selected} onChange={handleChange} />}
      />
    </div>
  );
}
