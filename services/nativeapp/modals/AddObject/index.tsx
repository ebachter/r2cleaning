import {Modal, StyleSheet, Platform, View} from 'react-native';
import {Appbar, Button, Dialog, Text} from 'react-native-paper';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {trpcFunc} from '../../trpc';
import {sessionActions} from '../../redux/sliceSession';
import {mergeLocal, mergeSession} from '../../redux/functionsDispatch';
import ScreenObjectAdd from './intro';

export default function ModalAddObject() {
  const visibleLogin = useAppSelector((state) => state.local.modals.addObject);
  const phoneNumber = useAppSelector((state) => state.session.phone);
  const smsSent = useAppSelector((state) => state.session.smsSent);
  const dispatch = useAppDispatch();

  return (
    <Modal
      animationType="fade"
      // onRequestClose={() => setModals({login: false})}
      presentationStyle="overFullScreen"
      visible={visibleLogin}
    >
      <Appbar.Header>
        <Appbar.Action
          icon="close"
          onPress={() => {
            mergeLocal({modals: {addObject: false}});
            mergeSession({smsSent: false});
          }}
        />
        <Appbar.Content title="Add object" />
        <Button onPress={() => console.log('Save')}>Save</Button>
      </Appbar.Header>
      <Dialog.Content style={styles.container}>
        {/* <Text variant="bodyMedium" style={{marginTop: 20, marginBottom: 20}}>
          Войти в Клининг.тек
        </Text> */}
        <ScreenObjectAdd />
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
