import {MaterialIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {ReactElement} from 'react';
import {List, MD3Colors} from 'react-native-paper';
import {trpcComp} from '../../trpc';

export const ListOfOrders = (): ReactElement => {
  const {data} = trpcComp.loadOrders.useQuery(undefined, {initialData: []});

  console.log('orders', data);
  const navigation = useNavigation();

  return (
    <List.Section>
      <List.Subheader>List of orders</List.Subheader>
      {(data || []).map((o, i) => (
        <List.Item
          key={i}
          title={`Заказ ${o.id}. ${o.object.objectType.name.en}`}
          left={() => (
            <List.Icon
              color={MD3Colors.tertiary70}
              icon={(props) => (
                <MaterialIcons name="cleaning-services" {...props} />
              )}
            />
          )}
          // right={() => <>{o.price || ''}</>}
          onPress={() => navigation.navigate('OrderDetails', {requestId: o.id})}
        />
      ))}
    </List.Section>
  );
};
