import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useApiContext, usePreferencesContext } from '@polito/lib/core';

import { CoursesProvider } from '../contexts/CoursesContext';
import { AppPreferences } from '../types/preferences';
import { GuestNavigator } from './GuestNavigator';
import { RootNavigator } from './RootNavigator';

export const AppContent = () => {
  const { isLogged } = useApiContext();
  const preferences = usePreferencesContext<AppPreferences>();

  if (!isLogged || preferences.loginUid) {
    return <GuestNavigator />;
  }

  return (
    <CoursesProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootNavigator />
      </GestureHandlerRootView>
    </CoursesProvider>
  );
};
