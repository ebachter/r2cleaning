import {ReactElement} from 'react';
import {trpcComp} from '../../trpc';
import {List, MD3Colors} from 'react-native-paper';
import {MaterialIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../../routes';

export const ListOfOrders = (): ReactElement => {
  const {data} = trpcComp.loadOrders.useQuery();

  console.log('orders', data);
  const navigation = useNavigation<StackNavigation>();

  return (
    <List.Section>
      <List.Subheader>List of orders</List.Subheader>
      {(data || []).map((o, i) => (
        <List.Item
          key={i}
          title={`Заказ ${o.order_id}. ${o.object_type}`}
          left={() => (
            <List.Icon
              color={MD3Colors.tertiary70}
              icon={(props) => (
                <MaterialIcons name="cleaning-services" {...props} />
              )}
            />
          )}
          right={() => <>{o.price || ''}</>}
          onPress={() =>
            navigation.navigate('OrderDetails', {orderId: o.order_id})
          }
        />
      ))}
    </List.Section>
  );
};
