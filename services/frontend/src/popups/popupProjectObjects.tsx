import {trpcFunc} from '../trpc';
import {
  closePopup,
  getPopupAllValues,
  setPopup,
  setPopupElementValue,
} from '../zustand/popup';
import {getAppState} from '../redux/store';
import {PopupAutocommplete} from '../types/typesPopup';

export const popupProjectObjectAdd = (
  projectId: number,
  refetch: () => void,
  exclude: Array<number>,
) => {
  const objectsObj = getAppState().objects;
  const objectsPrepared = Object.entries(objectsObj).reduce(
    (n, [objectId, o]) => {
      if (exclude.includes(Number(objectId))) {
        return n;
      } else {
        n.push({
          id: objectId,
          label: o.object_name,
        });
        return n;
      }
    },
    [] as PopupAutocommplete['options'],
  );

  // console.log('##', objectsPrepared);
  setPopup({
    open: true,
    mandatory: true,
    loading: false,

    header: 'Add object',
    content: [
      {type: 'info', bodyText: 'Select an object from the list'},
      {
        type: 'autocomplete',
        elemKey: 'actionObjectId',
        label: 'Select object',
        value: null,
        initialValue: '',
        options: objectsPrepared, // {a123: 'qwer', bb134: 'qwer asd kms'},
        setOnChange: (val) => {
          // console.log('>>>', val);
          setPopupElementValue('actionObjectId', val);
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
          console.log('object', allValues.actionObjectId);
          const objectId = allValues.actionObjectId;
          if (objectId) {
            await trpcFunc.trpcAppObjectProjectSet.mutate({
              objectId: Number(objectId),
              projectId: Number(projectId),
            });
            refetch();
            closePopup();
          }
        },
      },
    ],
  });
};

export const popupProjectObjectDel = (
  objectId: number,
  objectName: string,
  refetch: () => void,
) => {
  // console.log('##', objectsPrepared);
  setPopup({
    open: true,
    mandatory: true,
    loading: false,

    header: 'Remove object',
    content: [
      {
        type: 'info',
        bodyText: `Do you want to remove the object ${objectName}`,
      },
    ],
    buttons: [
      {type: 'cancel'},
      {
        type: 'confirmWithInput',
        variant: 'outlined',
        onClick: async () => {
          console.log(objectId);
          await trpcFunc.trpcAppObjectProjectSet.mutate({
            objectId: objectId,
            projectId: null,
          });
          refetch();
          closePopup();
        },
      },
    ],
  });
};
