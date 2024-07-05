import * as React from 'react';
import {View, Text} from 'react-native';
import {Button} from '@ui-kitten/components';
// import SnackbarComp from '../components/Snackbar';
import {mergeLocal, showSnackbar} from '../redux/functionsDispatch';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../routes';
// import Header from '../components/Header';

export default function DetailsScreen({}) {
  // const {message} = useAppSelector((state) => state.message);
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
        <Text>Home screen</Text>

        <Button
          style={{
            marginTop: 10,
            marginBottom: 5,
            width: '100%',
          }}
          appearance="outline"
          onPress={() => navigation.navigate('Objects')}
        >
          Объекты
        </Button>

        <Button
          style={{
            marginTop: 5,
            width: '100%',
          }}
          appearance="outline"
          onPress={() => navigation.navigate('Orders')}
        >
          Заказы
        </Button>

        {/* <Button
          style={{
            marginTop: 10,
            marginBottom: 40,
            width: '100%',
          }}
          appearance="outline"
        >
          История заявок
        </Button> */}
        <View style={{marginTop: 5, marginBottom: 5}} />
        <Button onPress={() => mergeLocal({modals: {addObject: true}})}>
          Add object
        </Button>
        <View style={{marginTop: 5, marginBottom: 5}} />
        <Button onPress={() => mergeLocal({modals: {addOrder: true}})}>
          Create order
        </Button>
      </View>
    </>
  );
}
