import {StyleSheet} from 'react-native';
import {trpc} from '../../../trpc';
import {Checkbox, List, MD3Colors, Text} from 'react-native-paper';
import {MaterialIcons} from '@expo/vector-icons';

export default function FilterRequests() {
  const {data: sTypes, refetch} = trpc.user.loadServiceOffers.useQuery();

  const createServiceOffer = trpc.user.createServiceOffer.useMutation();
  const deleteServiceOffer = trpc.user.deleteServiceOffer.useMutation();

  return (
    <>
      <Text variant="titleMedium">City</Text>
      <Text variant="bodyLarge">- Grosny</Text>
      <Text variant="bodyLarge">- Argun</Text>
      <Text variant="titleMedium">By service type</Text>

      <List.Section>
        {(sTypes || []).map((o, i) => (
          <List.Item
            key={i}
            title={`${o.serviceType.id}. ${o.serviceType.name.en}`}
            style={{
              marginTop: 0,
              marginBottom: 0,
              paddingTop: 0,
              paddingBottom: 0,
            }}
            left={() => (
              <List.Icon
                color={MD3Colors.tertiary70}
                icon={(props) => (
                  <MaterialIcons name="cleaning-services" {...props} />
                )}
              />
            )}
            right={() => (
              <Checkbox
                status={o.serviceOffer ? 'checked' : 'unchecked'}
                onPress={() => {
                  console.log('>>>', o.serviceOffer, !!o.serviceOffer);
                  if (!o.serviceOffer)
                    createServiceOffer.mutate(
                      {
                        // service_type:o.service_type,
                        service_type_id: o.serviceType.id,
                      },
                      {onSuccess: () => refetch()},
                    );
                  else
                    deleteServiceOffer.mutate(
                      {
                        // service_type:o.service_type,
                        service_type_id: o.serviceType.id,
                      },
                      {onSuccess: () => refetch()},
                    );
                }}
              />
            )}
            // onPress={() =>
            //   navigation.navigate('ObjectDetails', {objectId: o.object_id})
            // }
          />
        ))}
      </List.Section>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
