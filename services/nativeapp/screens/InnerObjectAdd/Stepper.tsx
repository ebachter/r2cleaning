/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import {ObjectTypeRadio} from './ObjectType';
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
import {Location} from './Location';
import {Card, Divider} from '@ui-kitten/components';
import {Area} from './Area';

export default function OrderStepper() {
  const {object_type, area, address_city, address_street} = useAppSelector(
    (state) => state.object,
  );
  /* const phoneNumber = useAppSelector(
    (state) => state.cleaning.order.review.phone,
  ); */
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <View style={styles.container}>
      <View style={styles.page}>
        {/* <Text>{steps[currentPage]?.label || currentPage}</Text> */}
        <View>
          <Text>Тип объекта:</Text>
          <ObjectTypeRadio />
        </View>

        <Divider style={styles.divider} />
        <Text>Object data:</Text>
        <View>
          <Area />
        </View>
        <View>
          {
            // ObjectDetails
            object_type === 'appartment' ? (
              <Appartment />
            ) : object_type === 'house' ? (
              <House />
            ) : (
              <Text>Select object type</Text>
            )
          }
        </View>

        <Divider style={styles.divider} />
        <Card>
          <Location />
        </Card>
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
              console.log(object_type, area, address_city, address_street);
              if (!object_type || !area || !address_city || !address_street)
                return;
              const newOrder = await trpcFunc.addObject.mutate({
                object_type: object_type,
                area,
                address_city: address_city,
                address_street: address_street,
                object_details: {
                  objectType: 'appartment', // object_type, //
                  rooms: [
                    {
                      type: 'bedroom',
                      floor: 'laminat',
                      walls: 'color',
                    },
                  ],
                  kitchen: [
                    {
                      sink: true,
                      refrigerator: true,
                      oven: true,
                      floor: 'laminat',
                      walls: 'color',
                    },
                  ],
                  restroom: [
                    {
                      floor: 'laminat',
                      walls: 'color',
                      bath: true,
                      toilet: true,
                    },
                  ],
                  // floors:{number:2},
                  // elevator: true
                },
              });
              // setOrder({orderCreated: true});
              showSnackbar({text: `Object ${newOrder.newObjectId} created`});
              // setOrderFormInit();
              // navigation.navigate('Orders');
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
  captionText: {
    fontSize: 12,
    fontWeight: '400',
    // fontFamily: 'opensans-regular',
    color: '#8F9BB3',
  },
  divider: {
    alignSelf: 'stretch',
    backgroundColor: 'grey',
    marginTop: 20,
    marginBottom: 10,
  },
});
