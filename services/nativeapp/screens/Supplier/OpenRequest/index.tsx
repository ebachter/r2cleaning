import * as React from 'react';
import {View} from 'react-native';
import {Input} from '@ui-kitten/components';
import {RouteProp, useRoute} from '@react-navigation/native';
import {Button, Divider, Text, TextInput} from 'react-native-paper';
import {trpcComp} from '../../../trpc';
import {RootStackParamList} from '../../../routes';
import SupplierTimePicker from './timePicker';
import {useAppSelector} from '../../../redux/store';

export default function ScreenSupplierRequest() {
  const route = useRoute<RouteProp<RootStackParamList, 'SupplierRequest'>>();
  const {data: res} = trpcComp.loadRequestForSupplier.useQuery(
    {
      requestId: Number(route.params.requestId),
    },
    {initialData: {order: {id: 0}, objectType: {name: {en: ''}}}},
  );
  const {hours, minutes} = useAppSelector((state) => state.offer.time);
  const [timeVisible, setTimeVisible] = React.useState(false);

  return (
    <>
      <Text variant="titleMedium" style={{margin: 5}}>
        Request {route.params.requestId} details
      </Text>
      <View style={{marginTop: 15}} />
      <TextInput
        style={{margin: 5}}
        label="Request ID"
        value={String(res.order.id)}
        disabled
      />

      <View style={{marginTop: 15}} />
      <Input
        style={{margin: 5}}
        value={String(res.objectType.name.en)}
        label="Object type"
        disabled
      />

      <View style={{marginTop: 15}} />
      <Input
        style={{margin: 5}}
        value={'Private cleaner inc.'}
        label="Исполнитель"
        disabled
      />

      <Divider style={{marginTop: 10, marginBottom: 10}} />

      <TextInput
        label="Time"
        value={`${hours}:${minutes}`}
        disabled
        right={
          <TextInput.Icon
            icon="clock"
            onPress={() => setTimeVisible(!timeVisible)}
          />
        }
      />

      <Button
        icon="offer"
        mode="contained"
        onPress={() => console.log('Pressed')}
        style={{marginTop: 15}}
      >
        Make offer
      </Button>

      <SupplierTimePicker visible={timeVisible} setVisible={setTimeVisible} />
    </>
  );
}
