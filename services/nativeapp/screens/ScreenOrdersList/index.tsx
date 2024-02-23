import * as React from 'react';
import {View, Text} from 'react-native';
import {Button} from '@ui-kitten/components';
import {ListOfOrders} from './list';
// import Header from '../components/Header';

export default function OrdersScreen({navigation}) {
  // const {message} = useAppSelector((state) => state.message);

  return (
    <>
      {/* <View>
        <Header />
      </View> */}

      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          // justifyContent: 'center',
          backgroundColor: 'aliceblue',
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <Text>Orders list</Text>
        <ListOfOrders />

        {/* <Button onPress={() => navigation.navigate('HomeInt')}>
          Go to Home...
        </Button> */}
      </View>
    </>
  );
}
