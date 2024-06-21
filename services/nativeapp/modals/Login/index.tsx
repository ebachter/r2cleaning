import {Modal, StyleSheet, Platform} from 'react-native';
import {Appbar, Button, Dialog, Text} from 'react-native-paper';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {PhoneNumberInput} from './PhoneNumberInput';
import {trpcFunc} from '../../trpc';
import {sessionActions} from '../../redux/sliceSession';
import {mergeSession} from '../../redux/functionsDispatch';

export default function ModalLogin() {
  const visibleLogin = useAppSelector((state) => state.session.modals.login);
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
            mergeSession({modals: {login: false}});
            dispatch(sessionActions.actionSmsSent(false));
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

              dispatch(sessionActions.actionSmsSent(true));
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
