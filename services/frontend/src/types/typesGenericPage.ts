import {AvatarTypeMap} from '@mui/material';
import {AllRoutesObjectType} from '../router/routes';
import {IconType} from 'react-icons';

export type GenericPageType = {
  settingsMenu?: {
    label: string;
    icon?: IconType;
    onClick: () => void;
  }[];
  header?: [];
  subHeader?: (
    | 'filter'
    // | {button: {icon?: IconType; label: string; onClick: () => void}} // 'ButtonObjectRegisterManual'
    | {
        buttonLabel: string;
        onClick: () => void;
        startIcon?: IconType;
      }
  )[];
  content: (
    | {type: 'customComponent'; value: () => JSX.Element}
    | GenericPageSubtitleType
    | GenericPageTabsType
    | GenericPageContainerType
    | GenericPageListType
    | GenericPageWidgets
    | GenericPageIframe
    | GenericPageChat
  )[];
  footer?: [];
};

export type GenericPageWidgets = {
  type: 'widgets';
  data: {
    widgetId: number;
    name: string;
    iconColor: string;
    descr: string;
    project?: {
      projectId: number;
      projectName: string;
      projectColor: string;
    };
    creatorId: number;
  }[];
};

export type GenericPageIframe = {
  type: 'iframe';
  url: string;
  widgetId: number;
  // sendDataToFrame: (f: () => void) => void;
};

export type GenericPageChat = {
  type: 'chat';
  projectId: number;
  chatImage?: string | null;
  // setChatImage?: (p: string | null) => void;
};

export type GenericPageSubtitleType = {
  type: 'subtitle';
  icon?: IconType;
  primary?: string;
  secondary?: string;
  menu?: {text: string; func: () => void}[];
};

export type GenericPageContainerType = {
  type: 'container';
  title?: string;
  titleAction?: {
    menu?: {text: string; func: () => void}[];
  };

  list: ((
    | {chipText: string}
    | {code: {text: string; onChange: (v: string) => void}}
    | {
        input: {
          label: string;
          errorText?: string;
          value: string;
          onChange: (v: string) => void;
          rows: number;
        };
      }
    | {primaryButton: {text: string; onClick: () => void; disabled?: boolean}}
    | {primaryDisplay: {label: string; text: string}}
    | {
        primaryText: string;
        primmaryRawIcon?: IconType;
        link?: string;
        secondaryText?: string;
        widget_line_color?: string;
        // startIconUrl?: string;
        // avatarType?: AvatarTypeMap['props']['variant'];
        // customIcon?: string;
        startAvatar?: ({startIconUrl?: string} | {icon: IconType}) & {
          // id: keyof StandardIcons;
          // icon: IconType;
          colorAvatarBackground?: string;
          avatarType?: AvatarTypeMap['props']['variant'];
          size?: 'large';
        }; // 'Description';
      }
  ) & {
    action?:
      | {
          button?: {
            label: string;
            disabled?: boolean;
            verticalLineColor?: string;
            onClick?: () => void;
            icon?: IconType;
          };
          button2?: {
            label: string;
            disabled: boolean;
            onClick?: () => void;
          };
          switch?: GenericPageContainerSwitchType;
          label?: {value: string; addition?: string};
          menu?: {text: string; func: () => void}[];
          actionIconRaw?: IconType;
        }
      | {toggle: {value: boolean; onToggle: (v: boolean) => void}}
      | {chip: {text: string}}
      | {onoff: {value: 'on' | 'off'}};
    sublist?: {primary: string; value?: string | number}[];
  })[];
};

export type GenericPageContainerSwitchType = {
  label: string;
  color?: string;
  disabled: boolean;
  onClick?: () => void;
  options: {
    id: string;
    color: string;
    label: string;
    onClick: () => void;
  }[];
};

export type GenericPageTabsType = {
  type: 'tabs';
  data: {label: string; link: string; path: keyof AllRoutesObjectType}[];
  addQuery?: boolean;
};

export type GenericPageListType = {
  type: 'list';
  avatarType?: AvatarTypeMap['props']['variant'];
  data: GenericPageListItemType[];
};

export type GenericPageListItemType = {
  id: number;
  link?: string;
  primaryText: string;
  primaryTextProjectColor?: string;
  secondaryText?: string;
  customIcon?: string;
  standardIcon?: {
    // id: keyof StandardIcons;
    icon: IconType;
    colorAvatarBackground?: string;
  };
  connection?: string;
  project?: {
    project_id: number;
    name: string;
    color: string;
  } | null;
  secondaryCircleColor?: string;
};
