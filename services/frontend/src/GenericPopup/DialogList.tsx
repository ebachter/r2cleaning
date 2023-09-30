import TextField from '@mui/material/TextField';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListSubheader,
} from '@mui/material';
import {PopupContentDialogList} from '../types/typesPopup';

export const DialogList = (
  {
    value,
    // inputHelperText,
    // elementValue,
    // textFieldChange,
    // loading,
    // visibility,
    options,
    // setValue,
    labelText,
  }: Omit<PopupContentDialogList, 'type'> /* {
  options: {labelText: string; id: string}[];
  elementValue: string;
  setValue: (val: any) => void;
  labelText: string;
} */,
) => {
  return (
    <List subheader={<ListSubheader>{labelText}</ListSubheader>}>
      {options.map(({label, id, onChange}, i) => (
        <ListItem key={i}>
          <ListItemText primary={label} />
          <ListItemSecondaryAction>
            <TextField
              value={value?.[id] || ''}
              onChange={({target}) => {
                onChange && onChange({...value, [id]: target.value});
                //setValue({[id]: target.value});
              }}
              label={`MQTT Value for ${id}`}
              variant="outlined"
              size="small"
            />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};
