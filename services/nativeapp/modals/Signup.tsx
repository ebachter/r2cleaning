import {Modal} from 'react-native';
import {Appbar, Button, Dialog, Text} from 'react-native-paper';
import {useAppSelector} from '../redux/store';
import {setModals} from '../redux/functionsDispatch';

export default function ModalFullscreen() {
  const visibleSignup = useAppSelector((state) => state.cleaning.modals.signup);

  return (
    <Modal
      animationType="fade"
      // onRequestClose={() => setModals({signup: false})}
      presentationStyle="overFullScreen"
      visible={visibleSignup}
    >
      <Appbar.Header>
        <Appbar.Action
          icon="close"
          onPress={() => setModals({signup: false})}
        />
        <Appbar.Content title="Регистрация" />
        <Button onPress={() => console.log('Save')}>Save</Button>
      </Appbar.Header>
      <Dialog.Content>
        <Text variant="bodyMedium">This is simple dialog</Text>
      </Dialog.Content>
    </Modal>
  );
}
