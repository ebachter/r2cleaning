import {View} from 'react-native';
import {Text} from 'react-native-paper';
import MenuComponent from './MenuComponent';

export default function OrderSummary() {
  return (
    <View>
      <Text>{'currentPage'}</Text>
      <MenuComponent />
    </View>
  );
}
