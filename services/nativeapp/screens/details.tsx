import * as React from 'react';
import {View, Text} from 'react-native';
import {useAppSelector} from '../redux/store';
import {Button} from '@ui-kitten/components';
import {sessionSet} from '../redux/functionsDispatch';

export default function DetailsScreen({navigation}) {
  // const {message} = useAppSelector((state) => state.message);

  return (
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
      <Text>Details Screen</Text>

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

      <Button onPress={() => navigation.navigate('Home')}>Go to Home...</Button>

      <Button
        style={{marginTop: 20}}
        onPress={() => sessionSet({sessionToken: null})}
      >
        Logout
      </Button>

      {/* <Text style={{marginTop: 5}}>Redux msg: {message}</Text> */}
    </View>
  );
}
