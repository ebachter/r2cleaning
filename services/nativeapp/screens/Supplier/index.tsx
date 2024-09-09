import {View} from 'react-native';
import {StyleSheet} from 'react-native';
import {Button} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';

export default function ScreenSuppler({}) {
  const navigation = useNavigation();

  return (
    <>
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
          Confirmed requests
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
