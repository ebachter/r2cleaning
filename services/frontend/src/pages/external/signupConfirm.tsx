import {trpcFunc} from '../../trpc';
import useTypedParams from '../../hooks/useTypedParams';
import GenericPageExt from '../../GenericPageExt';
import {t} from '../../i18n/i18n';

const SignupConfirmedPage = () => {
  const {signupId} = useTypedParams(['signupId']);

  return (
    <GenericPageExt
      pageTitle={'Signup'}
      bodyMargin={true}
      content={[
        {
          type: 'formData',
          data: {
            header: t('external:form.signupConfirmation.header'),
            subHeader: t('external:form.signupConfirmation.subHeader'),
            forgotPassword: false,
            content: [],
            codes: {
              204: {
                type: 'success',
                text: 'Your account has been succesfully created',
              },
              404: {type: 'error', text: 'The token is not valid'},
            },
            onLoadActions: [
              {
                actionFn: async ({delElemByKey, placeContentElem}) => {
                  const {status} = await trpcFunc.signupConfirmExt.mutate({
                    signupId,
                  });
                  if (status === 204) {
                    delElemByKey('error');
                    placeContentElem(0, {
                      type: 'success',
                      elemKey: 'error',
                      label: 'Your account has been succesfully created',
                    });
                  } else {
                    delElemByKey('error');
                    placeContentElem(0, {
                      type: 'error',
                      elemKey: 'error',
                      label: 'Something went wrong',
                    });
                  }
                  // signupConfirmExt({signupid});
                },
              },
            ],
          },
        },
      ]}
    />
  );
};

export default SignupConfirmedPage;
