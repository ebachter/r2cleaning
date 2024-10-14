import {StyleSheet} from 'react-native';
import {trpc} from '../../../trpc';
import {Checkbox, List, MD3Colors, Text} from 'react-native-paper';
import {MaterialIcons} from '@expo/vector-icons';

export default function FilterRequests() {
  const {data: cities, refetch: refetchCities} =
    trpc.supplier.cities.get.useQuery(undefined, {initialData: []});

  const {data: sTypes, refetch} = trpc.supplier.services.get.all.useQuery(
    undefined,
    {initialData: []},
  );

  const addService = trpc.supplier.services.add.useMutation();
  const removeService = trpc.supplier.services.delete.useMutation();

  const addCity = trpc.supplier.cities.add.useMutation();
  const removeCity = trpc.supplier.cities.remove.useMutation();

  return (
    <>
      <Text variant="titleMedium">City</Text>
      <List.Section>
        {cities.map((o, i) => (
          <List.Item
            key={i}
            title={`${o.cities.nameEn}`}
            right={() => (
              <Checkbox
                status={o.supplierCities ? 'checked' : 'unchecked'}
                onPress={async () => {
                  o.supplierCities
                    ? await removeCity.mutateAsync({cityId: o.cities.id})
                    : await addCity.mutateAsync({cityId: o.cities.id});
                  refetchCities();
                }}
              />
            )}
          />
        ))}
      </List.Section>

      <Text variant="titleMedium">By service type</Text>
      <List.Section>
        {sTypes.map((o, i) => (
          <List.Item
            key={i}
            title={`${o.services.id}. ${o.services.name.en}`}
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
                status={o.supplierServices ? 'checked' : 'unchecked'}
                onPress={() => {
                  console.log('>>>', o.supplierServices, !!o.supplierServices);
                  if (!o.supplierServices)
                    addService.mutate(
                      {
                        // service_type:o.service_type,
                        service_type_id: o.services.id,
                      },
                      {onSuccess: () => refetch()},
                    );
                  else
                    removeService.mutate(
                      {
                        service_id: o.services.id,
                      },
                      {onSuccess: () => refetch()},
                    );
                }}
              />
            )}
          />
        ))}
      </List.Section>
    </>
  );
}
