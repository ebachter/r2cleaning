import * as React from 'react';
import {View} from 'react-native';
import {Button, Input} from '@ui-kitten/components';
// import SnackbarComp from '../components/Snackbar';
import {RouteProp, useRoute} from '@react-navigation/native';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Text, TextInput} from 'react-native-paper';
import {trpcComp} from '../../trpc';
import {RootStackParamList} from '../../routes';
import {mergeLocal, showSnackbar} from '../../redux/functionsDispatch';
// import Header from '../components/Header';

export default function ScreenOrderDetails({}) {
  // const {message} = useAppSelector((state) => state.message);
  const route = useRoute<RouteProp<RootStackParamList, 'OrderDetails'>>();
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
        value={String(data?.id) || ''}
        onChangeText={(text) => setText(text)}
        disabled
      />

      <View style={{marginTop: 15}} />
      <Input
        style={{margin: 5}}
        value={String(data?.objectId) || ''}
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
    </>
  );
}
