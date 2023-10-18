import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {useImmer} from 'use-immer';
import {useAppSelector} from '../../../../hooks/hooksRedux';

type TypesKitchen = 'all' | 'sink' | 'refrigerator' | 'oven';

export default function IndeterminateCheckbox() {
  const [state, setState] = useImmer({
    all: false,
    sink: false,
    refrigerator: false,
    oven: false,
  });

  const appartment = useAppSelector(
    (state) => state.cleaning.options.appartment.kitchen,
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((draft) => {
      draft[event.target.name as TypesKitchen] = event.target.checked;
    });
  };

  const handleAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((draft) => {
      // if(!(draft.oven&&draft.refrigerator&&draft.sink))
      const indeterminate = [draft.oven, draft.refrigerator, draft.sink].some(
        (v) => v === true,
      );
      draft.all = indeterminate ? false : event.target.checked;
      draft.oven = indeterminate ? false : event.target.checked;
      draft.refrigerator = indeterminate ? false : event.target.checked;
      draft.sink = indeterminate ? false : event.target.checked;
    });
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
