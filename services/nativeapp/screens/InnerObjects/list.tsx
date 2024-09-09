import React from 'react';
import {trpcComp} from '../../trpc';
import {List, MD3Colors} from 'react-native-paper';
import {MaterialIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

export const ListOfOrders = (): React.ReactElement => {
  const {data} = trpcComp.loadObjects.useQuery(undefined, {
    initialData: [],
  });

  console.log('requests', data);
  const navigation = useNavigation();

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
