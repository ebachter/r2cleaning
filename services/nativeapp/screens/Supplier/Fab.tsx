import * as React from 'react';
import {StyleSheet} from 'react-native';
import {FAB} from 'react-native-paper';
import {mergeLocal} from '../../redux/functionsDispatch';
import {useNavigation} from '@react-navigation/native';

const SupplierFab = () => {
  const navigation = useNavigation();

  return (
    <FAB
      icon="plus"
      style={styles.fab}
      onPress={() => navigation.navigate('SupplierRequests')}
      label="Find order"
    />
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default SupplierFab;
