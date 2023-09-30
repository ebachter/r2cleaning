import {setPopup} from '../zustand/popup';

export const popupChatImage = ({imageString}: {imageString: string}) =>
  setPopup({
    header: 'Delete switch alert',
    content: [
      {
        type: 'info',
        bodyText: `Chat image view`,
      },
      {
        type: 'image',
        imageString,
      },
    ],
    buttons: [{type: 'close'}],
  });
