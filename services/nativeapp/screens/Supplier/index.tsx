import {View, Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {trpcComp} from '../../trpc';
import {Checkbox, List, MD3Colors} from 'react-native-paper';
import {MaterialIcons} from '@expo/vector-icons';
import {Button} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../../routes';

export default function ScreenSuppler({}) {
  // const {message} = useAppSelector((state) => state.message);
  const {data: sTypes, refetch} = trpcComp.loadServiceOffers.useQuery();
  // console.log('sTypes_1', sTypes);

  // const {data: sOffers} = trpcComp.loadServiceOffers.useQuery();
  // console.log('sOffers', sOffers);

  /* const [serviceTypes, setServiceTypes] = useImmer<{
    [service_type_id: number]: true | false | null;
  }>({}); */

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
        <Button
          style={{
            marginTop: 5,
            width: '100%',
          }}
          appearance="outline"
          onPress={() => navigation.navigate('SupplierRequests')}
        >
          Search requests
        </Button>
        <Button
          style={{
            marginTop: 5,
            width: '100%',
          }}
          appearance="outline"
          onPress={() => navigation.navigate('SupplierRequests')}
        >
          Confirmed orders
        </Button>
        <Button
          style={{
            marginTop: 5,
            width: '100%',
          }}
          appearance="outline"
          onPress={() => navigation.navigate('SupplierServices')}
        >
          Offered services
        </Button>
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
