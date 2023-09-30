import {enqueueSnackbar} from 'notistack';
import {t} from '../i18n/i18n';
import {trpcFunc} from '../trpc';
import {
  closePopup,
  getPopupAllValues,
  setAppPopup,
  setPopup,
} from '../zustand/popup';
import {fnUserLogout} from '../utils/fnsAuth';
import {callUserDataLoad} from '../utils/trpcCalls';
import jstz from 'jstz';

export const showDeleteUserAccount = () =>
  setPopup({
    open: true,
    mandatory: true,
    loading: false,

    header: t('popupUserAccountDeleteHeader'),
    content: [
      {type: 'warning', bodyText: t('popupUserAccountDeleteText')},
      {
        type: 'input',
        labelText: t('popupUserAccountDeletePassword'),
        elemKey: 'password',
        password: true,
      },
    ],
    buttons: [
      {type: 'cancel'},
      {
        type: 'confirmWithInput',
        elemKey: 'confirmButton',
        variant: 'outlined',
        labelText: t('popupUserAccountDeleteConfirm'),
        onClick: async () => {
          alert('del account');
          /* {
          type: 'USER_ACCOUNT_DELETE_CONFIRMED',
          password,
          },
          disabledIfEmpty: true, */
          const allValues = getPopupAllValues();

          const {status} = await trpcFunc.deleteUserAccountConfirmed.mutate({
            password: allValues.password,
          });

          if (status === 204) {
            enqueueSnackbar(`Account has been successfully deleted.`, {
              variant: 'success',
            });
            fnUserLogout();
          } else {
            enqueueSnackbar(`Something went wrong`, {
              variant: 'error',
            });
          }

          closePopup();
        },
      },
    ],
  });

export const popupUserPasswordReset = () =>
  setAppPopup(['oldPassword', 'newPassword1', 'newPassword2'])({
    mandatory: true,
    loading: false,
    header: 'Reset password',
    content: [
      {
        type: 'info',
        bodyText: `To reset password push the RESET button and check your email box for a confirmation mail`,
      },
      {
        type: 'input',
        labelText: 'Old password',
        elemKey: 'oldPassword',
        value: '',
        password: true,
        setOnChange: (val, {setPopupElementValue}) => {
          setPopupElementValue('oldPassword', val);
        },
      },
      {
        type: 'input',
        labelText: 'New password',
        elemKey: 'newPassword1',
        value: '',
        password: true,
        setOnChange: (val, {setPopupElementValue}) => {
          setPopupElementValue('newPassword1', val);
        },
      },
      {
        type: 'input',
        labelText: 'Confirm password',
        elemKey: 'newPassword2',
        value: '',
        password: true,
        setOnChange: (val, {setPopupElementValue}) => {
          setPopupElementValue('newPassword2', val);
        },
      },
    ],
    buttons: [
      {type: 'cancel'},
      {
        type: 'confirmWithInput',
        elemKey: 'confirmButton',
        variant: 'outlined',
        labelText: 'Reset',
        onClick: async (allValues, {}) => {
          const res = await trpcFunc.resetUserPasswordInt.mutate({
            oldPassword: allValues.oldPassword,
            newPassword: allValues.newPassword1,
            verifyPassword: allValues.newPassword2,
          });
          console.log('>>>', res);
          closePopup();
        },
      },
    ],
  });

export const popupUserImageUpload = () =>
  setAppPopup(['image'])({
    mandatory: true,
    loading: false,
    header: 'Image upload',
    content: [
      {
        type: 'info',
        bodyText: `Select an image for upload`,
      },
      {
        type: 'file',
        name: 'Selected icon',
        elemKey: 'image',
        value: '',
        setOnChange: (val, {setPopupElementValue}) => {
          setPopupElementValue('image', val);
        },
      },
    ],
    buttons: [
      {type: 'cancel'},
      {
        type: 'confirmWithInput',
        elemKey: 'confirmButton',
        variant: 'outlined',
        labelText: 'Upload',
        onClick: async (allValues) => {
          await trpcFunc.trpcAppUserImageUpdate.mutate({
            userImage: allValues.image,
          });
          callUserDataLoad();
          closePopup();
        },
      },
    ],
  });

export const popupUserSettingsTimezone = () =>
  setAppPopup(['timezone'])({
    mandatory: true,
    loading: false,
    header: 'Set timezone',
    content: [
      {
        type: 'info',
        bodyText: `Select an image for upload`,
      },
      {
        type: 'autocomplete',
        elemKey: 'timezone',
        value: '',
        label: 'Timezones',
        options: [
          ...new Set(Object.values(jstz.olson.timezones).map((item) => item)),
        ].map((v) => ({
          id: v,
          label: `${v}`,
        })),
        setOnChange: (val, {setPopupElementValue}) => {
          setPopupElementValue('timezone', val);
        },
      },
    ],
    buttons: [
      {type: 'cancel'},
      {
        type: 'confirmWithInput',
        elemKey: 'confirmButton',
        variant: 'outlined',
        labelText: 'Upload',
        onClick: async (allValues) => {
          await trpcFunc.trpcAppUserSettingsChange.mutate({
            changes: {timezone: allValues.timezone},
          });
          enqueueSnackbar(`Profile data succesfully updated.`, {
            variant: 'success',
          });
          callUserDataLoad();
          closePopup();
        },
      },
    ],
  });

export const popupUserSettingsName = (oldName: string) =>
  setAppPopup(['name'])({
    mandatory: true,
    loading: false,
    header: 'Change name',
    content: [
      {
        type: 'info',
        bodyText: `Change personal name`,
      },
      {
        type: 'input',
        labelText: 'New name',
        elemKey: 'name',
        value: oldName,
        setOnChange: (val, {setPopupElementValue}) => {
          setPopupElementValue('name', val);
        },
      },
    ],
    buttons: [
      {type: 'cancel'},
      {
        type: 'confirmWithInput',
        elemKey: 'confirmButton',
        variant: 'outlined',
        labelText: 'Update',
        onClick: async (allValues) => {
          await trpcFunc.trpcAppUserSettingsChange.mutate({
            changes: {name: allValues.name},
          });
          callUserDataLoad();
          closePopup();
        },
      },
    ],
  });

export const popupUserSettingsLang = (oldLang: 'en' | 'de') =>
  setAppPopup(['lang'])({
    header: 'Change language',
    content: [
      {
        type: 'info',
        bodyText: `Select language`,
      },
      {
        type: 'dialogSelect',
        elemKey: 'lang',
        value: oldLang,
        label: 'Button',
        setOnChange: (val, {setPopupElementValue}) => {
          setPopupElementValue('lang', val);
        },
        options: [
          {
            id: 'en',
            label: 'English',
          },
          {
            id: 'de',
            label: 'Deutsch',
          },
        ],
      },
    ],
    buttons: [
      {type: 'cancel'},
      {
        type: 'confirmWithInput',
        elemKey: 'confirmButton',
        variant: 'outlined',
        labelText: 'Set',
        onClick: async (allValues) => {
          await trpcFunc.trpcAppUserSettingsChange.mutate({
            changes: {language: allValues.lang},
          });
          callUserDataLoad();
          closePopup();
        },
      },
    ],
  });
