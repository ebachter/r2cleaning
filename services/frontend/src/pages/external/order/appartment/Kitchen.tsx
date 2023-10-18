import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
// import {prices} from '../../../../prices';
import {useAppSelector} from '../../../../hooks/hooksRedux';
import {setKitchenOfAppartment} from '../../../../redux/sliceCleaning';
import {store} from '../../../../redux/store';

type TypesKitchen = 'all' | 'sink' | 'refrigerator' | 'oven';

export default function IndeterminateCheckbox() {
  const appartment = useAppSelector(
    (state) => state.cleaning.options.appartment.kitchen,
  );
  const {dispatch} = store;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newState = structuredClone(appartment);
    newState[event.target.name as TypesKitchen].value = event.target.checked;
    dispatch(setKitchenOfAppartment(newState));
  };

  const handleAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newState = structuredClone(appartment);
    const indeterminate = [
      newState.oven.value,
      newState.refrigerator.value,
      newState.sink.value,
    ].some((v) => v === true);

    newState.all.value = indeterminate ? false : event.target.checked;
    newState.oven.value = indeterminate ? false : event.target.checked;
    newState.refrigerator.value = indeterminate ? false : event.target.checked;
    newState.sink.value = indeterminate ? false : event.target.checked;
    setKitchenOfAppartment(newState);
  };

  return (
    <div>
      <FormControlLabel
        label="Выбрать все"
        name="all"
        control={
          <Checkbox
            checked={
              appartment.sink.value &&
              appartment.refrigerator.value &&
              appartment.oven.value
            }
            indeterminate={
              (!(
                appartment.sink.value &&
                appartment.refrigerator.value &&
                appartment.oven.value
              ) &&
                (appartment.sink.value ||
                  appartment.refrigerator.value ||
                  appartment.oven.value)) ||
              undefined
            }
            onChange={handleAllChange}
          />
        }
      />
      <Box sx={{display: 'flex', flexDirection: 'column', ml: 3}}>
        <FormControlLabel
          label={`Мойка (${appartment.sink.price}р.)`}
          name="sink"
          control={
            <Checkbox checked={appartment.sink.value} onChange={handleChange} />
          }
        />
        <FormControlLabel
          label={`Холодильник (${appartment.refrigerator.price}р.)`}
          name="refrigerator"
          control={
            <Checkbox
              checked={appartment.refrigerator.value}
              onChange={handleChange}
            />
          }
        />
        <FormControlLabel
          label={`Печь (${appartment.oven.price}р.)`}
          name="oven"
          control={
            <Checkbox checked={appartment.oven.value} onChange={handleChange} />
          }
        />
      </Box>
    </div>
  );
}
