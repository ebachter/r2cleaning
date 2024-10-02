import {View} from 'react-native';
import {Avatar, Button, Card, Text} from 'react-native-paper';
import {useImmer} from 'use-immer';
import {trpcComp} from '../trpc';
import {mergeLocal, mergeSession} from '../redux/functionsDispatch';
import {navigate} from '../RootNavigation';
import {Input} from '@ui-kitten/components';

const initData = {
  email: '',
  password: '',
  showVerifyMessage: 'none',
  showView: 'userdata',
} as const;

export default function ScreenLogin() {
  const [state, setState] = useImmer<{
    email: string;
    password: string;
    showVerifyMessage: 'none' | 'error' | 'success';
    showView: 'userdata' | 'message' | 'verify';
  }>(initData);

  const extUserLoginVerify = trpcComp.extUserLoginVerify.useMutation();

  return (
    <View style={{margin: 10}}>
      <View
        style={[
          {
            alignSelf: 'center',
            width: 'auto',
            marginTop: 50,
          },
        ]}
      >
        <Avatar.Image size={80} source={{uri: '/assets/cleaning_icon.png'}} />
      </View>

      {/* {user.showVerifyMessage === 'error' && (
        <Chip style={{marginTop: 15}} mode="flat">
          <Text style={{color: 'red'}}>Wrong verification code</Text>
        </Chip>
      )} */}

      {state.showView === 'message' && (
        <Card style={{marginTop: 30}}>
          <Card.Content>
            <Text variant="titleLarge">Error</Text>
            <Text variant="bodyMedium">Wrong credentials</Text>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="text"
              onPress={() =>
                setState((d) => {
                  d.showView = 'userdata';
                })
              }
            >
              Repeat
            </Button>
          </Card.Actions>
        </Card>
      )}

      {state.showView === 'userdata' && (
        <>
          <Text style={{marginTop: 30}} variant="titleLarge">
            Login
          </Text>

          <Input
            style={{marginTop: 35}}
            value={state.email}
            label="Email"
            placeholder="Введите электронный адрес"
            // caption={renderCaption}
            // accessoryLeft={renderIcon}
            status={'basic'}
            onChangeText={(nextValue) => {
              setState((d) => {
                d.email = nextValue;
              });
            }}
          />

          <Input
            style={{marginTop: 35}}
            value={state.password}
            label="Пароль"
            placeholder="Введите пароль"
            // caption={renderCaption}
            // accessoryLeft={renderIcon}
            status={'basic'}
            onChangeText={(nextValue) => {
              setState((d) => {
                d.password = nextValue;
              });
            }}
            secureTextEntry={true}
          />

          <Button
            mode="contained"
            style={{marginTop: 35}}
            onPress={async () => {
              const {email, password} = state;
              const {error, sessionToken} =
                await extUserLoginVerify.mutateAsync({
                  email,
                  password,
                });
              if (error === 'credentialsNotValid') {
                setState((d) => {
                  d.showView = 'message';
                });
                return;
              } else {
                mergeSession({
                  sessionToken,
                });
                mergeLocal({
                  modals: {
                    login: {open: false},
                    signup: false,
                  },
                });
                navigate('HomeInt', {});
              }
            }}
          >
            Login
          </Button>
        </>
      )}
    </View>
  );
}
