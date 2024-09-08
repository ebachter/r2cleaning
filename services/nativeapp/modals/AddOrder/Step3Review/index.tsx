import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useAppSelector} from '../../../redux/store';
import ComponentObjectType from './componentObjectType';

export default function OrderSummary() {
  const orderCreated = useAppSelector((state) => state.request.orderCreated);
  return (
    <View>
      <Text style={{marginBottom: 20}}>
        <ComponentObjectType />
      </Text>

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
