import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { initReactI18next } from 'react-i18next';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { APP_VERSION, BUILD_NO, SENTRY_DSN } from '@env';
import { PreferencesProvider, Sentry, initSentry } from '@polito/lib/core';
import { FeedbackProvider, SplashProvider, UiProvider } from '@polito/lib/ui';
import Mapbox from '@rnmapbox/maps';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// <-- import React Query
import { RootNavigator } from '~/core/components/RootNavigator';
import { CoursesProvider } from '~/core/contexts/CoursesContext';
import { RootParamList } from '~/core/types/navigation';
import {
  AppPreferences,
  editablePreferenceKeys as appEditablePreferenceKeys,
  objectPreferenceKeys as appObjectPreferenceKeys,
  initialAppPreferences,
} from '~/core/types/preferences';
import { setDeepLink } from '~/utils/linking';

import i18n from 'i18next';

import { en, it } from '../assets/translations';
import { isEnvProduction } from './utils/env';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews',
]);

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: en,
    },
    it: {
      translation: it,
    },
  },
});

initSentry({
  dsn: SENTRY_DSN,
  enabled: isEnvProduction,
  appName: 'faculty',
  version: APP_VERSION,
  dist: BUILD_NO,
  environment: process.env.NODE_ENV || 'development',
});

// Crea l'istanza di QueryClient
const queryClient = new QueryClient();

Mapbox.setAccessToken(process.env.MAPBOX_TOKEN! || 'no_token');

const App = () => {
  return (
    // Avvolgi tutto dentro QueryClientProvider e passa il client

    <Sentry.TouchEventBoundary>
      <SafeAreaProvider>
        <SplashProvider>
          {/* Provide the app-specific preference key lists and types */}
          <PreferencesProvider<AppPreferences>
            extraEditableKeys={appEditablePreferenceKeys}
            extraObjectKeys={appObjectPreferenceKeys}
            initialPreferences={initialAppPreferences}
          >
            <UiProvider<RootParamList> linking={setDeepLink()}>
              <QueryClientProvider client={queryClient}>
                <CoursesProvider>
                  <FeedbackProvider>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                      <RootNavigator />
                    </GestureHandlerRootView>
                  </FeedbackProvider>
                </CoursesProvider>
              </QueryClientProvider>
            </UiProvider>
          </PreferencesProvider>
        </SplashProvider>
      </SafeAreaProvider>
    </Sentry.TouchEventBoundary>
  );
};

export default App;
