import * as React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {ObjectTypeRadio} from './ObjectType';
import {Button} from 'react-native-paper';
import {useAppSelector} from '../../redux/store';
import Appartment from './Step2Details/appartment';
import House from './Step2Details/house';
import {trpcComp} from '../../trpc';
import {mergeLocal, showSnackbar} from '../../redux/functionsDispatch';
import {Location} from './Location';
import {Card, Divider} from '@ui-kitten/components';
import {Area} from './Area';
import {useNavigation} from '@react-navigation/native';

export default function OrderStepper() {
  const {
    type: object_type,
    area,
    addressCity,
    addressStreet,
  } = useAppSelector((state) => state.object);

  const object = trpcComp.user.addObject.useMutation({
    onSuccess(data) {
      mergeLocal({modals: {addObject: false}});
      showSnackbar({text: `Object ${data.newObjectId} created`});
    },
  });
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.page}>
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
            object_type === 2 ? ( // 'appartment'
              <Appartment />
            ) : object_type === 1 ? ( // 'house'
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
            onPress={() => mergeLocal({modals: {addObject: false}})}
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
            onPress={() => {
              console.log(object_type, area, addressCity, addressStreet);
              if (!object_type || !area || !addressCity || !addressStreet)
                return;

              object.mutate(
                {
                  type: object_type,
                  area: String(area),
                  addressCity: addressCity,
                  addressStreet: addressStreet,
                  details: {
                    object_type: 'appartment',

                    numberOfRooms: {number: 1, price: 2000},
                    kitchen: {
                      all: {value: false, price: 1500},
                      sink: {value: false, price: 500},
                      refrigerator: {value: false, price: 500},
                      oven: {value: false, price: 500},
                    },
                    bathroom: {include: false, area: 0, price: 1000},

                    // floors:{number:2},
                    // elevator: true
                  },
                },
                {
                  onSuccess: async ({newObjectId}) => {
                    navigation.navigate('ObjectDetails', {
                      objectId: newObjectId,
                    });
                  },
                },
              );
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
