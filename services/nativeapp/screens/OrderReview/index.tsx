import {View} from 'react-native';
import {Text} from 'react-native-paper';
import City from './City';
import {useAppSelector} from '../../redux/store';
import ComponentObjectType from '../OrderDetails/componentObjectType';
import AdressInput from './AdressInput';

export default function OrderSummary() {
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
    <View>
      <Text style={{marginBottom: 20}}>
        <ComponentObjectType />
      </Text>

      <Text style={{marginTop: 20}}>Сумма:</Text>
      <Text style={{marginBottom: 10}}>{sum} руб.</Text>

      <Text style={{marginTop: 20, marginBottom: 10}}>Город:</Text>
      <City />

      <Text style={{marginTop: 20, marginBottom: 10}}>Адрес:</Text>
      <AdressInput />
    </View>
  );
}
