import * as React from 'react';
import {View} from 'react-native';
import {Input} from '@ui-kitten/components';
import {useRoute} from '@react-navigation/native';
import {Button, Divider, Text, TextInput} from 'react-native-paper';
import {trpc} from '../../../trpc';
import SupplierTimePicker from './timePicker';
import {useAppSelector} from '../../../redux/store';
import {mergeOffer} from '../../../redux/functionsDispatch';
import {RouteProps} from '../../../types/typesNavigation';

export default function ScreenSupplierRequest() {
  const route = useRoute<RouteProps<'SupplierRequest'>>();
  const {data: res, refetch} = trpc.supplier.loadRequestForSupplier.useQuery(
    {
      requestId: Number(route.params.orderId),
    },
    {initialData: {requests: {id: 0}, objectTypes: {name: {en: ''}}}},
  );
  const {hours, minutes} = useAppSelector((state) => state.offer.time);
  const [timeVisible, setTimeVisible] = React.useState(false);
  const createOffer = trpc.supplier.offers.create.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const cancelOffer = trpc.supplier.offers.cancel.useMutation({
    onSuccess: () => {
      refetch();
      mergeOffer({time: {hours: null, minutes: null}});
    },
  });
  const [price, setPrice] = React.useState(null);

  return (
    <>
      <Text variant="titleMedium" style={{margin: 5}}>
        Request {route.params.orderId} details
      </Text>
      <View style={{marginTop: 15}} />
      <TextInput
        style={{margin: 5}}
        label="Request ID"
        value={String(res.requests.id)}
        disabled
      />

      <View style={{marginTop: 15}} />
      <Input
        style={{margin: 5}}
        value={String(res.objectTypes.name.en)}
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

      {res.offers ? (
        <>
          <TextInput
            label="Time"
            value={`${res.offers.cleaningTime.substring(0, 5)}`}
            disabled
          />
          <Button
            icon="offer"
            mode="outlined"
            onPress={() =>
              cancelOffer.mutate({
                offerId: res.offers.id,
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
          <TextInput
            style={{marginTop: 10}}
            label="Price"
            value={price || ''}
            onChangeText={(value) => setPrice(value)}
          />
          <Button
            icon="offer"
            mode="contained"
            onPress={() =>
              createOffer.mutate({
                requestId: Number(route.params.orderId),
                cleaningDate: new Date(res.offers.cleaningDate),
                cleaningTime: `${hours}:${minutes}`,
                price,
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
