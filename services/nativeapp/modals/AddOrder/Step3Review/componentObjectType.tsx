import {Text} from 'react-native-paper';
import {useAppSelector} from '../../../redux/store';
import {StyleSheet, View} from 'react-native';

export default function ComponentObjectType() {
  const {
    addressStreet,
    objectType: {
      name: {en: objectLabel},
    },
  } = useAppSelector((state) => state.cleaning.object);
  const {
    service: {label: serviceLabel},
    date,
  } = useAppSelector((state) => state.cleaning);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Тип объекта: {objectLabel}</Text>
      <Text style={styles.text}>Service type: {serviceLabel}</Text>

      <Text style={styles.text}>
        Date:
        {[
          ('0' + date.getDate()).slice(-2),
          ('0' + (date.getMonth() + 1)).slice(-2),
          date.getFullYear(),
        ].join('-')}
      </Text>

      <Text style={styles.text}>Address: {addressStreet}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    marginTop: 10,
  },
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
