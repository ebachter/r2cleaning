export type Session = {
  sessionToken: string | null;
  refreshToken?: string | null;
  smsSent?: boolean;
};
