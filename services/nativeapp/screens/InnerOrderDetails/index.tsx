import * as React from 'react';
import {View} from 'react-native';
import {Input} from '@ui-kitten/components';
import {RouteProp, useRoute} from '@react-navigation/native';
import {Text, TextInput} from 'react-native-paper';
import {trpcComp} from '../../trpc';
import {RootStackParamList} from '../../types/typesNavigation';

export default function ScreenOrderDetails({}) {
  const route = useRoute<RouteProp<RootStackParamList, 'OrderDetails'>>();
  const {data} = trpcComp.loadOrder.useQuery({
    orderId: Number(route.params.orderId),
  });
  const [text, setText] = React.useState('_');

  return (
    <>
      <Text variant="titleMedium" style={{margin: 5}}>
        Order {route.params.orderId} details
      </Text>
      <View style={{marginTop: 15}} />
      <TextInput
        style={{margin: 5}}
        label="Order ID"
        value={String(data?.id) || ''}
        onChangeText={(text) => setText(text)}
        disabled
      />

      <View style={{marginTop: 15}} />
      <Input
        style={{margin: 5}}
        value={String(data?.objectId) || ''}
        label="Object type"
        onChangeText={(nextValue) => setText(nextValue)}
        disabled
      />

      <View style={{marginTop: 15}} />
      <Input
        style={{margin: 5}}
        value={'Private cleaner inc.'}
        label="Исполнитель"
        onChangeText={(nextValue) => setText(nextValue)}
        disabled
      />
    </>
  );
}
