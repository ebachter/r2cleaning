import {View} from 'react-native';
import {Button} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import SupplierFab from './Fab';
import {useEffect, useState} from 'react';

export default function ScreenSuppler() {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    console.log('visible >>>', visible);
  }, [visible]);

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
          Confirmed requests
        </Button>
      </View>
      <SupplierFab />
    </>
  );
}
