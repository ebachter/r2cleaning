import {
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Appbar, Button, Dialog, Text} from 'react-native-paper';
import {SelectObject} from './SelectObject';
import {AutocompleteElem} from './SelectService';
import {SelectDate} from './SelectDate';
import {useAppSelector} from '../../../redux/store';
import {trpc} from '../../../trpc';
import {mergeOrder, showSnackbar} from '../../../redux/functionsDispatch';

export default function ModalAddOrder({
  visible,
  setVisible,
  refetch,
}: {
  visible: boolean;
  setVisible: (p: boolean) => void;
  refetch: () => void;
}) {
  const {
    type: object_type,
    id: object_id,
    addressCity: address_city,
    area,
  } = useAppSelector((state) => state.request.object);
  const {
    service: {type: serviceType},
    orderCreated,
    date,
  } = useAppSelector((state) => state.request);
  const request = trpc.user.orders.create.useMutation({
    onSuccess(data, variables, context) {
      mergeOrder({orderCreated: true});
      showSnackbar({text: `Request ${data.newOrderId} created`});
      // setOrderFormInit();
      // setVisible(false);
      // navigation.navigate('Intro');
    },
  });
  return (
    // https://github.com/callstack/react-native-paper/issues/3575
    <Modal
      animationType="fade"
      onRequestClose={() => setVisible(false)}
      presentationStyle="overFullScreen"
      visible={visible}
    >
      <Appbar.Header>
        <Appbar.Action icon="close" onPress={() => setVisible(false)} />
        <Appbar.Content title="New order" />
        <Button onPress={() => setVisible(false)}>Close</Button>
      </Appbar.Header>
      <Dialog.Content style={styles.container}>
        <ImageBackground
          source={require('../../../assets/cleaning.order.header.jpg')}
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            marginBottom: 10,
            minHeight: 200,
            // opacity: 0.5,
            // paddingTop: 8,
            // paddingBottom: 8,
          }}
          resizeMode="cover"
        >
          <Text style={{color: 'white', fontSize: 30, marginBottom: 10}}>
            {'Оформление заявки'}
          </Text>
        </ImageBackground>

        <ScrollView
          style={{
            width: '100%',
          }}
        >
          <Text variant="titleLarge" style={{marginTop: 20}}>
            Order data
          </Text>
          <View style={{marginTop: 20}}>
            <SelectObject />
          </View>
          <View style={{marginTop: 20}}>
            <AutocompleteElem />
          </View>
          <View style={{marginTop: 20}}>
            <SelectDate />
          </View>
          <View style={{marginTop: 20}}>
            <Button
              mode="contained"
              onPress={async () => {
                const res = await request.mutateAsync({
                  object_id,
                  // price: String(price),
                  serviceId: serviceType,
                  date: date.toISOString().split('T')[0],
                });
                if ((res.status = 'success')) {
                  setVisible(false);
                  showSnackbar({
                    text:
                      res.status === 'success'
                        ? 'Order successfully created'
                        : 'Something went wrong',
                  });
                }
              }}
              // style={{flex: 1, borderRadius: 5, marginRight: 10}}
              compact={true}
              // labelStyle={{marginTop: 2, marginBottom: 2}}
            >
              Заказать
            </Button>
          </View>
        </ScrollView>
      </Dialog.Content>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center', //Centered vertically
    alignItems: 'center', //Centered horizontally
    flex: 1,
    backgroundColor: 'aliceblue',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
});
