import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { initReactI18next } from 'react-i18next';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  FeedbackProvider,
  PreferencesProvider,
  SplashProvider,
  UiProvider,
} from '@polito/lib';
import Mapbox from '@rnmapbox/maps';
import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// <-- import React Query
import { NavBar } from '~/core/components/NavBar';
import { CoursesProvider } from '~/core/contexts/CoursesContext';
import { RootParamList } from '~/core/types/navigation';
import {
  AppPreferences,
  editablePreferenceKeys as appEditablePreferenceKeys,
  objectPreferenceKeys as appObjectPreferenceKeys,
  initialAppPreferences,
} from '~/core/types/preferences';
import { setDeepLink } from '~/utils/linking';
import { initSentry } from '~/utils/sentry';

import i18n from 'i18next';

import { en, it } from '../assets/translations';

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

// Crea l'istanza di QueryClient
const queryClient = new QueryClient();
initSentry();

Mapbox.setAccessToken(process.env.MAPBOX_TOKEN!);

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
                      <NavBar />
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
