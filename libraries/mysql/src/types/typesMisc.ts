export type LanguageOptions = 'en' | 'de';
export type UserToken = {
  userid: number;
  userId: number;
  language: LanguageOptions;
  lang: LanguageOptions;
};

export type ChatMessage = {
  projectId: number;
  message: string;
  chatImage: string | null;
};

export type Subset<K> = {
  [attr in keyof K]?: K[attr] extends object
    ? Subset<K[attr]>
    : K[attr] extends object | null
    ? Subset<K[attr]> | null
    : K[attr] extends object | null | undefined
    ? Subset<K[attr]> | null | undefined
    : K[attr];
};

type _Overwrite<T, U> = U extends object
  ? {[K in keyof T]: K extends keyof U ? _Overwrite<T[K], U[K]> : T[K]} & U
  : U;

export type Overwrite<T, U> = _Overwrite<T, U>;

export type CommandToUser = {
  commands: ('reloadUserData' | 'reloadObjects' | 'reloadProjects')[];
  message?: string;
};
