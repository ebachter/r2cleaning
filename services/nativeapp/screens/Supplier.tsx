import {View, Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {trpcComp, trpcFunc} from '../trpc';
import {Checkbox, List, MD3Colors} from 'react-native-paper';
import {MaterialIcons} from '@expo/vector-icons';

export default function ScreenSuppler() {
  // const {message} = useAppSelector((state) => state.message);
  const {data: sTypes, refetch} = trpcComp.loadServiceOffers.useQuery();
  // console.log('sTypes_1', sTypes);

  // const {data: sOffers} = trpcComp.loadServiceOffers.useQuery();
  // console.log('sOffers', sOffers);

  /* const [serviceTypes, setServiceTypes] = useImmer<{
    [service_type_id: number]: true | false | null;
  }>({}); */

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
          <List.Subheader>Offered services</List.Subheader>
          {(sTypes || []).map((o, i) => (
            <List.Item
              key={i}
              title={`${o.service_type_id}. ${o.serviceName.en}`}
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
                  status={o.service_type ? 'checked' : 'unchecked'}
                  onPress={async () => {
                    await trpcFunc.setServiceOffer.mutate({
                      // service_type:o.service_type,
                      service_type_id: o.service_type_id,
                      value: !o.service_type,
                    });
                    refetch();
                  }}
                />
              )}
              // onPress={() =>
              //   navigation.navigate('ObjectDetails', {objectId: o.object_id})
              // }
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
