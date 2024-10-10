import * as React from 'react';
import {View} from 'react-native';
import {mergeLocal, showSnackbar} from '../../redux/functionsDispatch';
// import Header from '../components/Header';
import {StyleSheet} from 'react-native';
import {FAB, Text} from 'react-native-paper';
import {ListOfOrders} from './list';

export default function DetailsScreen({}) {
  return (
    <>
      <View
        style={{
          flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          backgroundColor: 'aliceblue',
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <Text variant="titleLarge" style={{marginTop: 10, marginBottom: 10}}>
          My orders
        </Text>

        <ListOfOrders />
        <View style={{marginTop: 5, marginBottom: 5}} />
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => mergeLocal({modals: {addOrder: true}})}
          label="Create new order"
          size="small"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
