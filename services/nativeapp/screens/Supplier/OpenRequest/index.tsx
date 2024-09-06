import * as React from 'react';
import {View} from 'react-native';
import {Button, Input} from '@ui-kitten/components';
// import SnackbarComp from '../components/Snackbar';
import {RouteProp, useRoute} from '@react-navigation/native';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Text, TextInput} from 'react-native-paper';
import {trpcComp} from '../../../trpc';
import {RootStackParamList} from '../../../routes';
import {mergeLocal, showSnackbar} from '../../../redux/functionsDispatch';
// import Header from '../components/Header';

export default function ScreenSupplierRequest() {
  // const {message} = useAppSelector((state) => state.message);
  const route = useRoute<RouteProp<RootStackParamList, 'SupplierRequest'>>();
  const {data: res} = trpcComp.loadRequestForSupplier.useQuery(
    {
      requestId: Number(route.params.requestId),
    },
    {initialData: {order: {id: 0}, objectType: {name: {en: ''}}}},
  );
  /* const {data} = trpcComp.loadOrder.useQuery({
    orderId: Number(route.params.requestId),
  }); */
  const [text, setText] = React.useState('_');

  return (
    <>
      {/* <View>
        <Header />
      </View> */}
      <Text variant="titleMedium" style={{margin: 5}}>
        Request {route.params.requestId} details
      </Text>
      <View style={{marginTop: 15}} />
      <TextInput
        style={{margin: 5}}
        label="Request ID"
        value={String(res.order.id)}
        onChangeText={(text) => setText(text)}
        disabled
      />

      <View style={{marginTop: 15}} />
      <Input
        style={{margin: 5}}
        value={String(res.objectType.name.en)}
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
