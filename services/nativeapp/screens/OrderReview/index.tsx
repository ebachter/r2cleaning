import {View} from 'react-native';
import {Text} from 'react-native-paper';
import City from './City';
import {useAppSelector} from '../../redux/store';
import ComponentObjectType from '../OrderDetails/componentObjectType';
import AdressInput from './AdressInput';
import {PhoneNumberInput} from './PhoneNumberInput';

export default function OrderSummary() {
  const order = useAppSelector((state) => state.cleaning.order);
  const sum =
    order.options.appartment.numberOfRooms.number *
      order.options.appartment.numberOfRooms.price +
    (order.options.appartment.kitchen.oven.value
      ? order.options.appartment.kitchen.oven.price
      : 0) +
    (order.options.appartment.kitchen.refrigerator.value
      ? order.options.appartment.kitchen.refrigerator.price
      : 0) +
    (order.options.appartment.kitchen.sink.value
      ? order.options.appartment.kitchen.sink.price
      : 0) +
    (order.options.appartment.bathroom.include
      ? order.options.appartment.bathroom.price
      : 0);

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

      <View style={{marginTop: 20}}>
        <PhoneNumberInput />
      </View>
    </View>
  );
}
