// import {setPopup} from '../slices/slicePopup';

import {Popup} from '../types/typesPopup';

export const showDialogError = ({
  header,
  bodyText,
}: {
  header: string;
  bodyText: string;
}): Popup => ({
  open: true,
  mandatory: false,
  header,
  loading: false,
  content: [{type: 'error', bodyText, elemKey: 'error'}],
  buttons: [{type: 'close', elemKey: 'close'}],
});

export const showDialogSuccess = ({
  header,
  bodyText,
}: {
  header: string;
  bodyText: string;
}): Popup => ({
  open: true,
  header,
  loading: false,
  mandatory: false,
  content: [{type: 'success', bodyText, elemKey: 'success'}],
  buttons: [{type: 'close', elemKey: 'close'}],
});
