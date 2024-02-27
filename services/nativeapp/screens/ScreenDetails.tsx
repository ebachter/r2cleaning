import * as React from 'react';
import {View, Text} from 'react-native';
import {Button} from '@ui-kitten/components';
import SnackbarComp from '../components/Snackbar';
import {showSnackbar} from '../redux/functionsDispatch';
// import Header from '../components/Header';

export default function DetailsScreen({navigation}) {
  // const {message} = useAppSelector((state) => state.message);

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
        <Text>Home screen</Text>

        <Button
          style={{
            marginTop: 10,
            marginBottom: 5,
            width: '100%',
          }}
          appearance="outline"
          onPress={() => navigation.navigate('Order')}
        >
          Сделать заявку
        </Button>

        <Button
          style={{
            marginTop: 5,
            width: '100%',
          }}
          appearance="outline"
          onPress={() => navigation.navigate('Orders')}
        >
          Активные заказы
        </Button>

        <Button
          style={{
            marginTop: 10,
            marginBottom: 40,
            width: '100%',
          }}
          appearance="outline"
        >
          История заявок
        </Button>

        <Button onPress={() => showSnackbar({text: 'abcd'})}>
          Show Snackbar
        </Button>
      </View>
    </>
  );
}
