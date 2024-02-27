import React from 'react';
import {trpcComp} from '../../trpc';
import {List, MD3Colors} from 'react-native-paper';
import {MaterialIcons} from '@expo/vector-icons';

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
        />
      ))}
    </List.Section>
  );
};
