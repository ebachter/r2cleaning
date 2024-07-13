import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';

/* export const ScreenTemplate = ({children}) => (
  <SafeAreaView style={styles.container}>
    <ScrollView style={styles.scrollView}>{children}</ScrollView>
  </SafeAreaView>
); */

export const ScreenTemplate = ({children}) => (
  <SafeAreaView style={styles.container}>{children}</SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'yellow',
  },
  scrollView: {
    flex: 1,
    // backgroundColor: 'pink',
  },
});
