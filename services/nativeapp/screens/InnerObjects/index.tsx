import {Text, View, ScrollView} from 'react-native';
import {ListOfOrders} from './list';
import {mergeLocal} from '../../redux/functionsDispatch';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {IconButton} from 'react-native-paper';

export default function ScreenObjects({navigation}) {
  // const {message} = useAppSelector((state) => state.message);

  return (
    <ScrollView style={{backgroundColor: '#c7ddf2', padding: 5}}>
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
    </ScrollView>
  );
}
