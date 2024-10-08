import {View} from 'react-native';
import {StyleSheet} from 'react-native';
import {trpc} from '../../../trpc';
import {Divider, List, MD3Colors, Text} from 'react-native-paper';
import {MaterialIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import FilterRequests from './Filter';

export default function ScreenSupplierRequests() {
  const {data: res} = trpc.user.loadRequestsForSupplier.useQuery(undefined, {
    initialData: [],
  });

  const navigation = useNavigation();

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          backgroundColor: 'aliceblue',
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        {/* <Text>Supplier</Text> */}
        <Text variant="headlineSmall" style={{marginTop: 20}}>
          Filter preferencies
        </Text>

        <List.Section>
          <FilterRequests />

          <Divider />

          <Text variant="headlineSmall" style={{marginTop: 20}}>
            Available orders
          </Text>
          {res.map((o, i) => (
            <List.Item
              key={i}
              title={`Заявка ${o.request.id}. ${o.object.type}`}
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
                navigation.navigate('SupplierRequest', {
                  orderId: String(o.request.id),
                })
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
