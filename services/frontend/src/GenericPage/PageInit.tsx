import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from '@mui/material';

export const PageInit = (props: {
  disabled?: boolean;
  label: string;
  placeholder?: string;
  errorText?: string;
  value: string;
  multiline?: number;
  maxRows?: number;
  rows?: number;
  onChange?: (val: string) => void;
}) => {
  return (
    <FormControl
      fullWidth
      variant="outlined"
      size="small"
      style={{marginTop: 10, marginBottom: 10}}
      disabled={props.disabled}
    >
      <InputLabel shrink={true}>{props.label}</InputLabel>
      <OutlinedInput
        notched={true}
        label={props.label}
        error={!!props.errorText}
        // type={password && !showPassword ? 'password' : 'text'}
        fullWidth
        value={props.value || ''}
        onChange={(e) => {
          if (props.onChange) {
            props.onChange(e.target.value);
            return;
          }
        }}
        disabled={props.disabled}
        multiline={!!props.maxRows || !!props.rows}
        maxRows={props.maxRows}
        rows={props.rows}
        placeholder={props.placeholder}
        inputProps={{
          autoComplete: 'new-password',
        }}
      />
      {props.errorText && (
        <FormHelperText error>{props.errorText}</FormHelperText>
      )}
    </FormControl>
  );
};
