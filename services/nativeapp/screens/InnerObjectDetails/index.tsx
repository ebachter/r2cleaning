import * as React from 'react';
import {View} from 'react-native';
import {Button, Input} from '@ui-kitten/components';
// import SnackbarComp from '../components/Snackbar';
import {mergeLocal, showSnackbar} from '../../redux/functionsDispatch';
import {RouteProp, useRoute} from '@react-navigation/native';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Text, TextInput} from 'react-native-paper';
import {trpcComp} from '../../trpc';
import {RootStackParamList} from '../../routes';
// import Header from '../components/Header';

export default function ScreenObjectDetails({}) {
  // const {message} = useAppSelector((state) => state.message);
  const route = useRoute<RouteProp<RootStackParamList, 'ObjectDetails'>>();
  const {data} = trpcComp.loadObject.useQuery({
    objectId: Number(route.params.objectId),
  });
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
        value={String(data?.object_id) || ''}
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
