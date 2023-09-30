import {trpcFunc} from '../trpc';
import {
  closePopup,
  getPopupAllValues,
  setPopup,
  setPopupElementValue,
} from '../zustand/popup';
import {getAppState} from '../redux/store';
import {PopupAutocommplete} from '../types/typesPopup';

export const popupProjectWidgetAdd = (
  projectId: number,
  refetch: () => void,
  exclude: Array<number>,
) => {
  const widgetsObj = getAppState().widgets;
  const objectsPrepared = Object.entries(widgetsObj).reduce(
    (n, [widgetId, o]) => {
      if (exclude.includes(Number(widgetId))) {
        return n;
      } else {
        n.push({
          id: widgetId,
          label: o.name,
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

    header: 'Add widget',
    content: [
      {type: 'info', bodyText: 'Select a widget from the list'},
      {
        type: 'autocomplete',
        elemKey: 'actionWidgetId',
        label: 'Select widget',
        value: null,
        initialValue: '',
        options: objectsPrepared, // {a123: 'qwer', bb134: 'qwer asd kms'},
        setOnChange: (val) => {
          // console.log('>>>', val);
          setPopupElementValue('actionWidgetId', val);
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
          console.log('object', allValues.actionWidgetId);
          const widgetId = allValues.actionWidgetId;
          if (widgetId) {
            await trpcFunc.trpcAppWidgetProjectSet.mutate({
              projectId: Number(projectId),
              widgetId: Number(widgetId),
            });
            refetch();
            closePopup();
          }
        },
      },
    ],
  });
};

export const popupProjectWidgetRem = (
  widgetId: number,
  widgetName: string,
  refetch: () => void,
) => {
  // console.log('##', objectsPrepared);
  setPopup({
    open: true,
    mandatory: true,
    loading: false,

    header: 'Remove widget',
    content: [
      {
        type: 'info',
        bodyText: `Do you want to remove the widget ${widgetName}`,
      },
    ],
    buttons: [
      {type: 'cancel'},
      {
        type: 'confirmWithInput',
        onClick: async () => {
          await trpcFunc.trpcAppWidgetProjectSet.mutate({
            widgetId: Number(widgetId),
            projectId: null,
          });
          refetch();
          closePopup();
        },
      },
    ],
  });
};
