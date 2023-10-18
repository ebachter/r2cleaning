import {FormControl, FormLabel} from '@mui/material';
import {useAppSelector} from '../../../hooks/hooksRedux';

export default function StepperSum() {
  const options = useAppSelector((state) => state.cleaning.options);
  const sum =
    options.appartment.numberOfRooms.number *
      options.appartment.numberOfRooms.price +
    (options.appartment.kitchen.oven.value
      ? options.appartment.kitchen.oven.price
      : 0) +
    (options.appartment.kitchen.refrigerator.value
      ? options.appartment.kitchen.refrigerator.price
      : 0) +
    (options.appartment.kitchen.sink.value
      ? options.appartment.kitchen.sink.price
      : 0) +
    (options.appartment.bathroom.value ? options.appartment.bathroom.price : 0);
  return (
    <FormControl sx={{mt: 5, ml: 1}}>
      <FormLabel>Сумма:</FormLabel>
      <FormLabel>{sum} руб.</FormLabel>
    </FormControl>
  );
}
