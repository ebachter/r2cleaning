import {Modal} from 'react-native';
import {Appbar, Button, Dialog, Text} from 'react-native-paper';
import {useAppSelector} from '../redux/store';
import {setModals} from '../redux/functionsDispatch';

export default function ModalLogin() {
  const visibleLogin = useAppSelector((state) => state.cleaning.modals.login);

  return (
    <Modal
      animationType="fade"
      // onRequestClose={() => setModals({login: false})}
      presentationStyle="overFullScreen"
      visible={visibleLogin}
    >
      <Appbar.Header>
        <Appbar.Action icon="close" onPress={() => setModals({login: false})} />
        <Appbar.Content title="Войти" />
        <Button onPress={() => console.log('Save')}>Save</Button>
      </Appbar.Header>
      <Dialog.Content>
        <Text variant="bodyMedium">This is simple dialog</Text>
      </Dialog.Content>
    </Modal>
  );
}
