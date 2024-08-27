import {Modal, StyleSheet, Platform} from 'react-native';
import {Appbar, Button, Dialog, Text} from 'react-native-paper';
import {useAppSelector} from '../../redux/store';
import {PhoneNumberInput} from './PhoneNumberInput';
import {trpcFunc} from '../../trpc';
import {mergeLocal, mergeSession} from '../../redux/functionsDispatch';

export default function ModalLogin() {
  const visibleLogin = useAppSelector((state) => state.local.modals.login);
  const phoneNumber = useAppSelector((state) => state.session.phone);
  const smsSent = useAppSelector((state) => state.session.smsSent);

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
            mergeLocal({modals: {login: false}});
            mergeSession({smsSent: false});
          }}
        />
        <Appbar.Content title="Логин" />
        <Button onPress={() => console.log('Save')}>Save</Button>
      </Appbar.Header>
      <Dialog.Content style={styles.container}>
        {/* <Text variant="bodyMedium" style={{marginTop: 20, marginBottom: 20}}>
          Войти в Клининг.тек
        </Text> */}
        <PhoneNumberInput />
        {!smsSent && (
          <Button
            mode="contained"
            onPress={async () => {
              const data = await trpcFunc.extUserSignupSMS.mutate({
                phone: phoneNumber,
              });
              mergeSession({smsSent: true});
            }}
            style={{borderRadius: 5, marginTop: 20}}
            compact={true}
            labelStyle={{marginTop: 2, marginBottom: 2}}
          >
            Войти
          </Button>
        )}
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
  },
});
