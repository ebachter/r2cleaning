import {Form} from './typesGenericForm';

type Sections =
  | {
      type: 'textbox_simple';
      texts: ({title: string} | {primary: string} | {secondary: string})[];
    }
  | {
      type: 'formData';
      data: Form;
    }
  | {
      type: 'header_simple';
      text: string;
    }
  | {
      type: 'header_image';
      path: string;
      text?: string;
      responsive?: boolean;
      width?: string;
    }
  | {
      type: 'header_text';
      title: string;
      text: string;
    }
  | {
      type: 'points1_points2';
      section: string;
      subHeader: string;
      points: string[];
      points2: string[];
    }
  | {
      type: 'points_image';
      section: string;
      subHeader?: string;
      points?: string[];
      text?: string;
      path: string;
      icons_bottom?: {label: string; path: string}[];
    }
  | {
      type: 'image_points';
      section: string;
      subHeader?: string;
      points?: string[];
      text?: string;
      path: string;
      icons_bottom?: {label: string; path: string}[];
    }
  | {type: 'label_text'; label: string; text: string};

export type ExtPageType = Sections[];
