import React from 'react';
import {StyleSheet} from 'react-native';
import {useAppSelector} from '../../redux/store';
import {trpcComp} from '../../trpc';
import {List, MD3Colors} from 'react-native-paper';
import {MaterialIcons} from '@expo/vector-icons';

interface IListItem {
  title: string;
  description: string;
}

const data = new Array(8).fill({
  title: 'Item',
  description: 'Description for Item',
});

export const ListOfOrders = (): React.ReactElement => {
  const smsSent = useAppSelector((state) => state.cleaning.order.smsSent);

  const orders = trpcComp.loadOrders.useQuery();

  console.log('orders', orders.data);

  return (
    <List.Section>
      <List.Subheader>List of orders</List.Subheader>
      {(orders.data || []).map((o, i) => (
        <List.Item
          key={i}
          title={`${o.id}. ${o.objectType}`}
          left={() => (
            <List.Icon
              color={MD3Colors.tertiary70}
              icon={(props) => (
                <MaterialIcons name="cleaning-services" {...props} />
              )}
            />
          )}
        />
      ))}
    </List.Section>
  );
};
