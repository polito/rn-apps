import { PropsWithChildren, useEffect, useState } from 'react';

import * as SplashScreen from 'expo-splash-screen';

import { SplashContext } from '../../core/contexts/SplashContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

export function SplashProvider({ children }: PropsWithChildren) {
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [isSplashLoaded, setIsSplashLoaded] = useState(false);

  useEffect(() => {
    if (isAppLoaded) {
      SplashScreen.hideAsync()
        .then(() => {
          setIsSplashLoaded(true);
        })
        .catch(console.warn);
    }
  }, [isAppLoaded]);

  return (
    <SplashContext.Provider
      value={{
        isAppLoaded,
        setIsAppLoaded,
        isSplashLoaded,
      }}
    >
      {children}
    </SplashContext.Provider>
  );
}
