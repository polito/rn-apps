import { useMemo } from 'react';
import { Platform } from 'react-native';
import Keychain, {
  AuthenticationPrompt,
  BaseOptions,
  GetOptions,
  SetOptions,
  hasGenericPassword,
} from 'react-native-keychain';

import { PolitoAppConfig, getPolitoMfaKeychainService } from '../config';
import { usePolitoAppConfig } from '../contexts/PolitoAppContext';

const NO_TOKEN = '__EMPTY__';

export interface KeychainServiceCredentials {
  username: string;
  password?: string | null;
}

export const createCredentialsKeychainService = (
  keychainSettings: BaseOptions,
) => {
  async function getCredentials(): Promise<KeychainServiceCredentials | false> {
    const credentials = await Keychain.getGenericPassword(keychainSettings);
    if (credentials && credentials.password === NO_TOKEN) {
      return { ...credentials, password: null };
    }
    return credentials;
  }

  async function setCredentials(
    username: string,
    password: string | null = null,
  ): Promise<boolean> {
    return !!(await Keychain.setGenericPassword(
      username,
      password || NO_TOKEN,
      keychainSettings,
    ));
  }

  async function resetCredentials(): Promise<void> {
    const credentials = await Keychain.getGenericPassword(keychainSettings);
    if (credentials) {
      await Keychain.resetGenericPassword(keychainSettings);
      await setCredentials(credentials.username, NO_TOKEN);
    }
  }

  return {
    getCredentials,
    resetCredentials,
    setCredentials,
  };
};

export type CredentialsKeychainService = ReturnType<
  typeof createCredentialsKeychainService
>;

export class AuthenticatorPrivKey {
  constructor(
    public readonly serial: string,
    public readonly privateKeyB64: string,
    public readonly type: 'secp256k1' = 'secp256k1',
  ) {}

  serialize(): string {
    return JSON.stringify({
      serial: this.serial,
      privateKeyB64: this.privateKeyB64,
      type: this.type,
    });
  }

  static fromJSON(json: string): AuthenticatorPrivKey {
    const data = JSON.parse(json) as AuthenticatorPrivKey;
    return new AuthenticatorPrivKey(data.serial, data.privateKeyB64, data.type);
  }
}

export const createMfaPrivateKeyKeychainService = ({
  service,
  settings,
}: {
  service: string;
  settings?: Omit<SetOptions & GetOptions, 'service'>;
}) => {
  const keychainSettings: SetOptions | GetOptions = {
    service,
    accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
    accessControl: Platform.select({
      android: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
      // On iOS, BIOMETRY_ANY_OR_DEVICE_PASSCODE behaves like a combination.
      // USER_PRESENCE matches the intended prompt semantics more closely.
      ios: Keychain.ACCESS_CONTROL.USER_PRESENCE,
    }),
    ...settings,
  };

  async function checkCanSavePrivateKeyMFA() {
    return Keychain.isPasscodeAuthAvailable();
  }

  async function savePrivateKeyMFA(
    serial: string,
    privateKeyB64: string,
    authenticationPrompt: AuthenticationPrompt,
  ): Promise<boolean> {
    const privateKey = new AuthenticatorPrivKey(serial, privateKeyB64);

    await Keychain.setGenericPassword(serial, privateKey.serialize(), {
      ...keychainSettings,
      authenticationPrompt,
    });
    return true;
  }

  async function getPrivateKeyMFA(
    authenticationPrompt: AuthenticationPrompt,
  ): Promise<string | null> {
    const credentials = await Keychain.getGenericPassword({
      ...keychainSettings,
      authenticationPrompt,
    });

    if (credentials !== false && credentials.password) {
      return credentials.password;
    }

    return null;
  }

  async function resetPrivateKeyMFA(): Promise<void> {
    await Keychain.resetGenericPassword({ service });
  }

  async function hasPrivateKeyMFA(): Promise<boolean> {
    const [isPasscodeAvailable, hasPassword] = await Promise.all([
      Keychain.isPasscodeAuthAvailable(),
      hasGenericPassword(keychainSettings),
    ]);

    return isPasscodeAvailable && hasPassword;
  }

  return {
    checkCanSavePrivateKeyMFA,
    getPrivateKeyMFA,
    hasPrivateKeyMFA,
    resetPrivateKeyMFA,
    savePrivateKeyMFA,
  };
};

export type MfaPrivateKeyKeychainService = ReturnType<
  typeof createMfaPrivateKeyKeychainService
>;

export const createPolitoAppKeychainServices = (appConfig: PolitoAppConfig) => {
  return {
    credentials: createCredentialsKeychainService({
      service: appConfig.keychainService,
    }),
    mfaPrivateKey: createMfaPrivateKeyKeychainService({
      service: getPolitoMfaKeychainService(appConfig.keychainService),
    }),
  };
};

export type PolitoAppKeychainServices = ReturnType<
  typeof createPolitoAppKeychainServices
>;

export const usePolitoAppKeychainServices = () => {
  const appConfig = usePolitoAppConfig();

  return useMemo(() => createPolitoAppKeychainServices(appConfig), [appConfig]);
};

export const usePolitoAppCredentialsKeychain = () =>
  usePolitoAppKeychainServices().credentials;

export const usePolitoAppMfaPrivateKeyKeychain = () =>
  usePolitoAppKeychainServices().mfaPrivateKey;
