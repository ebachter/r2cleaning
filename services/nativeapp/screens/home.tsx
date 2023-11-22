import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, Button} from 'react-native';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {setMessage} from '../redux/initSlice';

export default function HomeScreen({navigation}) {
  const dispatch = useAppDispatch();
  const apiOrigin = process.env.EXPO_PUBLIC_API_ORIGIN;
  const {message} = useAppSelector((state) => state.message);
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>

      <Text>Open up App.js to start working on your app!!</Text>
      <Text>EXPO_PUBLIC_API_ORIGIN: {apiOrigin}</Text>
      <StatusBar style="auto" />
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
      <Text style={{marginTop: 5}}>Redux msg: {message}</Text>
      <Button
        title="Set new message"
        onPress={() => dispatch(setMessage('New Message from Component'))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
