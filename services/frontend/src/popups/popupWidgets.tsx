import {t} from '../i18n/i18n';
import {pushRoute, replaceRoute} from '../router/helpers';
import {trpcFunc} from '../trpc';
import {closePopup, setPopup} from '../zustand/popup';

export const popupAppWidgetDelete = ({
  widgetId,
  widgetName,
}: {
  widgetId: number;
  widgetName: string;
}) =>
  setPopup({
    open: true,
    mandatory: false,
    loading: false,
    header: 'Delete widget',
    content: [
      {
        type: 'info',
        elemKey: 'info1',
        bodyText: `Do you want to delete the widget [${widgetId}] ${widgetName}?`,
      },
    ],
    buttons: [
      {type: 'cancel', elemKey: 'cancel'},
      {
        type: 'confirmWithInput',
        elemKey: 'confirm',
        variant: 'outlined',
        labelText: 'Terminate',
        onClick: async () => {
          const {status} = await trpcFunc.appWidgetDel.mutate({widgetId});
          if (status === 204) {
            return {
              onPopupSuccess: () => {
                replaceRoute('/widgets');
                closePopup();
              },
            };
          }
        },
        // closeAfter: true,
      },
    ],
  });

export const popupAppWidgetAdd = ({
  widgetTemplateId,
  widgetName,
}: {
  widgetTemplateId: number;
  widgetName: string;
}) =>
  setPopup({
    open: true,
    mandatory: false,
    loading: false,
    header: 'Add widget',
    content: [
      {
        type: 'info',
        elemKey: 'info1',
        bodyText: `Do you want to add the widget [${widgetTemplateId}] ${widgetName}?`,
      },
    ],
    buttons: [
      {type: 'cancel', elemKey: 'cancel'},
      {
        type: 'confirmWithInput',
        elemKey: 'confirm',
        variant: 'outlined',
        labelText: 'Add',
        onClick: async () => {
          const {status, widgetId} = await trpcFunc.appWidgetAdd.mutate({
            widgetTemplateId,
          });
          if (status === 204) {
            return {
              onPopupSuccess: () => {
                pushRoute(`/widgets/${widgetId}`);
                closePopup();
              },
            };
          }
        },
        // closeAfter: true,
      },
    ],
  });

export function opsPopupWidgetDelInit({widgetId}: {widgetId: number}) {
  setPopup({
    open: true,
    mandatory: false,
    header: t('dialogWidgetDelHeader'),
    content: [
      {
        type: 'info',
        bodyText: t('dialogWidgetDelContent1', {widgetId: String(widgetId)}),
      },
    ],
    buttons: [
      {type: 'cancel'},
      {
        type: 'confirmWithInput',
        variant: 'outlined',
        labelText: t('dialogTermButtonTextConfirm'),
        onClick: async () => {
          await trpcFunc.devWidgetDelSaga.mutate({widgetId});
          replaceRoute('/admin/widgets');
          closePopup();
        },
        // action: {type: 'WIDGET_DEL', widgetid},
        // closeAfter: true,
      },
    ],
  });
}
