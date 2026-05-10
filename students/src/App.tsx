import { initReactI18next } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { APP_VERSION, BUILD_NO } from '@env';
import {
  PreferencesProvider,
  Sentry,
  extendSuperJSON,
  initSentry,
} from '@polito/lib/core';
import { FeedbackProvider, SplashProvider, UiProvider } from '@polito/lib/ui';
import Mapbox from '@rnmapbox/maps';

import i18n from 'i18next';

import { en, it } from '../assets/translations';
import { AppContent } from './core/components/AppContent';
import { DialogProvider } from './core/components/Dialog';
import { ApiProvider } from './core/providers/ApiProvider';
import { RootParamList } from './core/types/navigation';
import {
  AppPreferences,
  editablePreferenceKeys as appEditablePreferenceKeys,
  objectPreferenceKeys as appObjectPreferenceKeys,
  initialAppPreferences,
} from './core/types/preferences';
import { isEnvProduction } from './utils/env';
import { setDeepLink } from './utils/linking';

extendSuperJSON();

Mapbox.setAccessToken(process.env.MAPBOX_TOKEN! || 'no_token');

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
  dsn: 'https://0b3fe6c2fc0bd91481a14b1ad5c6b00d@sentry.k8s.polito.it/3',
  enabled: isEnvProduction,
  appName: 'students',
  version: APP_VERSION,
  dist: BUILD_NO,
  environment: process.env.NODE_ENV,
});

extendSuperJSON();

Mapbox.setAccessToken(process.env.MAPBOX_TOKEN || 'no_token');

const App = () => {
  return (
    <SafeAreaProvider>
      <SplashProvider>
        {/* Provide the app-specific preference key lists and types */}
        <PreferencesProvider<AppPreferences>
          extraEditableKeys={appEditablePreferenceKeys}
          extraObjectKeys={appObjectPreferenceKeys}
          initialPreferences={initialAppPreferences}
        >
          <UiProvider<RootParamList> linking={setDeepLink()}>
            <FeedbackProvider>
              <ApiProvider>
                <DialogProvider />
                <AppContent />
              </ApiProvider>
            </FeedbackProvider>
          </UiProvider>
        </PreferencesProvider>
      </SplashProvider>
    </SafeAreaProvider>
  );
};

export default Sentry.withTouchEventBoundary(App);
