import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';

export default function App() {
  const apiOrigin = process.env.EXPO_PUBLIC_API_ORIGIN;
  return (
    <View style={styles.container}>
      <Text>#o#Open up App.js to start working on your app!!</Text>
      <Text>EXPO_PUBLIC_API_ORIGIN: {apiOrigin}</Text>
      <StatusBar style="auto" />
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
