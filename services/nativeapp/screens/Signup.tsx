import {View} from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Chip,
  MD3Colors,
  ProgressBar,
  Surface,
  Text,
  TextInput,
} from 'react-native-paper';
import {useImmer} from 'use-immer';
import {trpcComp} from '../trpc';
import {showSnackbar} from '../redux/functionsDispatch';
import {useState} from 'react';
import {navigate} from '../RootNavigation';
import {zxcvbnAsync, debounce, zxcvbn, zxcvbnOptions} from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import {FeedbackType} from '@zxcvbn-ts/core/dist/types';

const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
};

zxcvbnOptions.setOptions(options);

const initData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  verificationCode: '',
  showVerifyMessage: 'none' as 'none',
  passwordCheck: {score: 0, feedback: []},
};

export default function ScreenSignup() {
  const [state, setState] = useImmer<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    verificationCode: string;
    showVerifyMessage: 'none' | 'error' | 'success';
    passwordCheck: {score: number; feedback: string[]};
  }>(initData);

  const [showView, setShowView] = useState<'userdata' | 'message' | 'verify'>(
    'userdata',
  );
  const signupUser = trpcComp.extUserSignupEmail.useMutation();

  const extUserSignupEmailVerify =
    trpcComp.extUserSignupEmailVerify.useMutation();

  return (
    <View style={{margin: 10}}>
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

      {showView === 'verify' && (
        <Card style={{marginTop: 30}}>
          <Card.Content>
            <Text style={{marginTop: 30}} variant="titleLarge">
              Введите код полученный на электронный адрес
            </Text>
            <TextInput
              label="Код"
              style={{marginTop: 25}}
              value={state.verificationCode}
              onChangeText={(text) => {
                setState((d) => {
                  d.verificationCode = text.replace(/[^0-9]/g, '');
                });
              }}
              mode="outlined"
              maxLength={6}
              disabled={state.showVerifyMessage === 'success'}
            />
            {state.showVerifyMessage === 'error' && (
              <Chip style={{marginTop: 15}} mode="flat">
                <Text style={{color: 'red'}}>Wrong verification code</Text>
              </Chip>
            )}
            {state.showVerifyMessage === 'success' && (
              <Chip style={{marginTop: 15}} mode="flat">
                <Text style={{color: 'green'}}>User created</Text>
              </Chip>
            )}
            {state.showVerifyMessage !== 'success' && (
              <Button
                style={{marginTop: 25}}
                mode="contained"
                onPress={async () => {
                  const {status} = await extUserSignupEmailVerify.mutateAsync({
                    email: state.email,
                    verificationCode: state.verificationCode,
                  });
                  if (status === 'notfound')
                    setState((d) => {
                      d.showVerifyMessage = 'error';
                    });
                  if (status === 'created')
                    setState((d) => {
                      d.showVerifyMessage = 'success';
                    });
                }}
              >
                Send
              </Button>
            )}
          </Card.Content>
          <Card.Actions>
            <Button
              mode="text"
              onPress={() => {
                setState(initData);
                navigate('HomeExt', {});
              }}
            >
              Cancel
            </Button>
          </Card.Actions>
        </Card>
      )}

      {showView === 'message' && (
        <Card style={{marginTop: 30}}>
          <Card.Content>
            <Text variant="titleLarge">Error</Text>
            <Text variant="bodyMedium">The email is already in use</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="text" onPress={() => setShowView('userdata')}>
              Repeat
            </Button>
          </Card.Actions>
        </Card>
      )}

      {showView === 'userdata' && (
        <View>
          <Text style={{marginTop: 30}} variant="titleLarge">
            Личные данные
          </Text>
          <TextInput
            label="First name"
            style={{marginTop: 25}}
            value={state.firstName}
            onChangeText={(text) =>
              setState((d) => {
                d.firstName = text;
              })
            }
            mode="outlined"
          />
          <TextInput
            label="Last name"
            style={{marginTop: 25}}
            value={state.lastName}
            onChangeText={(text) =>
              setState((d) => {
                d.lastName = text;
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
            value={state.email}
            onChangeText={(text) =>
              setState((d) => {
                d.email = text;
              })
            }
            mode="outlined"
          />

          <TextInput
            label="Пароль"
            style={{marginTop: 25}}
            value={state.password}
            onChangeText={(text) => {
              const pwdCheck = zxcvbn(text);
              setState((d) => {
                d.password = text;
                d.passwordCheck.score = pwdCheck.score;
                d.passwordCheck.feedback = pwdCheck.feedback.suggestions;
              });
            }}
            mode="outlined"
            secureTextEntry={true}
          />

          <View>
            <ProgressBar
              style={{marginTop: 10}}
              progress={state.passwordCheck.score / 5}
              theme={{
                colors: {
                  primary:
                    state.passwordCheck.score < 2
                      ? 'red'
                      : state.passwordCheck.score < 3
                      ? 'yellow'
                      : 'green',
                },
              }}
            />
          </View>

          <Button
            mode="contained"
            style={{marginTop: 35}}
            onPress={async () => {
              if (state.passwordCheck.score < 2) {
                showSnackbar({text: state.passwordCheck.feedback.join()});
                return;
              }
              const {firstName, lastName, email, password} = state;
              const {status} = await signupUser.mutateAsync({
                firstName,
                lastName,
                email,
                password,
              });
              if (status === 'verify') setShowView('verify');
              if (status === 'exists') setShowView('message');
            }}
          >
            Continue
          </Button>
        </View>
      )}
    </View>
  );
}
