import {Button, Card, Chip, Text, TextInput} from 'react-native-paper';
import {signupInitData, SignupSetState, SignupState} from './localShared';
import {trpcComp} from '../../trpc';
import {navigate} from '../../RootNavigation';
import {useState} from 'react';

export const ConfirmCode = ({
  state,
  setState,
}: {
  state: SignupState;
  setState: SignupSetState;
}) => {
  const extUserSignupEmailVerify =
    trpcComp.auth.extUserSignupEmailVerify.useMutation();

  const [verificationCode, setVerificationCode] = useState<string>('');
  const [message, setMessage] = useState<{
    type: 'error' | 'success' | null;
    text: string;
  }>({type: null, text: ''});

  return (
    <Card style={{marginTop: 30}}>
      <Card.Content>
        <Text style={{marginTop: 30}} variant="titleLarge">
          Введите код полученный на электронный адрес
        </Text>
        <TextInput
          label="Код"
          style={{marginTop: 25}}
          value={verificationCode}
          onChangeText={(text) => {
            setVerificationCode(text.replace(/[^0-9]/g, ''));
            setMessage({
              type: null,
              text: '',
            });
          }}
          mode="outlined"
          maxLength={6}
          disabled={message.type === 'success'}
        />
        {message.type && (
          <Card style={{marginTop: 25}}>
            <Card.Content>
              <Text
                style={{color: message.type === 'success' ? 'green' : 'red'}}
              >
                {message.text}
              </Text>
            </Card.Content>
          </Card>
        )}
        {/* {showVerifyMessage === 'error' && (
          <Chip style={{marginTop: 15}} mode="flat">
            <Text style={{color: 'red'}}>Wrong verification code</Text>
          </Chip>
        )}
        {showVerifyMessage === 'success' && (
          <Chip style={{marginTop: 15}} mode="flat">
            <Text style={{color: 'green'}}>User created</Text>
          </Chip>
        )} */}
        {message.type !== 'success' && (
          <Button
            style={{marginTop: 25}}
            mode="contained"
            onPress={async () => {
              if (verificationCode.length < 6) {
                setMessage({
                  type: 'error',
                  text: 'Verification is too short.',
                });
                return;
              }

              const {status} = await extUserSignupEmailVerify.mutateAsync({
                email: state.email,
                verificationCode: verificationCode,
              });
              if (status === 'notfound') {
                // setShowVerifyMessage('error');
                setMessage({
                  type: 'error',
                  text: 'Wrong verification code.',
                });
              }
              if (status === 'created') {
                // setShowVerifyMessage('success');
                setMessage({
                  type: 'success',
                  text: 'User created',
                });
              }
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
            setState(() => signupInitData);
            navigate({HomeExt: {}});
          }}
        >
          Close
        </Button>
      </Card.Actions>
    </Card>
  );
};
