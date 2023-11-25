import * as React from 'react';
import {Button, View, Text} from 'react-native';
import {useAppSelector} from '../redux/store';

export default function OrderScreen({navigation}) {
  const {message} = useAppSelector((state) => state.message);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Заказ</Text>
      <Button
        title="Go to Home..."
        onPress={() => navigation.navigate('Home')}
      />
      <Text style={{marginTop: 5}}>Redux msg: {message}</Text>
    </View>
  );
}
