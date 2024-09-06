import React from 'react';
import {trpcComp} from '../../trpc';
import {List, MD3Colors} from 'react-native-paper';
import {MaterialIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {type StackNavigation} from '../../routes';

/* const data = new Array(8).fill({
  title: 'Item',
  description: 'Description for Item',
}); */

export const ListOfOrders = (): React.ReactElement => {
  const {data} = trpcComp.loadObjects.useQuery(undefined, {
    initialData: [],
  });

  console.log('orders', data);
  const navigation = useNavigation<StackNavigation>();

  return (
    <List.Section>
      <List.Subheader>List of objects</List.Subheader>
      {data.map((o, i) => (
        <List.Item
          key={i}
          title={`${o.id}. ${o.objectType.name.en}`}
          left={() => (
            <List.Icon
              color={MD3Colors.tertiary70}
              icon={(props) => (
                <MaterialIcons name="cleaning-services" {...props} />
              )}
            />
          )}
          onPress={() => navigation.navigate('ObjectDetails', {objectId: o.id})}
        />
      ))}
    </List.Section>
  );
};
