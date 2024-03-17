import React from 'react';
import {trpcComp} from '../../trpc';
import {List, MD3Colors} from 'react-native-paper';
import {MaterialIcons} from '@expo/vector-icons';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface IListItem {
  title: string;
  description: string;
}

/* const data = new Array(8).fill({
  title: 'Item',
  description: 'Description for Item',
}); */

export const ListOfOrders = (): React.ReactElement => {
  const {data} = trpcComp.loadOrders.useQuery();

  console.log('orders', data);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <List.Section>
      <List.Subheader>List of orders</List.Subheader>
      {(data || []).map((o, i) => (
        <List.Item
          key={i}
          title={`${o.order_id}. ${o.objectType}`}
          left={() => (
            <List.Icon
              color={MD3Colors.tertiary70}
              icon={(props) => (
                <MaterialIcons name="cleaning-services" {...props} />
              )}
            />
          )}
          onPress={() => navigation.navigate('Details', {orderId: o.order_id})}
        />
      ))}
    </List.Section>
  );
};
