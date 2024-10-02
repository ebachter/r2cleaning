import {View} from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Chip,
  Surface,
  Text,
  TextInput,
} from 'react-native-paper';
import {useImmer} from 'use-immer';
import {trpcComp} from '../trpc';
import {showSnackbar} from '../redux/functionsDispatch';
import {useState} from 'react';
import {navigate} from '../RootNavigation';

const initData = {
  firstName: '',
  lastName: '',
  email: '',
  password1: '',
  password2: '',
  verificationCode: '',
  showVerifyMessage: 'none',
} as const;

export default function ScreenSignup() {
  const [user, setUser] = useImmer<{
    firstName: string;
    lastName: string;
    email: string;
    password1: string;
    password2: string;
    verificationCode: string;
    showVerifyMessage: 'none' | 'error' | 'success';
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
              value={user.verificationCode}
              onChangeText={(text) => {
                setUser((d) => {
                  d.verificationCode = text.replace(/[^0-9]/g, '');
                });
              }}
              mode="outlined"
              maxLength={6}
              disabled={user.showVerifyMessage === 'success'}
            />
            {user.showVerifyMessage === 'error' && (
              <Chip style={{marginTop: 15}} mode="flat">
                <Text style={{color: 'red'}}>Wrong verification code</Text>
              </Chip>
            )}
            {user.showVerifyMessage === 'success' && (
              <Chip style={{marginTop: 15}} mode="flat">
                <Text style={{color: 'green'}}>User created</Text>
              </Chip>
            )}
            {user.showVerifyMessage !== 'success' && (
              <Button
                style={{marginTop: 25}}
                mode="contained"
                onPress={async () => {
                  const {status} = await extUserSignupEmailVerify.mutateAsync({
                    email: user.email,
                    verificationCode: user.verificationCode,
                  });
                  if (status === 'notfound')
                    setUser((d) => {
                      d.showVerifyMessage = 'error';
                    });
                  if (status === 'created')
                    setUser((d) => {
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
                setUser(initData);
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
        <>
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
            value={user.lastName}
            onChangeText={(text) =>
              setUser((d) => {
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
            mode="contained"
            style={{marginTop: 35}}
            onPress={async () => {
              console.log('Pressed', user);
              if (user.password1 !== user.password2) {
                console.log('showSnackbar');
                showSnackbar({text: "Passwords don't match"});
                return;
              }
              const {firstName, lastName, email, password1: password} = user;
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
        </>
      )}
    </View>
  );
}
