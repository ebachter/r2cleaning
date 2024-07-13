import * as React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Button} from '@ui-kitten/components';
import {ListOfOrders} from './list';
import {ScreenTemplate} from '../../components/Wrapper';
import {mergeLocal} from '../../redux/functionsDispatch';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {IconButton} from 'react-native-paper';

export default function ScreenObjects({navigation}) {
  // const {message} = useAppSelector((state) => state.message);

  return (
    <>
      <View
        style={{
          padding: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View>
          <Text>Objects list</Text>
        </View>
        <View>
          <IconButton
            style={{borderRadius: 5}}
            mode="outlined"
            icon={() => <MaterialIcons name="add" size={24} color="black" />}
            onPress={() => mergeLocal({modals: {addObject: true}})}
          />
        </View>
      </View>

      <ListOfOrders />
    </>
  );
}
