import {FormControl, FormLabel} from '@mui/material';
import OrderAppartmentRooms from './OrderAppartmentRooms';
import Kitchen from './Kitchen';
import Bathroom from './Bathroom';
import {prices} from '../../../../prices';

export default function OrderAppartment() {
  return (
    <>
      <div>
        <FormControl sx={{mt: 5, ml: 1}}>
          <FormLabel>Количество комнат (x{prices.house.room}р.)</FormLabel>
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
