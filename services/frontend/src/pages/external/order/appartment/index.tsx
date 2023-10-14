import {FormControl, FormLabel} from '@mui/material';
import OrderAppartmentRooms from './OrderAppartmentRooms';
import Kitchen from './Kitchen';
import Bathroom from './Bathroom';
import {prices} from '../../../../prices';
import {objectTypes} from '../shared';
import {useAppSelector} from '../../../../hooks/hooksRedux';
import ComponentObjectType from '../componentObjectType';

export default function OrderAppartment({objectType}: {objectType: string}) {
  const objectType2 = useAppSelector((state) => state.cleaning.objectType);

  return (
    <>
      <ComponentObjectType />
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
