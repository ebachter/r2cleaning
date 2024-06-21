import * as React from 'react';
import {View} from 'react-native';
import {Button, Input} from '@ui-kitten/components';
// import SnackbarComp from '../components/Snackbar';
import {showSnackbar} from '../../redux/functionsDispatch';
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@remrob/mysql';
import {Text, TextInput} from 'react-native-paper';
import {trpcComp} from '../../trpc';
// import Header from '../components/Header';

export default function ScreenOrderDetails({}) {
  // const {message} = useAppSelector((state) => state.message);
  // const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Details'>>();
  const {data} = trpcComp.loadOrder.useQuery({
    orderId: Number(route.params.orderId),
  });
  const [text, setText] = React.useState('_');

  return (
    <>
      {/* <View>
        <Header />
      </View> */}
      <Text variant="titleMedium" style={{margin: 5}}>
        Order {route.params.orderId} details
      </Text>
      <View style={{marginTop: 15}} />
      <TextInput
        style={{margin: 5}}
        label="Order ID"
        value={String(data?.order_id) || ''}
        onChangeText={(text) => setText(text)}
        disabled
      />

      <View style={{marginTop: 15}} />
      <Input
        style={{margin: 5}}
        value={data?.object_type || ''}
        label="Object type"
        // placeholder="Place your text"
        // caption={renderCaption}
        // accessoryRight={renderIcon}
        // secureTextEntry={secureTextEntry}
        onChangeText={(nextValue) => setText(nextValue)}
        disabled
      />

      <View style={{marginTop: 15}} />
      <Input
        style={{margin: 5}}
        value={'Private cleaner inc.'}
        label="Исполнитель"
        // placeholder="Place your text"
        // caption={renderCaption}
        // accessoryRight={renderIcon}
        // secureTextEntry={secureTextEntry}
        onChangeText={(nextValue) => setText(nextValue)}
        disabled
      />

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
        <Button onPress={() => showSnackbar({text: 'abcd'})}>
          Show Snackbar
        </Button>
      </View>
    </>
  );
}
