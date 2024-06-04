import {StyleSheet, View, Dimensions} from 'react-native';
import City from './City';
import AdressInput from './AdressInput';
import {Text} from '@ui-kitten/components';

export const Location = () => (
  <View>
    <View>
      <Text category="label">Location</Text>
    </View>

    <Text style={{marginTop: 20, marginBottom: 10}}>Город:</Text>
    <City />

    <Text style={{marginTop: 20, marginBottom: 10}}>Адрес:</Text>
    <AdressInput />
    {/* <View style={{marginTop: 20}}>
<Text style={styles.captionText}>Object is succesfully created!</Text>
</View> */}
  </View>
);
