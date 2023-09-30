import {enqueueSnackbar} from 'notistack';
import {trpcFunc} from '../trpc';
import {closePopup, setPopup} from '../zustand/popup';

export const popupProObjectTimerDel = (
  objectId: number,
  timerId: number,
  refetch: () => void,
) =>
  setPopup({
    header: 'Delete timer',
    content: [
      {
        type: 'info',
        bodyText: `Do you want to delete timer ${timerId}?`,
      },
    ],
    buttons: [
      {type: 'cancel'},
      {
        type: 'confirmWithInput',
        labelText: 'Delete',
        variant: 'outlined',
        onClick: async () => {
          await trpcFunc.trpcObjectTimerDel.mutate({
            objectId,
            timerId,
          });
          enqueueSnackbar(`Timer successfully deleted`, {variant: 'success'});
          refetch();
          closePopup();
        },
      },
    ],
  });
