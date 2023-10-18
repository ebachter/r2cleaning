import {FormControl, FormLabel} from '@mui/material';
import OrderAppartmentRooms from './OrderAppartmentRooms';
import Kitchen from './Kitchen';
import Bathroom from './Bathroom';
import {useAppSelector} from '../../../../hooks/hooksRedux';
import ComponentObjectType from '../componentObjectType';

export default function OrderAppartment() {
  const numberOfRooms = useAppSelector(
    (state) => state.cleaning.options.appartment.numberOfRooms,
  );

  return (
    <>
      <ComponentObjectType />
      <div>
        <FormControl sx={{mt: 5, ml: 1}}>
          <FormLabel>Количество комнат (x{numberOfRooms.price}р.)</FormLabel>
          <OrderAppartmentRooms />
        </FormControl>
      </div>
      <div>
        <FormControl sx={{mt: 5, ml: 1}}>
          <FormLabel>Кухня</FormLabel>
          <Kitchen />
        </FormControl>
      </div>
      <div>
        <FormControl sx={{mt: 5, ml: 1}}>
          <FormLabel>Ванная</FormLabel>
          <Bathroom />
        </FormControl>
      </div>
    </>
  );
}
