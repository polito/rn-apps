import { createContext, useContext } from 'react';

import { PolitoAppConfig } from '../config';

export const PolitoAppContext = createContext<PolitoAppConfig | undefined>(
  undefined,
);

export const usePolitoAppConfig = () => {
  const appConfig = useContext(PolitoAppContext);
  if (!appConfig)
    throw new Error(
      'No PolitoAppContext.Provider found when calling usePolitoAppConfig.',
    );
  return appConfig;
};
