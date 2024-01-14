import {Modal, StyleSheet, Platform} from 'react-native';
import {Appbar, Button, Dialog, Text} from 'react-native-paper';
import {useAppSelector} from '../redux/store';
import {setModals, setOrder} from '../redux/functionsDispatch';
import {PhoneNumberInput} from '../screens/OrderReview/PhoneNumberInput';
import {trpcFunc} from '../trpc';

export default function ModalLogin() {
  const visibleLogin = useAppSelector((state) => state.cleaning.modals.login);
  const phoneNumber = useAppSelector(
    (state) => state.cleaning.order.review.phone,
  );
  const smsSent = useAppSelector((state) => state.cleaning.order.smsSent);

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
            setModals({login: false});
            setOrder({smsSent: false});
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

              console.log('--createOrder 1--');
              await trpcFunc.createOrder.mutate({
                objectType: 'flat',
              });
              console.log('--createOrder 2--');

              setOrder({smsSent: true});
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
