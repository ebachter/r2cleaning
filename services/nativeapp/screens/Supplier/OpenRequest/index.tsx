import * as React from 'react';
import {View} from 'react-native';
import {Input} from '@ui-kitten/components';
import {RouteProp, useRoute} from '@react-navigation/native';
import {Button, Divider, Text, TextInput} from 'react-native-paper';
import {trpcComp} from '../../../trpc';
import SupplierTimePicker from './timePicker';
import {useAppSelector} from '../../../redux/store';
import {mergeOffer} from '../../../redux/functionsDispatch';
import {RootStackParamList} from '../../../types/typesNavigation';

export default function ScreenSupplierRequest() {
  const route = useRoute<RouteProp<RootStackParamList, 'SupplierRequest'>>();
  const {data: res, refetch} = trpcComp.loadRequestForSupplier.useQuery(
    {
      requestId: Number(route.params.requestId),
    },
    {initialData: {order: {id: 0}, objectType: {name: {en: ''}}}},
  );
  const {hours, minutes} = useAppSelector((state) => state.offer.time);
  const [timeVisible, setTimeVisible] = React.useState(false);
  const createOffer = trpcComp.createOffer.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const cancelOffer = trpcComp.cancelOffer.useMutation({
    onSuccess: () => {
      refetch();
      mergeOffer({time: {hours: null, minutes: null}});
    },
  });

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

      {res.offer ? (
        <>
          <TextInput
            label="Time"
            value={`${res.offer.time.substring(0, 5)}`}
            disabled
          />
          <Button
            icon="offer"
            mode="outlined"
            onPress={() =>
              cancelOffer.mutate({
                offerId: res.offer.id,
              })
            }
            style={{marginTop: 15}}
          >
            Cancel offer
          </Button>
        </>
      ) : (
        <>
          <TextInput
            label="Time"
            value={`${hours || ''}${hours ? ':' : ''}${minutes || ''}`}
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
            onPress={() =>
              createOffer.mutate({
                orderId: Number(route.params.requestId),
                time: `${hours}:${minutes}`,
              })
            }
            style={{marginTop: 15}}
          >
            Make offer
          </Button>
        </>
      )}

      <SupplierTimePicker visible={timeVisible} setVisible={setTimeVisible} />
    </>
  );
}
