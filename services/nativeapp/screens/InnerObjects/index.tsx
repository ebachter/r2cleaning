import * as React from 'react';
import {Text, StyleSheet} from 'react-native';
import {Button} from '@ui-kitten/components';
import {ListOfOrders} from './list';
import {ScreenTemplate} from '../../components/Wrapper';
// import Header from '../components/Header';

export default function ScreenObjects({navigation}) {
  // const {message} = useAppSelector((state) => state.message);

  return (
    <>
      <Text>Objects list</Text>
      <ListOfOrders />
    </>
  );
}
