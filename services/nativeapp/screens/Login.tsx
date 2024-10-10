import {View} from 'react-native';
import {Avatar, Button, Card, Icon, Text, TextInput} from 'react-native-paper';
import {useImmer} from 'use-immer';
import {trpc} from '../trpc';
import {mergeLocal, mergeSession} from '../redux/functionsDispatch';
import {navigate} from '../RootNavigation';
import {useTranslation} from 'react-i18next';

const initData = {
  email: '',
  password: '',
  message: {show: false},
  secureTextEntry: false,
} as const;

export default function ScreenLogin() {
  const [state, setState] = useImmer<{
    email: string;
    password: string;
    message: {show: boolean};
    secureTextEntry: boolean;
  }>(initData);

  const login = trpc.auth.login.useMutation();
  const {t} = useTranslation();

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
      <>
        <TextInput
          style={{marginTop: 35}}
          value={state.email}
          label={t('login:email')}
          mode="outlined"
          onChangeText={(nextValue) => {
            setState((d) => {
              d.message.show = false;
              d.email = nextValue;
            });
          }}
        />
        <View>
          <TextInput
            style={{marginTop: 35}}
            value={state.password}
            label={t('login:password')}
            // accessoryLeft={renderIcon}
            mode="outlined"
            onChangeText={(nextValue) => {
              setState((d) => {
                d.message.show = false;
                d.password = nextValue;
              });
            }}
            right={
              <TextInput.Icon
                icon="eye"
                onPress={() =>
                  setState((d) => {
                    d.secureTextEntry = !state.secureTextEntry;
                  })
                }
              />
            }
            secureTextEntry={state.secureTextEntry}
          />
        </View>

        {state.message.show && (
          <Card style={{marginTop: 30}}>
            <Card.Content>
              <Text
                variant="bodyMedium"
                style={{color: 'red', fontWeight: 'bold', textAlign: 'center'}}
              >
                {t('login:wrongCredentials')}
              </Text>
            </Card.Content>
          </Card>
        )}

        <Button
          mode="contained"
          style={{marginTop: 35}}
          onPress={async () => {
            const {email, password} = state;
            const {error, sessionToken} = await login.mutateAsync({
              email,
              password,
            });
            if (error === 'credentialsNotValid') {
              setState((d) => {
                d.message.show = true;
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
              navigate({HomeInt: {}});
            }
          }}
        >
          {t('login:buttonLogin')}
        </Button>
      </>
    </View>
  );
}
