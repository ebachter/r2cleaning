export type Session = {
  sessionToken: string | null;
  refreshToken?: string | null;
  phone?: `+${number | ''}`;
  smsSent?: boolean;
};
