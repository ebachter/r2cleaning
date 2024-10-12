import {StyleSheet} from 'react-native';
import {trpc} from '../../../trpc';
import {Checkbox, List, MD3Colors, Text} from 'react-native-paper';
import {MaterialIcons} from '@expo/vector-icons';

export default function FilterRequests() {
  const {data: cities, refetch: refetchCities} =
    trpc.supplier.cities.get.useQuery(undefined, {initialData: []});

  const {data: sTypes, refetch} = trpc.supplier.service.get.all.useQuery(
    undefined,
    {initialData: []},
  );

  const addService = trpc.supplier.service.add.useMutation();
  const removeService = trpc.supplier.service.delete.useMutation();

  const addCity = trpc.supplier.cities.add.useMutation();
  const removeCity = trpc.supplier.cities.remove.useMutation();

  return (
    <>
      <Text variant="titleMedium">City</Text>
      <List.Section>
        {cities.map((o, i) => (
          <List.Item
            key={i}
            title={`${o.city.nameEn}`}
            right={() => (
              <Checkbox
                status={o.supplierCity ? 'checked' : 'unchecked'}
                onPress={async () => {
                  o.supplierCity
                    ? await removeCity.mutateAsync({cityId: o.city.id})
                    : await addCity.mutateAsync({cityId: o.city.id});
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
            title={`${o.service.id}. ${o.service.name.en}`}
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
                status={o.supplierService ? 'checked' : 'unchecked'}
                onPress={() => {
                  console.log('>>>', o.supplierService, !!o.supplierService);
                  if (!o.supplierService)
                    addService.mutate(
                      {
                        // service_type:o.service_type,
                        service_type_id: o.service.id,
                      },
                      {onSuccess: () => refetch()},
                    );
                  else
                    removeService.mutate(
                      {
                        service_id: o.service.id,
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
