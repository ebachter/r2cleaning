import {View} from 'react-native';
import {Text} from 'react-native-paper';
import City from './City';
import {useAppSelector} from '../../redux/store';
import ComponentObjectType from '../OrderDetails/componentObjectType';
import AdressInput from './AdressInput';

export default function OrderSummary() {
  const order = useAppSelector((state) => state.cleaning.order);
  const sum =
    order.appartment.numberOfRooms.number *
      order.appartment.numberOfRooms.price +
    (order.appartment.kitchen.oven.value
      ? order.appartment.kitchen.oven.price
      : 0) +
    (order.appartment.kitchen.refrigerator.value
      ? order.appartment.kitchen.refrigerator.price
      : 0) +
    (order.appartment.kitchen.sink.value
      ? order.appartment.kitchen.sink.price
      : 0) +
    (order.appartment.bathroom.value ? order.appartment.bathroom.price : 0);

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
