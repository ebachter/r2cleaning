import {Action} from '@reduxjs/toolkit';
import {WritableDraft} from 'immer/dist/internal';

export type FormInfo = {
  type: 'info' | 'success' | 'warning' | 'error';
  sid?: string;
  label: string;
  disabled?: {status: number[]};
  elemKey?: string;
  // params?: {[key: any]: string};
  visible?: boolean;
};

export type ExtInputFormats =
  | 'password'
  | 'email'
  | 'number'
  | 'text'
  | 'email|string';

export type FormInput = {
  type: 'input';
  elemKey: string;
  format?: ExtInputFormats;
  label: string;
  disabled?: {status: Array<number | null>};
  visible?: boolean;
  value?: string;
  onChange?: ({
    value,
    // setFormState,
    setValue,
    setContentElemDisabled,
    delElemByKey,
  }: {
    value: string;
    // setContentElemValue: (elemKey: string, value: string) => void;
    /* setFormState: (
      f: (draft: WritableDraft<Form>) => void | Form,
    ) => void | Form; */
    setValue: (value: string) => void;
    setContentElemDisabled: (key: string, value: boolean) => void;
    delElemByKey: (key: string) => void;
  }) => void;
};

/* export type FormButtonFunc = {
  type: 'bigButtonWithFunc';
  label: LabelOptions;
  funcButton: {
    params: string[];
    func: (params: {
      [k: string]: string;
    }) => Promise<{status: number | undefined}>;
  };
  disabled?: {status: Array<number | null>};
}; */

export type Button = {
  type: 'recaptchaButton';
  elemKey?: string;
  label: string;
  withRecaptcha?: boolean;
  funcButton?: {
    params: string[];
    func: (params: {
      [k: string]: string;
    }) => Promise<{status: number | undefined}>;
  };
  disabled?: boolean | {status: Array<number | null>};
  onSubmit?: ({
    allValues,
    reCapString,
    appendFormContent,
    placeContentElem,
    setContentElemDisabled,
    delElemByKey,
  }: {
    allValues: {[k: string]: any};
    reCapString: string | null;
    appendFormContent: (data: FormContent) => void;
    placeContentElem: (index: number, data: FormContentElem) => void;
    setContentElemDisabled: (key: string, value: boolean) => void;
    delElemByKey: (key: string) => void;
  }) => void;
};

export type FormContentElem = FormInfo | FormInput | Button;
export type FormContent = FormContentElem[];

type SetContentElemDisabled = (key: string, value: boolean) => void;

export type Form = {
  header: string;
  subHeader?: string;
  forgotPassword?: boolean;
  mandatory?: boolean;
  headerFreeText?: string;
  loading?: boolean;
  codes?: {[statusId: number]: {type: FormInfo['type']; text: string}};
  content: FormContent;
  onLoadActions: {
    actionFn: ({
      setContentElemDisabled,
      placeContentElem,
      delElemByKey,
    }: {
      setContentElemDisabled: SetContentElemDisabled;
      placeContentElem: (index: number, data: FormContentElem) => void;
      delElemByKey: (key: string) => void;
    }) => void;
  }[];
};
