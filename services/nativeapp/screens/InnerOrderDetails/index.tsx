import * as React from 'react';
import {View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {Card, Divider, Icon, Text} from 'react-native-paper';
import {trpc} from '../../trpc';
import {RouteProps} from '../../types/typesNavigation';
import {OfferCard} from './Offer';

export default function ScreenOrderDetails() {
  const route = useRoute<RouteProps<'OrderDetails'>>();
  const {data, refetch} = trpc.user.order.get.one.useQuery(
    {
      orderId: Number(route.params.orderId),
    },
    {
      initialData: {
        /* req: {
          request: {id: null},
          objectType: {id: null, name: {en: null}},
        }, */
        offers: [],
      },
    },
  );

  const LeftContent = (props) => (
    <Icon {...props} source={require('../../assets/cleaning_icon.png')} />
  );

  return (
    <>
      <Text variant="titleMedium" style={{margin: 5}}>
        Order details
      </Text>
      {data.req && (
        <>
          <Card
            style={{
              width: '100%',
              maxHeight: 300,
              marginTop: 5,
              marginBottom: 5,
            }}
          >
            <Card.Title
              title={`Order ${String(data.req.request.id)}`}
              subtitle={`Status: ${
                data.req.order
                  ? 'Accepted order'
                  : data.offers.length
                  ? 'Offers received'
                  : 'Waiting for offers...'
              }`}
              left={LeftContent}
            />
            <Card.Content>
              <Text variant="titleMedium">{`Object: ${data.req.objectType.name.en} in ${data.req.city.nameEn}`}</Text>
              <Text variant="titleMedium">{`Address: ${data.req.object.addressStreet}`}</Text>
              <Text variant="titleMedium">{`Cleaning date: ${
                new Date(data.req.offer.cleaningDate)
                  .toISOString()
                  .split('T')[0]
              }`}</Text>
            </Card.Content>
          </Card>

          <View style={{marginTop: 15}} />
        </>
      )}

      <Divider />
      <Text variant="titleMedium" style={{margin: 5}}>
        Offers
      </Text>

      {data.offers.map((o, i) => (
        <OfferCard
          data={o}
          key={i}
          orderExists={!!data.req.order}
          refetch={refetch}
        />
      ))}
    </>
  );
}
