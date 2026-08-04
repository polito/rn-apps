import { Platform } from 'react-native';

export type PolitoAppConfig = {
  id: string;
  keychainService: string;
};

export const getPolitoDeepLinkPrefix = (appId: string) => `polito://${appId}`;

export const getPolitoMfaKeychainService = (keychainService: string) =>
  `${keychainService}.mfa`;

export const getPolitoSsoLoginUrl = (
  appId: string,
  platform: string = Platform.OS,
) => `https://app.didattica.polito.it/auth/${appId}/start?platform=${platform}`;

export const getPolitoChpassUrl = (platform: string = Platform.OS) =>
  `https://idp.polito.it/chpass/reset/?platform=${platform}`;
