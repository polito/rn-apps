// In-memory replacement for react-native-keychain.
// A single slot is shared by every keychain service (credentials and MFA key),
// which is enough for the flows covered by the tests.
import AsyncStorage from '@react-native-async-storage/async-storage';

type Credentials = { username: string; password: string };
let stored: Credentials | undefined;

export const getGenericPassword = jest.fn(
  async (): Promise<Credentials | false> => stored ?? false,
);
export const setGenericPassword = jest.fn(
  async (username: string, password: string) => {
    stored = { username, password };
    return true;
  },
);
export const resetGenericPassword = jest.fn(async () => {
  stored = undefined;
  return true;
});
export const hasGenericPassword = jest.fn(async () => !!stored);
export const isPasscodeAuthAvailable = jest.fn(async () => false);

export const ACCESSIBLE = {};
export const ACCESS_CONTROL = {};

export default {
  getGenericPassword,
  setGenericPassword,
  resetGenericPassword,
  hasGenericPassword,
  isPasscodeAuthAvailable,
  ACCESSIBLE,
  ACCESS_CONTROL,
};

export const __seedCredentials = ({ username, password }: Credentials) => {
  stored = { username, password };
  // this is needed because ApiProvider takes username from preferences (AsyncStorage)
  return AsyncStorage.setItem('username', username);
};

export const __resetKeychain = () => {
  stored = undefined;
};
