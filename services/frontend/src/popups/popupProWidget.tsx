import {trpcFunc} from '../trpc';
import {closePopup, setAppPopup} from '../zustand/popup';

export const popupProWidgetPublicity = (
  widgetId: number,

  refetch: () => void,
  isPublic: boolean,
) =>
  setAppPopup([
    'accessType',
    'activationFee',
    'monthlyFee',
    'currency',
    'secondHeader',
  ])({
    mandatory: true,
    loading: false,
    header: 'Widget publicity setup',
    content: [
      {
        type: 'info',
        bodyText: `Set publicity level`,
      },
      {
        type: 'dialogSelect',
        elemKey: 'accessType',
        value: isPublic ? 'public' : 'private',
        label: 'Type',
        options: [
          {id: 'private', label: 'Private'},
          {id: 'public', label: 'Public'},
        ],
        setOnChange: (val, {setPopupElementValue, setPopupElementVisible}) => {
          setPopupElementValue('accessType', val);
          if (val === 'private') {
            setPopupElementVisible('secondHeader', false);
            setPopupElementVisible('activationFee', false);
            setPopupElementVisible('monthlyFee', false);
            setPopupElementVisible('currency', false);
          } else {
            setPopupElementVisible('secondHeader', true);
            setPopupElementVisible('activationFee', true);
            setPopupElementVisible('monthlyFee', true);
            setPopupElementVisible('currency', true);
          }
        },
      },
      {
        type: 'sectionHeader',
        elemKey: 'secondHeader',
        text: 'Fees',
        visible: isPublic ? true : false,
      },
      {
        type: 'input',
        elemKey: 'activationFee',
        labelText: 'Activation fee',
        visible: isPublic ? true : false,
        value: '',
        setOnChange: (val, {setPopupElementValue}) => {
          setPopupElementValue('activationFee', val.replace(/\D/g, ''));
        },
      },
      {
        type: 'input',
        elemKey: 'monthlyFee',
        labelText: 'Monthly fee',
        visible: isPublic ? true : false,
        value: '',
        setOnChange: (val, {setPopupElementValue}) => {
          setPopupElementValue('monthlyFee', val.replace(/\D/g, ''));
        },
      },

      {
        type: 'dialogSelect',
        elemKey: 'currency',
        value: 'eur',
        label: 'Currency',
        visible: isPublic ? true : false,
        options: [
          {id: 'eur', label: 'Euro'},
          {id: 'usd', label: 'USD'},
        ],
        setOnChange: (val, {setPopupElementValue}) => {
          setPopupElementValue('currency', val);
        },
      },
    ],
    buttons: [
      {type: 'cancel'},
      {
        type: 'confirmWithInput',
        elemKey: 'confirmButton',
        variant: 'outlined',
        labelText: 'Save',
        onClick: async (allValues) => {
          console.log('###', allValues);

          await trpcFunc.adminWidgetPublicSet.mutate({
            widgetId: Number(widgetId),
            publicType: allValues.accessType,
            activationFee: Number(allValues.activationFee),
            monthlyFee: Number(allValues.monthlyFee),
            currency: allValues.currency,
          });

          refetch();
          closePopup();
        },
      },
    ],
  });
