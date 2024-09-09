import {Input} from '@ui-kitten/components';
import * as React from 'react';
import {View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {Text, TextInput} from 'react-native-paper';
import {trpcComp} from '../../trpc';
import {RouteProps} from '../../types/typesNavigation';
// import Header from '../components/Header';

export default function ScreenObjectDetails({}) {
  // const {message} = useAppSelector((state) => state.message);
  const route = useRoute<RouteProps<'ObjectDetails'>>();

  const {data} = trpcComp.loadObject.useQuery(
    {
      objectId: Number(route.params.objectId),
    },
    {initialData: {objectType: {name: {en: ''}}}},
  );

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
        value={data?.objectType.name.en}
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
