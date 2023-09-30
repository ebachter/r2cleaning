import MuiButton from '@mui/material/Button';

type NonameFunction = (...args: any[]) => void;

interface Props {
  elemKey?: string;
  onClick: NonameFunction;
  disabled?: boolean;
  label?: string;
  variant?: 'text' | 'outlined' | 'contained' | undefined;
  size?: 'small' | 'medium' | 'large';
}

export function CustomButton({
  elemKey,
  onClick,
  disabled,
  label,
  variant,
  size = 'small',
}: Props): JSX.Element {
  return (
    <MuiButton
      size={size}
      variant={variant || 'text'}
      key={elemKey}
      onClick={onClick}
      disabled={disabled}
      color="primary"
    >
      {label}
    </MuiButton>
  );
}
