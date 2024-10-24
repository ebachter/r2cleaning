// import {Typography} from '@mui/material';
import {Text} from 'react-native-paper';
import {useAppSelector} from '../../../redux/store';
import {objectTypes} from '../../../shared';
import {StyleSheet, View} from 'react-native';

export default function ComponentObjectType() {
  const {object_type, address_street} = useAppSelector(
    (state) => state.cleaning.object,
  );
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Тип объекта: {objectTypes.find((o) => o.id === object_type)?.label}
      </Text>

      <Text style={styles.text}>Address: {address_street}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    margin: 2,
  },
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
