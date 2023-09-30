import {trpcFunc} from '../../trpc';
import GenericPageExt from '../../GenericPageExt';
import {t} from '../../i18n/i18n';

const ExtSignupPage = () => {
  return (
    <GenericPageExt
      pageTitle={'Signup'}
      bodyMargin={true}
      content={[
        {
          type: 'formData',
          data: {
            header: t('external:form.signup.header'),
            subHeader: t('external:form.signup.subHeader'),
            forgotPassword: false,
            content: [
              {
                type: 'input',
                elemKey: 'name',
                label: t('external:form.signup.name'),
                value: '',
                onChange: ({
                  value,
                  setValue,
                  setContentElemDisabled,
                  delElemByKey,
                }) => {
                  setValue(value);
                  setContentElemDisabled('recaptchaButton', false);
                  delElemByKey('error');
                },
              },
              {
                type: 'input',
                format: 'email',
                elemKey: 'email',
                label: t('external:form.signup.email'),
                value: '',
                onChange: ({
                  value,
                  setValue,
                  setContentElemDisabled,
                  delElemByKey,
                }) => {
                  setValue(value);
                  setContentElemDisabled('recaptchaButton', false);
                  delElemByKey('error');
                },
              },
              {
                type: 'input',
                format: 'password',
                elemKey: 'password',
                label: t('external:form.signup.password'),
                value: '',
                onChange: ({
                  value,
                  setValue,
                  setContentElemDisabled,
                  delElemByKey,
                }) => {
                  setValue(value);
                  setContentElemDisabled('recaptchaButton', false);
                  delElemByKey('error');
                },
              },
              {
                type: 'input',
                elemKey: 'promocode',
                label: t('external:form.signup.promocode'),
                value: '',
                onChange: ({
                  value,
                  setValue,
                  setContentElemDisabled,
                  delElemByKey,
                }) => {
                  setValue(value);
                  setContentElemDisabled('recaptchaButton', false);
                  delElemByKey('error');
                },
              },

              {
                type: 'recaptchaButton',
                elemKey: 'recaptchaButton',
                label: t('external:form.signup.button'),
                withRecaptcha: true,
                onSubmit: async ({
                  allValues,
                  reCapString,
                  placeContentElem,
                  setContentElemDisabled,
                  delElemByKey,
                }) => {
                  const {name, email, password, promocode} = allValues;

                  if (!reCapString) {
                    throw new Error('reCapString must be set');
                  }

                  const {status} = await trpcFunc.extUserSignup.mutate({
                    name,
                    email,
                    password,
                    promocode,
                    reCapString,
                  });

                  delElemByKey('error');

                  if (status !== 204) {
                    placeContentElem(4, {
                      type: 'error',
                      elemKey: 'error',
                      label: 'Something went wrong',
                    });
                  } else {
                    placeContentElem(4, {
                      type: 'success',
                      label:
                        'Your registration was successful. Check your inbox for a confirmation letter',
                    });
                    setContentElemDisabled('name', true);
                    setContentElemDisabled('email', true);
                    setContentElemDisabled('password', true);
                    setContentElemDisabled('promocode', true);
                    setContentElemDisabled('recaptchaButton', true);
                  }
                },
              },
            ],
            codes: {
              204: {
                type: 'success',
                text: 'A confirmation email sent. Check your inbox',
              },
              400: {type: 'error', text: 'Incorrect entries'},
              409: {type: 'error', text: 'The email is alredy in use'},
            },
            onLoadActions: [],
          },
        },
      ]}
    />
  );
};

export default ExtSignupPage;
