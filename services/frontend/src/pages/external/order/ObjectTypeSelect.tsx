import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import {Cleaning} from '../../../types/typesCleaning';
import {objectTypes} from './shared';
import {useAppSelector} from '../../../hooks/hooksRedux';
import {setObjectType} from '../../../redux/sliceCleaning';

export default function ObjectType() {
  const objectType = useAppSelector((state) => state.cleaning.objectType);

  return (
    <>
      <FormControl sx={{mt: 5, ml: 1}}>
        <FormLabel>Тип объекта</FormLabel>
        <RadioGroup
          row
          value={objectType}
          onChange={(e) => {
            setObjectType(e.target.value as Cleaning['objectType']);
          }}
        >
          {objectTypes.map(({id, label}, i) => {
            return (
              <FormControlLabel
                key={i}
                value={id}
                control={<Radio />}
                label={label}
              />
            );
          })}
        </RadioGroup>

        {/* <FormControl sx={{mt: 5, ml: 1}}>
              <FormLabel>Локация объекта</FormLabel>
            </FormControl> */}
        {/* <OrderAppartmentSex /> */}
      </FormControl>
    </>
  );
}
