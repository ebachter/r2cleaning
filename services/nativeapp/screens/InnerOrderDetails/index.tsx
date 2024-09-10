import * as React from 'react';
import {View} from 'react-native';
import {Input} from '@ui-kitten/components';
import {useRoute} from '@react-navigation/native';
import {Divider, Text, TextInput} from 'react-native-paper';
import {trpcComp} from '../../trpc';
import {RouteProps} from '../../types/typesNavigation';
import {OfferCard} from './Offer';

export default function ScreenOrderDetails() {
  const route = useRoute<RouteProps<'OrderDetails'>>();
  const {data} = trpcComp.loadOrder.useQuery(
    {
      requestId: Number(route.params.requestId),
    },
    {
      initialData: {
        req: {
          request: {id: null},
          objectType: {id: null, name: {en: null}},
        },
        offers: [],
      },
    },
  );
  const [text, setText] = React.useState('_');

  return (
    <>
      <Text variant="titleMedium" style={{margin: 5}}>
        Request {route.params.requestId} details
      </Text>
      <View style={{marginTop: 15}} />
      <TextInput
        style={{margin: 5}}
        label="Request ID"
        value={String(data.req.request.id) || ''}
        onChangeText={(text) => setText(text)}
        disabled
      />

      <View style={{marginTop: 15}} />
      <Input
        style={{margin: 5}}
        value={
          `${String(data?.req.objectType.id)}. ${
            data.req.objectType.name.en
          }` || ''
        }
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

      <Divider />
      <Text variant="titleMedium" style={{margin: 5}}>
        Offers
      </Text>

      {data.offers.map((o, i) => (
        <OfferCard
          key={i}
          supplierName={`${o.user.firstName} ${o.user.lastName}`}
          supplierId={o.offer.userId}
          time={o.offer.time}
        />
      ))}
    </>
  );
}
