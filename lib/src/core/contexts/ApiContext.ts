import { createContext, useContext } from 'react';

export interface Credentials {
  username: string;
  token: string;
}

export interface ApiContextProps extends Credentials {
  isLogged: boolean;
  refreshContext: (credentials?: Credentials) => void;
}

export const ApiContext = createContext<ApiContextProps | undefined>(undefined);

export const useApiContext = () => {
  const apiContext = useContext(ApiContext);
  if (!apiContext)
    throw new Error('No ApiContext.Provider found when calling useApiContext.');
  return apiContext;
};
