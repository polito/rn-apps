import { Platform } from 'react-native';

export type PolitoAppId = 'students' | 'faculty';

export type PolitoAppConfig = {
  id: PolitoAppId;
  appName: string;
  clientName: string;
  deepLinkPrefix: string;
  keychainService: string;
  mfaKeychainService: string;
  ssoRouteName: string;
  ssoAudience: string;
};

export const POLITO_APP_CONFIGS = {
  students: {
    id: 'students',
    appName: 'students',
    clientName: 'students-app',
    deepLinkPrefix: 'polito://students',
    keychainService: 'it.polito.students-app',
    mfaKeychainService: 'it.polito.students-app.mfa',
    ssoRouteName: 'SSO',
    ssoAudience: 'students',
  },
  faculty: {
    id: 'faculty',
    appName: 'faculty',
    clientName: 'faculty-app',
    deepLinkPrefix: 'polito://faculty',
    keychainService: 'it.polito.faculty-app',
    mfaKeychainService: 'it.polito.faculty-app.mfa',
    ssoRouteName: 'SSO',
    ssoAudience: 'faculty',
  },
} as const satisfies Record<PolitoAppId, PolitoAppConfig>;

export const getPolitoAppConfig = (appId: PolitoAppId): PolitoAppConfig =>
  POLITO_APP_CONFIGS[appId];

export const getPolitoSsoLoginUrl = (
  appId: PolitoAppId,
  platform: string = Platform.OS,
) =>
  `https://app.didattica.polito.it/auth/${getPolitoAppConfig(appId).ssoAudience}/start?platform=${platform}`;

export const getPolitoChpassUrl = (platform: string = Platform.OS) =>
  `https://idp.polito.it/chpass/reset/?platform=${platform}`;
