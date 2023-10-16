import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {useImmer} from 'use-immer';
import {prices} from '../../../../prices';
import {useAppSelector} from '../../../../hooks/hooksRedux';
import {setKitchenOfAppartment} from '../../../../redux/sliceCleaning';
import {store} from '../../../../redux/store';

type TypesKitchen = 'all' | 'sink' | 'refrigerator' | 'oven';

export default function IndeterminateCheckbox() {
  const state = useAppSelector(
    (state) => state.cleaning.options.appartment.kitchen,
  );
  const {dispatch} = store;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newState = {
      ...state,
      [event.target.name as TypesKitchen]: event.target.checked,
    };
    dispatch(setKitchenOfAppartment(newState));
  };

  const handleAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newState = {...state};
    const indeterminate = [
      newState.oven,
      newState.refrigerator,
      newState.sink,
    ].some((v) => v === true);
    newState.all = indeterminate ? false : event.target.checked;
    newState.oven = indeterminate ? false : event.target.checked;
    newState.refrigerator = indeterminate ? false : event.target.checked;
    newState.sink = indeterminate ? false : event.target.checked;
    setKitchenOfAppartment(newState);
  };

  return (
    <div>
      <FormControlLabel
        label="Выбрать все"
        name="all"
        control={
          <Checkbox
            checked={state.sink && state.refrigerator && state.oven}
            indeterminate={
              (!(state.sink && state.refrigerator && state.oven) &&
                (state.sink || state.refrigerator || state.oven)) ||
              undefined
            }
            onChange={handleAllChange}
          />
        }
      />
      <Box sx={{display: 'flex', flexDirection: 'column', ml: 3}}>
        <FormControlLabel
          label={`Мойка (${prices.house.kitchen.sink}р.)`}
          name="sink"
          control={<Checkbox checked={state.sink} onChange={handleChange} />}
        />
        <FormControlLabel
          label={`Холодильник (${prices.house.kitchen.refrigerator}р.)`}
          name="refrigerator"
          control={
            <Checkbox checked={state.refrigerator} onChange={handleChange} />
          }
        />
        <FormControlLabel
          label={`Печь (${prices.house.kitchen.oven}р.)`}
          name="oven"
          control={<Checkbox checked={state.oven} onChange={handleChange} />}
        />
      </Box>
    </div>
  );
}
