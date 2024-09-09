import {View, Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {trpcComp} from '../../../trpc';
import {List, MD3Colors} from 'react-native-paper';
import {MaterialIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

export default function ScreenSupplierRequests() {
  const {data: res} = trpcComp.loadRequestsForSupplier.useQuery(undefined, {
    initialData: [],
  });

  const navigation = useNavigation();

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
          <List.Subheader>List of requests</List.Subheader>
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
                  requestId: String(o.request.id),
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
