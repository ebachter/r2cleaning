import {ScrollView, View} from 'react-native';
import {StyleSheet} from 'react-native';
import {FAB, Portal, Text} from 'react-native-paper';
import {trpc} from '../../trpc';
import CardComponent from './card';
import ModalAddOrder from './AddOrder';
import {useState} from 'react';

export default function DetailsScreen() {
  const {data, refetch} = trpc.user.orders.get.all.useQuery(undefined, {
    initialData: [],
  });
  const [visible, setVisible] = useState(false);

  return (
    <>
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
        onPress={() => setVisible(true)}
        label="New order"
        size="small"
      />
      <Portal>
        <ModalAddOrder
          visible={visible}
          setVisible={setVisible}
          refetch={refetch}
        />
      </Portal>
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
