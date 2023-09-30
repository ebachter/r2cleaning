import {useTranslation} from 'react-i18next';
import GenericPageExt from '../../GenericPageExt';

const OrderPage = () => {
  const {t} = useTranslation('external');

  return (
    <>
      <GenericPageExt
        pageTitle="Заказ"
        content={[
          {
            type: 'header_image',
            path: '/images/extAbout/features.header.jpg',
            responsive: true,
            text: 'Заказ',
          },
        ]}
      />
    </>
  );
};

export default OrderPage;
