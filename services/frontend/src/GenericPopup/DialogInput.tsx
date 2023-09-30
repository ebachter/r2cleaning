import {useState} from 'react';
import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';
import {PopupContentInput} from '../types/typesPopup';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import {setPopupElementValue, setPopupElementError} from '../zustand/popup';

export const DialogInput = ({
  elemKey,
  labelText,
  multiline,
  value,
  setOnChange,
  endIcon,
  password,
  disabled,
  errorText,
  placeholder,
}: Omit<PopupContentInput, 'type'>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl
      fullWidth
      variant="outlined"
      size="small"
      style={{marginTop: 10, marginBottom: 10}}
      disabled={disabled}
    >
      <InputLabel shrink={true}>{labelText}</InputLabel>
      <OutlinedInput
        notched={true}
        label={labelText}
        error={!!errorText}
        type={password && !showPassword ? 'password' : 'text'}
        fullWidth
        value={value || ''}
        onChange={(e) => {
          if (setOnChange) {
            setOnChange(e.target.value, {
              setPopupElementValue,
              setPopupElementError,
            });
            return;
          } else {
            setPopupElementValue(elemKey, e.target.value);
          }
        }}
        disabled={disabled}
        multiline={!!multiline}
        maxRows={
          multiline && 'maxRows' in multiline ? multiline.maxRows : undefined
        }
        rows={multiline && 'rows' in multiline ? multiline.rows : undefined}
        placeholder={placeholder}
        inputProps={{
          autoComplete: 'new-password',
        }}
        endAdornment={
          password ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : endIcon ? (
            <InputAdornment position="end">
              {endIcon === 'Done' ? (
                <DoneIcon />
              ) : endIcon === 'Error' ? (
                <ErrorIcon />
              ) : null}
            </InputAdornment>
          ) : undefined
        }
      />
      {errorText && <FormHelperText error>{errorText}</FormHelperText>}
    </FormControl>
  );
};
