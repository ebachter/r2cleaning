import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {PopupContentDialogRadio} from '../types/typesPopup';
import {setPopupElementValue, setPopupElementVisible} from '../zustand/popup';

export const DialogRadio = ({
  ...rest
}: Omit<PopupContentDialogRadio, 'type'>) => {
  const {
    // elemKey,
    radioOptions,
    onElementUpdate,
    value,
  } = rest; // as PopupContentDialogRadio;

  return (
    <div>
      <FormControl component="fieldset">
        {/* freeRadioHeader && (
          <FormLabel component="legend">{freeRadioHeader}</FormLabel>
        ) */}
        <RadioGroup
          value={value}
          // row={direction === 'row' ? true : false}
          aria-label="position"
          name="position"
          style={{paddingLeft: 5}}
          onChange={(e) => {
            onElementUpdate &&
              onElementUpdate(e.target.value, {
                setPopupElementValue,
                setPopupElementVisible,
              });
          }}
        >
          {(radioOptions || []).map(
            ({id, freeRadioLabel}: {id: string; freeRadioLabel: string}, i) => (
              <FormControlLabel
                key={i}
                value={id}
                control={<Radio color="primary" />}
                label={freeRadioLabel}
              />
            ),
          )}
        </RadioGroup>
      </FormControl>
    </div>
  );
};
