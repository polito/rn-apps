import { createContext, useContext } from 'react';

import {
  AuthApiClient,
  AuthIdentityValidator,
  PushTokenProvider,
} from '../types/auth';

export type AuthApiContextProps = {
  client: AuthApiClient;
  getPushToken?: PushTokenProvider;
  validateIdentity?: AuthIdentityValidator;
};

export const AuthApiContext = createContext<AuthApiContextProps | undefined>(
  undefined,
);

export const useAuthApiContext = () => {
  const authApiContext = useContext(AuthApiContext);
  if (!authApiContext) {
    throw new Error(
      'No AuthApiContext.Provider found when calling useAuthApiContext.',
    );
  }
  return authApiContext;
};
