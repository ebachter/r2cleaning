import {StyleSheet, Text, View} from 'react-native';
import {AutocompleteElem} from './Autocomplete';
import {OrderDate} from './date';

export default function () {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Select service type:</Text>
      <View>
        <AutocompleteElem />
      </View>
      <Text style={styles.text}>Select date:</Text>
      <View>
        <OrderDate />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    margin: 2,
    marginTop: 15,
  },
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
