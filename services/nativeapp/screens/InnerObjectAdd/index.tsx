import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from 'react-native';
import OrderStepper from './Stepper';
import {useRoute} from '@react-navigation/native';

export default function OrderScreen(options) {
  const route = useRoute();
  return (
    <ScrollView
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
            {'Add object'}
          </Text>
        </ImageBackground>
      </View>

      <View>
        <OrderStepper />
      </View>
    </ScrollView>
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
