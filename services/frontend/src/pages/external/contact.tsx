import {useTranslation} from 'react-i18next';
import GenericPageExt from '../../GenericPageExt';

const Contact = () => {
  const {t} = useTranslation('external');

  return (
    <GenericPageExt
      pageTitle={t('contact.itemHeader')}
      bodyMargin={true}
      content={[
        {
          type: 'header_simple',
          text: t('contact.itemHeader'),
        },
        {
          type: 'textbox_simple',
          texts: [{title: t('contact.generalQuestions')}],
        },
        {
          type: 'textbox_simple',
          texts: [
            {secondary: 'Tel.: +49 89 4523 1133'},
            {secondary: `Email: contact@remrob.com`},
          ],
        },
        {
          type: 'textbox_simple',
          texts: [{title: t('contact.technicalSupport')}],
        },
        {
          type: 'textbox_simple',
          texts: [
            {secondary: 'Tel.: +49 89 4523 1133'},
            {secondary: `Email: support@remrob.com`},
          ],
        },
      ]}
    />
  );
};

export default Contact;
