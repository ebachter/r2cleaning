import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {useImmer} from 'use-immer';

type TypesKitchen = 'all' | 'sink' | 'refrigerator' | 'oven';

export default function IndeterminateCheckbox() {
  const [state, setState] = useImmer({
    all: false,
    sink: false,
    refrigerator: false,
    oven: false,
  });

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
        label="Выбрать"
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
          label="Мойка"
          name="sink"
          control={<Checkbox checked={state.sink} onChange={handleChange} />}
        />
        <FormControlLabel
          label="Холодильник"
          name="refrigerator"
          control={
            <Checkbox checked={state.refrigerator} onChange={handleChange} />
          }
        />
        <FormControlLabel
          label="Печь"
          name="oven"
          control={<Checkbox checked={state.oven} onChange={handleChange} />}
        />
      </Box>
    </div>
  );
}
