import React from 'react';
import {trpcComp} from '../../trpc';
import {List, MD3Colors} from 'react-native-paper';
import {MaterialIcons} from '@expo/vector-icons';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

/* const data = new Array(8).fill({
  title: 'Item',
  description: 'Description for Item',
}); */

export const ListOfOrders = (): React.ReactElement => {
  const {data} = trpcComp.loadObjects.useQuery();

  console.log('orders', data);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <List.Section>
      <List.Subheader>List of objects</List.Subheader>
      {(data || []).map((o, i) => (
        <List.Item
          key={i}
          title={`${o.object_id}. ${o.object_type}`}
          left={() => (
            <List.Icon
              color={MD3Colors.tertiary70}
              icon={(props) => (
                <MaterialIcons name="cleaning-services" {...props} />
              )}
            />
          )}
          onPress={() =>
            navigation.navigate('ObjectDetails', {objectId: o.object_id})
          }
        />
      ))}
    </List.Section>
  );
};
