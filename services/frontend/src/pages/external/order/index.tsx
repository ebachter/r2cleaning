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

          /* {
            type: 'customComponent',
            value: () => (
              <FormControl sx={{mt: 5, ml: 1}}>
                <FormLabel>Локация объекта</FormLabel>
              </FormControl>
            ),
          }, */

          /* {
            type: 'customComponent',
            value: () => <OrderAppartmentSex />,
          }, */

          /* {
            type: 'customComponent',
            value: () => (
              <FormControl sx={{mt: 5, ml: 1}}>
                <FormLabel>Тип объекта</FormLabel>
                <OrderObjectType
                  objectType={objectType}
                  setObjectType={setObjectType}
                />
              </FormControl>
            ),
          }, */

          /* {
            type: 'customComponent',
            value:
              objectType === 'appartment'
                ? OrderAppartment
                : objectType === 'entrance'
                ? OrderEntrance
                : OrderHouse,
          }, */

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
