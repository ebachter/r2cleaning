import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, Button} from 'react-native';

export default function HomeScreen({navigation}) {
  const apiOrigin = process.env.EXPO_PUBLIC_API_ORIGIN;
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
