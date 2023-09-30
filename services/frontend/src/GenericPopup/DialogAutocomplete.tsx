import {TextField} from '@mui/material';
import Autocomplete from '@mui/lab/Autocomplete';
import {PopupAutocommplete} from '../types/typesPopup';
import {
  setPopupElementValue,
  setPopupElementError,
  setPopupElementOptions,
} from '../zustand/popup';
// import {deleteAllPopupErrors} from '../zustand/popup';

type PopupAutocommpleteNew = Omit<PopupAutocommplete, 'label'> & {
  label: string;
};

export const DialogAutocomplete = ({
  label,
  elemKey,
  // value,
  setOnChange,
  options,
  errorText,
}: PopupAutocommpleteNew) => {
  // const [inputValue, setInputValue] = useState('');

  return (
    <div>
      <Autocomplete
        style={{minWidth: 200, marginTop: 15, marginBottom: 15}}
        onChange={(...[, newValue]) => {
          setOnChange
            ? setOnChange(newValue?.id || '', {
                setPopupElementValue,
                setPopupElementError,
                setPopupElementOptions,
              })
            : elemKey && setPopupElementValue(elemKey, newValue?.id || '');
        }}
        options={options}
        clearOnBlur={false}
        // getOptionLabel={(optionKey) => options[optionKey]}
        fullWidth
        size="small"
        /* renderInput={(params) => (
          <TextField {...params} label="Select object" variant="outlined" />
        )} */
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.label}
            </li>
          );
        }}
        renderInput={(params) => {
          params.inputProps = {
            ...params.inputProps,
            autoComplete: 'new-password',
          };
          return (
            <TextField
              {...params}
              variant="outlined"
              label={label}
              error={errorText ? true : false}
              helperText={errorText}
            />
          );
        }}
      />
    </div>
  );
};
