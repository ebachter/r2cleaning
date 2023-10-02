import {FormControl, FormLabel, Slider} from '@mui/material';
import OrderAppartmentRooms from './OrderAppartmentRooms';
import OrderAppartmentKitchen from './OrderAppartmentKitchen';
import OrderObjectType from '../OrderObjectType';
import {ObjectTypes} from '../../../../types/typesCleaning';

export default function ({
  objectType,
  setObjectType,
}: {
  objectType: ObjectTypes;
  setObjectType: (o: ObjectTypes) => void;
}) {
  console.log('>>>>>>>>>>>>>');
  return (
    <>
      <div>
        <FormControl sx={{mt: 5, ml: 1}}>
          <FormLabel>Количество комнат</FormLabel>
          <OrderAppartmentRooms />
        </FormControl>
      </div>
      <div>
        <FormControl sx={{mt: 5, ml: 1}}>
          <FormLabel>Кухня</FormLabel>
          <OrderAppartmentKitchen />
        </FormControl>
      </div>
      <FormControl sx={{mt: 5, ml: 1}}>
        <FormLabel>Тип объекта</FormLabel>
        <OrderObjectType
          objectType={objectType}
          setObjectType={setObjectType}
        />
      </FormControl>
    </>
  );
}
