import {View} from 'react-native';
import {Button, Card, ProgressBar, Text, TextInput} from 'react-native-paper';
import {zxcvbn, zxcvbnOptions} from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import {trpc} from '../../trpc';
import {SignupSetState, SignupState} from './localShared';
import {useState} from 'react';
import {useImmer} from 'use-immer';
import {useTranslation} from 'react-i18next';

const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
};

zxcvbnOptions.setOptions(options);

export const MainCard = ({
  state,
  setState,
}: {
  state: SignupState;
  setState: SignupSetState;
}) => {
  const {t} = useTranslation();

  const signupUser = trpc.auth.signup.add.useMutation();

  const [localState, setLocalState] = useImmer<{
    passwordCheck: {score: number; feedback: string[]};
    secureTextEntry: boolean;
  }>({passwordCheck: {score: 0, feedback: []}, secureTextEntry: true});

  const [message, setMessage] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

  return (
    <View>
      <TextInput
        label={t('signup:firstName')}
        style={{marginTop: 25}}
        value={state.firstName}
        onChangeText={(text) => {
          setMessage(null);
          setState((d) => {
            d.firstName = text;
          });
        }}
        mode="outlined"
      />
      <TextInput
        label={t('signup:lastName')}
        style={{marginTop: 25}}
        value={state.lastName}
        onChangeText={(text) => {
          setMessage(null);
          setState((d) => {
            d.lastName = text;
          });
        }}
        mode="outlined"
      />
      <TextInput
        label={t('signup:email')}
        style={{marginTop: 25}}
        value={state.email}
        onChangeText={(text) => {
          setMessage(null);
          setState((d) => {
            d.email = text;
          });
        }}
        mode="outlined"
      />

      <TextInput
        label={t('signup:password')}
        style={{marginTop: 25}}
        value={state.password}
        onChangeText={(text) => {
          setMessage(null);
          const pwdCheck = zxcvbn(text);
          setState((d) => {
            d.password = text;
          });
          setLocalState((d) => {
            d.passwordCheck.score = pwdCheck.score;
            d.passwordCheck.feedback = pwdCheck.feedback.suggestions;
          });
        }}
        mode="outlined"
        secureTextEntry={localState.secureTextEntry}
        right={
          <TextInput.Icon
            icon="eye"
            onPress={() =>
              setLocalState((d) => {
                d.secureTextEntry = !localState.secureTextEntry;
              })
            }
          />
        }
      />

      <View>
        <ProgressBar
          style={{marginTop: 10}}
          progress={localState.passwordCheck.score / 5}
          theme={{
            colors: {
              primary:
                localState.passwordCheck.score < 2
                  ? 'red'
                  : localState.passwordCheck.score < 3
                  ? 'yellow'
                  : 'green',
            },
          }}
        />
      </View>

      {message && (
        <Card style={{marginTop: 25}}>
          <Card.Content>
            <Text style={{color: message.type === 'success' ? 'green' : 'red'}}>
              {message.text}
            </Text>
          </Card.Content>
        </Card>
      )}

      <Button
        mode="contained"
        style={{marginTop: 25}}
        onPress={async () => {
          if (state.firstName.length < 1 || state.lastName.length < 1) {
            setMessage({
              type: 'error',
              text: 'First and last name can not be empty.',
            });
            return;
          }
          if (localState.passwordCheck.score < 2) {
            setMessage({
              type: 'error',
              text: localState.passwordCheck.feedback.join(' '),
            });
            return;
          }
          const {firstName, lastName, email, password} = state;
          const {status} = await signupUser.mutateAsync({
            firstName,
            lastName,
            email,
            password,
          });

          if (status === 'exists') {
            setMessage({
              type: 'error',
              text: 'The email is already in use.',
            });
          }

          if (status === 'success') {
            setState((d) => {
              d.showView = 'success';
            });
          }
        }}
      >
        {t('signup:buttonContinue')}
      </Button>
    </View>
  );
};
