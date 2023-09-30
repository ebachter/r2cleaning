import {FC} from 'react';
import {PopupButtonConfirmWithInput} from '../types/typesPopup';
import {CustomButton} from './CustomButton';
import {getPopupAllValues} from '../zustand/popup';

type NoType = Omit<PopupButtonConfirmWithInput, 'type' | 'key'>;
type Props = {
  loading: boolean;
  handleClose: (e: null, reason: null) => void;
} & NoType;

export const DialogButtonWithInput: FC<Props> = ({
  elemKey,
  labelText,
  onClick,
  variant,
  disabled,
}) => {
  return (
    <CustomButton
      elemKey={elemKey}
      label={labelText || 'I confirm'}
      variant={variant}
      onClick={async () => {
        if (onClick) {
          const allValues = getPopupAllValues();
          onClick(allValues);
        }
      }}
      disabled={disabled}
    />
  );
};
