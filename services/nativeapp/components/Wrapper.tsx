import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';

export const ScreenTemplate = ({children}) => (
  <SafeAreaView style={styles.container}>
    <ScrollView>{children}</ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
