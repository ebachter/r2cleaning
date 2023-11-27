import * as React from 'react';
import {Button, View, Text, StyleSheet, ImageBackground} from 'react-native';
import {useAppSelector} from '../../redux/store';
import MenuComponent from './MenuComponent';
import {ObjectTypeRadio} from './ObjectTypeRadio';

export default function OrderScreen({navigation}) {
  const {message} = useAppSelector((state) => state.message);

  return (
    <View
      style={{
        width: '100%',
        minHeight: 500,
        // height: 'auto',
      }}
    >
      <View style={[styles.container, {alignItems: 'center'}]}>
        <ImageBackground
          source={require('../../assets/cleaning.order.header.jpg')}
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',

            maxWidth: '100%',
            marginBottom: 10,

            // opacity: 0.5,
            // paddingTop: 8,
            // paddingBottom: 8,
          }}
          resizeMode="cover"
        >
          <Text style={{color: 'white', fontSize: 30, marginBottom: 10}}>
            {'Оформление заказа'}
          </Text>
        </ImageBackground>
      </View>

      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Заказ</Text>

        <Button
          title="Go to Home..."
          onPress={() => navigation.navigate('Home')}
        />
        <Text style={{marginTop: 5}}>Redux msg: {message}</Text>
      </View>
      <ObjectTypeRadio />
      <View>
        <MenuComponent />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
    backgroundColor: 'aliceblue',
    minHeight: 200,
  },
});
