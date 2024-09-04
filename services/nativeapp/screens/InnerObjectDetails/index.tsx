import {Input} from '@ui-kitten/components';
import * as React from 'react';
import {View} from 'react-native';
// import SnackbarComp from '../components/Snackbar';
import {RouteProp, useRoute} from '@react-navigation/native';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Text, TextInput} from 'react-native-paper';
import {RootStackParamList} from '../../routes';
import {trpcComp} from '../../trpc';
// import Header from '../components/Header';

export default function ScreenObjectDetails({}) {
  // const {message} = useAppSelector((state) => state.message);
  const route = useRoute<RouteProp<RootStackParamList, 'ObjectDetails'>>();
  const {data} = trpcComp.loadObject.useQuery({
    objectId: Number(route.params.objectId),
  });
  const [foo, setFoo] = React.useState([]);
  trpcComp.onChannel.useSubscription(
    {},
    {
      onData(data) {
        console.log({data});
        setFoo([...foo, data]);
      },
      enabled: true,
    },
  );

  console.log('Some foo', foo);
  const [text, setText] = React.useState('_');

  return (
    <>
      {/* <View>
        <Header />
      </View> */}
      <Text variant="titleMedium" style={{margin: 5}}>
        Object {route.params.objectId} details
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
        value={data?.type || ''}
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

      {foo.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </>
  );
}
