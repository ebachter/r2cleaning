/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import {ObjectTypeRadio} from './Step1ObjectTypes';
import {Button} from 'react-native-paper';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import ObjectDetails from './ObjectDetails';
import {useAppSelector} from '../../redux/store';
import Appartment from './Step2Details/appartment';
import House from './Step2Details/house';
import {trpcFunc} from '../../trpc';
import {
  setOrder,
  setOrderFormInit,
  showSnackbar,
} from '../../redux/functionsDispatch';

export default function OrderStepper() {
  const objectType = useAppSelector((state) => state.cleaning.order.objectType);
  const phoneNumber = useAppSelector(
    (state) => state.cleaning.order.review.phone,
  );
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <View style={styles.container}>
      <View style={styles.page}>
        {/* <Text>{steps[currentPage]?.label || currentPage}</Text> */}
        <View>
          <Text>Тип объекта:</Text>
          <ObjectTypeRadio />
        </View>
        <View>
          {
            // ObjectDetails
            objectType === 'appartment' ? (
              <Appartment />
            ) : objectType === 'house' ? (
              <House />
            ) : null
          }
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 30,
          marginBottom: 30,
        }}
      >
        <View>
          <Button
            // mode="outlined"
            onPress={() => navigation.navigate('HomeInt')}
            style={{width: 90, borderRadius: 5, marginLeft: 10}}
            compact={true}
            labelStyle={{marginTop: 2, marginBottom: 2}}
          >
            Отмена
          </Button>
        </View>

        <View>
          <Button
            mode="contained"
            onPress={async () => {
              const newOrder = await trpcFunc.createOrder.mutate({
                objectType,
              });
              setOrder({orderCreated: true});
              showSnackbar({text: `Order ${newOrder.newOrderId} created`});
              setOrderFormInit();
              navigation.navigate('Orders');
            }}
            style={{flex: 1, borderRadius: 5, marginRight: 10}}
            compact={true}
            labelStyle={{marginTop: 2, marginBottom: 2}}
          >
            Add
          </Button>
        </View>
      </View>
    </View>
  );
}

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  stepIndicator: {
    marginVertical: 50,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: '#999999',
  },
  stepLabelSelected: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: '#4aae4f',
  },
});
