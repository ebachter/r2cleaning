export type SignupState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  showView: 'userdata' | 'success';
};

export type SignupSetState = (fn: (args: SignupState) => void) => void;

export const signupInitData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  showView: 'userdata' as 'userdata',
};
