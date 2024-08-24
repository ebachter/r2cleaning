import {Modal, StyleSheet} from 'react-native';
import {Appbar, Button, Dialog, Text} from 'react-native-paper';
import {addressStreet} from '../../redux/store';
import {mergeLocal, mergeSession} from '../../redux/functionsDispatch';
import ScreenOrderAdd from './intro';

export default function ModalAddOrder() {
  const visibleModal = addressStreet((state) => state.local.modals.addOrder);

  return (
    <Modal
      animationType="fade"
      // onRequestClose={() => setModals({login: false})}
      presentationStyle="overFullScreen"
      visible={visibleModal}
    >
      <Appbar.Header>
        <Appbar.Action
          icon="close"
          onPress={() => {
            mergeLocal({modals: {addOrder: false}});
          }}
        />
        <Appbar.Content title="Add order" />
        <Button onPress={() => console.log('Save')}>Save</Button>
      </Appbar.Header>
      <Dialog.Content style={styles.container}>
        {/* <Text variant="bodyMedium" style={{marginTop: 20, marginBottom: 20}}>
          Войти в Клининг.тек
        </Text> */}
        <ScreenOrderAdd />
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
