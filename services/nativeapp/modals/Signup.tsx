import {Modal, View} from 'react-native';
import {
  Appbar,
  Avatar,
  Button,
  Dialog,
  Text,
  TextInput,
} from 'react-native-paper';
import {useAppSelector} from '../redux/store';
import {mergeLocal, mergeSession} from '../redux/functionsDispatch';
import {useImmer} from 'use-immer';

export default function ModalFullscreen() {
  const visibleSignup = useAppSelector((state) => state.local.modals.signup);

  const [user, setUser] = useImmer({
    firstName: '',
    lastName: '',
    email: '',
    password1: '',
    password2: '',
  });

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
          onPress={() => mergeLocal({modals: {signup: false}})}
        />
        <Appbar.Content title="Регистрация" />
        <Button onPress={() => console.log('Save')}>Save</Button>
      </Appbar.Header>
      <Dialog.Content>
        <View
          style={[
            {
              alignSelf: 'center',
              width: 'auto',
              marginTop: 50,
              // minWidth: 50,
              // backgroundColor: 'powderblue',
            },
          ]}
        >
          <Avatar.Image size={80} source={{uri: '/assets/cleaning_icon.png'}} />
        </View>

        <Text style={{marginTop: 30}} variant="titleLarge">
          Личные данные
        </Text>
        <TextInput
          label="First name"
          style={{marginTop: 25}}
          value={user.firstName}
          onChangeText={(text) =>
            setUser((d) => {
              d.firstName = text;
            })
          }
          mode="outlined"
        />
        <TextInput
          label="Last name"
          style={{marginTop: 25}}
          value={user.firstName}
          onChangeText={(text) =>
            setUser((d) => {
              d.firstName = text;
            })
          }
          mode="outlined"
        />
        <Text style={{marginTop: 30}} variant="titleLarge">
          Регистрационные данные
        </Text>

        <TextInput
          label="Email"
          style={{marginTop: 25}}
          value={user.email}
          onChangeText={(text) =>
            setUser((d) => {
              d.email = text;
            })
          }
          mode="outlined"
        />

        <TextInput
          label="Пароль"
          style={{marginTop: 25}}
          value={user.password1}
          onChangeText={(text) =>
            setUser((d) => {
              d.password1 = text;
            })
          }
          mode="outlined"
          secureTextEntry={true}
        />

        <TextInput
          label="Повторить пароль"
          style={{marginTop: 25}}
          value={user.password2}
          onChangeText={(text) =>
            setUser((d) => {
              d.password2 = text;
            })
          }
          mode="outlined"
          secureTextEntry={true}
        />

        <Button
          icon="camera"
          mode="contained"
          style={{marginTop: 25}}
          onPress={() => console.log('Pressed')}
        >
          Press me
        </Button>
      </Dialog.Content>
    </Modal>
  );
}
