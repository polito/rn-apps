import { Platform } from 'react-native';

export const GITHUB_URL =
  'https://github.com/polito/students-app/releases/latest';

export const DEFAULT_SSO_LOGIN_URL = `https://app.didattica.polito.it/auth/students/start?platform=${Platform.OS}`;
export const DEFAULT_CHPASS_URL = `https://idp.polito.it/chpass/reset/?platform=${Platform.OS}`;
