import {trpcFunc} from '../trpc';
import {
  closePopup,
  getPopupAllValues,
  setPopup,
  setPopupElementValue,
} from '../zustand/popup';
import {getAppState} from '../redux/store';
import {PopupAutocommplete} from '../types/typesPopup';

export const popupProjectMemberAdd = (
  projectId: number,
  refetch: () => void,
  exclude: Array<number>,
) => {
  const usersObj = getAppState().contacts;
  const usersPrepared = Object.entries(usersObj).reduce((n, [userId, o]) => {
    if (exclude.includes(Number(userId))) {
      return n;
    } else {
      n.push({
        id: userId,
        label: o.name,
      });
      return n;
    }
  }, [] as PopupAutocommplete['options']);

  setPopup({
    open: true,
    mandatory: true,
    loading: false,

    header: 'Add member',
    content: [
      {type: 'info', bodyText: 'Select a user from the list'},
      {
        type: 'autocomplete',
        elemKey: 'actionUserId',
        label: 'Select widget',
        value: null,
        initialValue: '',
        options: usersPrepared, // {a123: 'qwer', bb134: 'qwer asd kms'},
        setOnChange: (val) => {
          // console.log('>>>', val);
          setPopupElementValue('actionUserId', val);
        },
      },
      {
        type: 'checkbox',
        elemKey: 'elemControl',
        label: 'Control',
        value: false,
        onChange: (val) => {
          console.log(val);
          setPopupElementValue('elemControl', val);
        },
      },
    ],
    buttons: [
      {type: 'cancel'},
      {
        type: 'confirmWithInput',
        elemKey: 'confirmButton',
        variant: 'outlined',
        labelText: 'Add',
        onClick: async () => {
          const allValues = getPopupAllValues();
          const extUserId = allValues.actionUserId;
          const controlAccess = allValues.elemControl;
          if (extUserId) {
            await trpcFunc.trpcAppUserProjectAdd.mutate({
              extUserId: Number(extUserId),
              projectId: Number(projectId),
              controlAccess,
            });
            refetch();
            closePopup();
          }
        },
      },
    ],
  });
};

export const popupProjectMemberRem = (
  projectId: number,
  extUserId: number,
  userName: string,
  refetch: () => void,
) => {
  // console.log('##', objectsPrepared);
  setPopup({
    open: true,
    mandatory: true,
    loading: false,

    header: 'Remove member',
    content: [
      {
        type: 'info',
        bodyText: `Do you want to remove the member ${userName}`,
      },
    ],
    buttons: [
      {type: 'cancel'},
      {
        type: 'confirmWithInput',
        variant: 'outlined',
        onClick: async () => {
          await trpcFunc.trpcAppUserProjectDel.mutate({
            projectId: Number(projectId),
            extUserId: Number(extUserId),
          });
          refetch();
          closePopup();
        },
      },
    ],
  });
};
