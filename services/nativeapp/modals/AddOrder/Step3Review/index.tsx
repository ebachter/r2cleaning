import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useAppSelector} from '../../../redux/store';
import ComponentObjectType from '../Step2Details/componentObjectType';

export default function OrderSummary() {
  const order = useAppSelector((state) => state.cleaning);
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

  const orderCreated = useAppSelector((state) => state.cleaning.orderCreated);
  return (
    <View>
      <Text style={{marginBottom: 20}}>
        <ComponentObjectType />
      </Text>

      <Text style={{marginTop: 20}}>Сумма:</Text>
      <Text style={{marginBottom: 10}}>{sum} руб.</Text>

      {orderCreated && (
        <View style={{marginTop: 20}}>
          <Text style={styles.captionText}>Order is succesfully created!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  captionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  captionIcon: {
    width: 10,
    height: 10,
    marginRight: 5,
  },
  captionText: {
    fontSize: 12,
    fontWeight: '400',
    // fontFamily: 'opensans-regular',
    color: '#8F9BB3',
  },
});
