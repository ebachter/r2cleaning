import {View, Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {trpcComp} from '../../../trpc';
import {Checkbox, List, MD3Colors} from 'react-native-paper';
import {MaterialIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../../../routes';

export default function ScreenSupplierRequests() {
  // const {message} = useAppSelector((state) => state.message);
  const {data: res} = trpcComp.loadRequestsForSupplier.useQuery(undefined, {
    initialData: [],
  });
  console.log('>>>res<<<', res);
  const {data: sTypes, refetch} = trpcComp.loadServiceOffers.useQuery();
  // console.log('sTypes_1', sTypes);

  // const {data: sOffers} = trpcComp.loadServiceOffers.useQuery();
  // console.log('sOffers', sOffers);

  /* const [serviceTypes, setServiceTypes] = useImmer<{
    [service_type_id: number]: true | false | null;
  }>({}); */

  const {data} = trpcComp.loadOrders.useQuery();
  const navigation = useNavigation<StackNavigation>();

  return (
    <>
      {/* <View>
        <Header />
      </View> */}

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'aliceblue',
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        {/* <Text>Supplier</Text> */}

        <List.Section>
          <List.Subheader>List of orders</List.Subheader>
          {res.map((o, i) => (
            <List.Item
              key={i}
              title={`Заказ ${o.order.id}. ${o.object.type}`}
              left={() => (
                <List.Icon
                  color={MD3Colors.tertiary70}
                  icon={(props) => (
                    <MaterialIcons name="cleaning-services" {...props} />
                  )}
                />
              )}
              // right={() => <>{o.price || ''}</>}
              onPress={() =>
                navigation.navigate('SupplierRequest', {requestId: o.order.id})
              }
            />
          ))}
        </List.Section>
      </View>
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
