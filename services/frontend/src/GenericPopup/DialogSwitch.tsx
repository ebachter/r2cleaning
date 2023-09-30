import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid';
import {PopupContentDialogSwitch} from '../types/typesPopup';
import {setPopupElementValue, setPopupElementVisible} from '../zustand/popup';

export const DialogSwitch = ({...rest}: {}) => {
  const {elemKey, switchOption1, switchOption2, onElementUpdate, value} =
    rest as PopupContentDialogSwitch;
  return (
    <Grid
      component="label"
      container
      alignItems="center"
      spacing={1}
      style={{paddingLeft: '15px'}}
    >
      <Grid item>{switchOption1.freeSwitchLabel}</Grid>
      <Grid item>
        <Switch
          checked={switchOption2.id === value}
          onChange={(e) => {
            onElementUpdate &&
              onElementUpdate(
                e.target.checked ? switchOption2.id : switchOption1.id,
                {
                  setPopupElementVisible,
                  setPopupElementValue,
                },
              );
          }}
        />
      </Grid>
      <Grid item>{switchOption2.freeSwitchLabel}</Grid>
    </Grid>
  );
};
