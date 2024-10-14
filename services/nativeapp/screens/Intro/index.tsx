import * as React from 'react';
import {ScrollView, View} from 'react-native';
import {mergeLocal} from '../../redux/functionsDispatch';
// import Header from '../components/Header';
import {StyleSheet} from 'react-native';
import {FAB, Text} from 'react-native-paper';
import {trpc} from '../../trpc';
import CardComponent from './card';

export default function DetailsScreen() {
  const {data} = trpc.user.orders.get.all.useQuery(undefined, {
    initialData: [],
  });
  return (
    <>
      {/* <View
        style={{
          flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          backgroundColor: 'aliceblue',
          paddingLeft: 10,
          paddingRight: 10,
        }}
      > */}
      <ScrollView style={{backgroundColor: '#c7ddf2', padding: 5}}>
        <Text variant="titleLarge" style={{marginTop: 10, marginBottom: 10}}>
          My orders
        </Text>
        {data.map((o, i) => (
          <CardComponent
            key={i}
            objectType={o.objectTypes.name.en}
            orderId={o.requests.id}
            data={o}
          />
        ))}
        <View style={{marginTop: 75}} />
      </ScrollView>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => mergeLocal({modals: {addOrder: true}})}
        label="New order"
        size="small"
      />
      {/* </View> */}
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
