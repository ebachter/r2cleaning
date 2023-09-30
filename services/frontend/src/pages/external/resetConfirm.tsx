import {trpcFunc} from '../../trpc';
import useTypedParams from '../../hooks/useTypedParams';
import GenericPageExt from '../../GenericPageExt';
import {t} from '../../i18n/i18n';

const ResetConfirmedPage = () => {
  const {resetId} = useTypedParams(['resetId']);

  return (
    <GenericPageExt
      pageTitle={'Signup'}
      bodyMargin={true}
      content={[
        {
          type: 'formData',
          data: {
            header: t('external:form.resetConfirm.header'), // 'RESET PASSWORD',
            subHeader: t('external:form.resetConfirm.subHeader'),
            forgotPassword: false,
            content: [
              {
                type: 'input',
                format: 'password',
                elemKey: 'password1',
                label: t('external:form.resetConfirm.password1'),
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
                // disabled: {status: [404, 204, null]},
              },
              {
                type: 'input',
                format: 'password',
                elemKey: 'password2',
                label: t('external:form.resetConfirm.password2'),
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
                // disabled: {status: [404, 204, null]},
              },
              {
                type: 'recaptchaButton',
                elemKey: 'resetButton',
                label: t('external:form.resetConfirm.button'),
                // disabled: {status: [404, 204, null]},
                onSubmit: async ({
                  allValues,
                  reCapString,
                  placeContentElem,
                  setContentElemDisabled,
                  delElemByKey,
                }) => {
                  const {password1, password2} = allValues;

                  const {status} =
                    await trpcFunc.asyncExtUserPasswordResetConfirm.mutate({
                      resetId,
                      password1,
                      password2,
                    });

                  if (status !== 204) {
                    delElemByKey('error');
                    placeContentElem(2, {
                      type: 'error',
                      elemKey: 'error',
                      label: 'Something went wrong',
                    });
                  } else {
                    delElemByKey('error');
                    setContentElemDisabled('password1', true);
                    setContentElemDisabled('password2', true);
                    setContentElemDisabled('resetButton', true);
                    placeContentElem(2, {
                      type: 'success',
                      label: t('external:form.resetConfirm.success'),
                    });
                  }
                },
              },
            ],
            /* codes: {
              204: {type: 'success', text: 'form.resetConfirm.success'},
              400: {type: 'error', text: 'form.resetConfirm.error400'},
              404: {type: 'error', text: 'form.resetConfirm.error404'},
            }, */
            onLoadActions: [
              {
                actionFn: async ({
                  setContentElemDisabled,
                  placeContentElem,
                  delElemByKey,
                }) => {
                  const {status} =
                    await trpcFunc.precheckPasswordResetTokenExt.query({
                      resetId,
                    });
                  if (status !== 202) {
                    delElemByKey('error');
                    setContentElemDisabled('password1', true);
                    setContentElemDisabled('password2', true);
                    setContentElemDisabled('resetButton', true);
                    placeContentElem(2, {
                      type: 'error',
                      elemKey: 'error',
                      label: 'Something went wrong',
                    });
                  }
                  // precheckPasswordResetTokenExt({resetid});
                },
              },
            ],
          },
        },
      ]}
    />
  );
};

export default ResetConfirmedPage;
