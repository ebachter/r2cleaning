import {useTranslation} from 'react-i18next';
import GenericPageExt from '../../../GenericPageExt';
import OrderAppartmentStepper from './Stepper';

const OrderPage = () => {
  const {t} = useTranslation('external');

  return (
    <>
      <GenericPageExt
        pageTitle="Оформление заказа"
        content={[
          {
            type: 'header_image',
            path: '/images/extAbout/features.header.jpg',
            responsive: true,
            text: 'Оформление заказа',
          },

          {
            type: 'customComponent',
            value: () => <OrderAppartmentStepper />,
          },
        ]}
      />
    </>
  );
};

export default OrderPage;
