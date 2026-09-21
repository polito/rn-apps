import AsyncStorage from '@react-native-async-storage/async-storage';

type Credentials = { username: string; password?: string | null };
let stored: Credentials | undefined;

export const getCredentials = jest.fn(
  async (): Promise<Credentials | false> => stored ?? false,
);
export const setCredentials = jest.fn(
  async (username: string, password: string | null = null) => {
    stored = { username, password };
    return true;
  },
);
export const resetCredentials = jest.fn(async () => {
  stored = undefined;
});

export const checkCanSavePrivateKeyMFA = jest.fn(async () => false);
export const hasPrivateKeyMFA = jest.fn(async () => false);
export const getPrivateKeyMFA = jest.fn(async () => null);
export const savePrivateKeyMFA = jest.fn(async () => true);
export const resetPrivateKeyMFA = jest.fn(async () => {});

export const __seedCredentials = ({ username, password }: Credentials) => {
  stored = { username, password };
  // this is needed becaues App takes preference from AsyncStorage
  AsyncStorage.setItem('username', username);
};

export const __resetKeychain = () => {
  stored = undefined;
  return AsyncStorage.removeItem('username');
};
