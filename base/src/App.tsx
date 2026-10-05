/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useEffect } from 'react';

import { useSplashContext } from '@polito/lib/core';
import { SplashProvider } from '@polito/lib/ui';
import { NewAppScreen as RawNewAppScreen } from '@react-native/new-app-screen';

const NewAppScreen = RawNewAppScreen as unknown as React.FC;

function AppContent(): React.JSX.Element {
  const splashContext = useSplashContext();

  useEffect(() => {
    splashContext.setIsAppLoaded(true);
  }, [splashContext]);

  return <NewAppScreen />;
}

function App(): React.JSX.Element {
  return (
    <SplashProvider>
      <AppContent />
    </SplashProvider>
  );
}

export default App;
