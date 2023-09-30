import {trpcFunc} from '../../trpc';
import {sessionSet} from '../../redux/sliceSession';
import {fnUserLogin} from '../../utils/fnsAuth';
import GenericPageExt from '../../GenericPageExt';
import {t} from '../../i18n/i18n';

const LoginPage = () => {
  return (
    <GenericPageExt
      pageTitle={'Signup'}
      bodyMargin={true}
      content={[
        {
          type: 'formData',
          data: {
            header: t('external:form.login.header'),
            // subHeader: null,
            forgotPassword: true,

            content: [
              {
                type: 'input',
                elemKey: 'user',
                format: 'text',
                label: t('external:form.login.email'),
                disabled: {status: []},
                value: '',
                onChange: ({value, setValue}) => {
                  setValue(value);
                },
              },
              {
                type: 'input',
                elemKey: 'password',
                format: 'password',
                label: t('external:form.login.password', {test: 'test'}),
                disabled: {status: []},
                value: '',
                onChange: ({value, setValue}) => {
                  setValue(value);
                },
              },
              {
                type: 'recaptchaButton',
                label: t('external:form.login.button'),
                onSubmit: async ({allValues}) => {
                  const {user, password} = allValues;
                  const data = await trpcFunc.extUserSessionCreate.mutate({
                    email: user,
                    password,
                  });
                  let sessionData = {
                    sessionToken: data?.sessionToken || null,
                    refreshToken: data?.refreshToken || null,
                  };
                  sessionSet(sessionData);

                  if (data) {
                    fnUserLogin();
                  }
                },
              },
            ],
            codes: {
              200: {type: 'success', text: 'Succesfully logged in'},
              401: {type: 'error', text: 'Incorrect credentials'},
            },
            onLoadActions: [],
          },
        },
      ]}
    />
  );
};

export default LoginPage;
