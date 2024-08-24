import {MaterialIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {ReactElement} from 'react';
import {List, MD3Colors} from 'react-native-paper';
import {StackNavigation} from '../../routes';
import {trpcComp} from '../../trpc';

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
          title={`Заказ ${o.id}. ${o.object.type}`}
          left={() => (
            <List.Icon
              color={MD3Colors.tertiary70}
              icon={(props) => (
                <MaterialIcons name="cleaning-services" {...props} />
              )}
            />
          )}
          right={() => <>{o.price || ''}</>}
          onPress={() => navigation.navigate('OrderDetails', {orderId: o.id})}
        />
      ))}
    </List.Section>
  );
};
