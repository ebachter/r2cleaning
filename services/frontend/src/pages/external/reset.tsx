import {trpcFunc} from '../../trpc';
import GenericPageExt from '../../GenericPageExt';
import {t} from 'i18next';

const ExtResetPage = () => {
  return (
    <GenericPageExt
      pageTitle={'Signup'}
      bodyMargin={true}
      content={[
        {
          type: 'formData',
          data: {
            header: t('external:form.reset.header'),
            subHeader: t('external:form.reset.subHeader'),
            forgotPassword: false,
            content: [
              {
                type: 'input',
                format: 'email',
                elemKey: 'email',
                // disabled: {status: [204]},
                label: t('external:form.reset.email'),
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
                elemKey: 'resetButton',
                label: 'Reset',
                onSubmit: async ({
                  allValues,
                  reCapString,
                  placeContentElem,
                  setContentElemDisabled,
                  delElemByKey,
                }) => {
                  // const {status} = await asyncUserPasswordReset({email});
                  delElemByKey('error');
                  const {email} = allValues;
                  const {status} = await trpcFunc.asyncUserPasswordReset.mutate(
                    {email},
                  );
                  if (status !== 204) {
                    placeContentElem(2, {
                      type: 'error',
                      elemKey: 'error',
                      label: 'Something went wrong',
                    });
                  } else {
                    setContentElemDisabled('email', true);
                    setContentElemDisabled('resetButton', true);
                    placeContentElem(2, {
                      type: 'success',
                      label:
                        'Your registration was successful. Check your inbox for a confirmation letter',
                    });
                  }
                },
                // params: ['email'],
                //},
                //disabled: {status: [204]},
              },
            ],
            codes: {
              204: {
                type: 'success',
                text: 'A reset email sent for confirmation',
              },
              401: {type: 'error', text: 'Incorrect credentials'},
              400: {type: 'error', text: 'Incorrect credentials'},
              409: {type: 'error', text: 'The email is already in use'},
              500: {type: 'error', text: 'Something went wrong'},
            },
            onLoadActions: [],
          },
        },
      ]}
    />
  );
};

export default ExtResetPage;
