import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { initReactI18next } from 'react-i18next';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { APP_VERSION, BUILD_NO } from '@env';
import { AuthApi } from '@polito/auth-api-client';
import {
  ApiProvider,
  PolitoAppConfig,
  PreferencesProvider,
  Sentry,
  createPolitoLinking,
  extendSuperJSON,
  initSentry,
  isEnvProduction,
} from '@polito/lib/core';
import { mfaScreenTranslations } from '@polito/lib/features/auth';
import { FeedbackProvider, SplashProvider, UiProvider } from '@polito/lib/ui';
import Mapbox from '@rnmapbox/maps';

import { updateGlobalApiConfiguration } from '~/config/api';
import { RootNavigator } from '~/core/components/RootNavigator';
import { CoursesProvider } from '~/core/contexts/CoursesContext';
import { RootParamList } from '~/core/types/navigation';
import {
  AppPreferences,
  editablePreferenceKeys as appEditablePreferenceKeys,
  objectPreferenceKeys as appObjectPreferenceKeys,
  initialAppPreferences,
} from '~/core/types/preferences';

import i18n from 'i18next';

import { en, it } from '../assets/translations';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews',
]);

extendSuperJSON();

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: { ...en, mfaScreen: mfaScreenTranslations.en },
    },
    it: {
      translation: { ...it, mfaScreen: mfaScreenTranslations.it },
    },
  },
});

initSentry({
  dsn: '', // TODO: add SENTRY_DSN when available
  enabled: isEnvProduction,
  appName: 'faculty',
  version: APP_VERSION,
  dist: BUILD_NO,
  environment: process.env.NODE_ENV || 'development',
});

Mapbox.setAccessToken(process.env.MAPBOX_TOKEN! || 'no_token');

const appConfig = {
  id: 'faculty',
  keychainService: 'it.polito.faculty-app',
} satisfies PolitoAppConfig;

const createAuthClient = () => new AuthApi();

const App = () => {
  return (
    <Sentry.TouchEventBoundary>
      <SafeAreaProvider>
        <SplashProvider>
          {/* Provide the app-specific preference key lists and types */}
          <PreferencesProvider<AppPreferences>
            extraEditableKeys={appEditablePreferenceKeys}
            extraObjectKeys={appObjectPreferenceKeys}
            initialPreferences={initialAppPreferences}
          >
            <UiProvider<RootParamList>
              linking={createPolitoLinking<any>(appConfig)}
            >
              <FeedbackProvider>
                <ApiProvider<AppPreferences>
                  config={appConfig}
                  createAuthClient={createAuthClient}
                  updateApiConfiguration={updateGlobalApiConfiguration}
                >
                  <CoursesProvider>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                      <RootNavigator />
                    </GestureHandlerRootView>
                  </CoursesProvider>
                </ApiProvider>
              </FeedbackProvider>
            </UiProvider>
          </PreferencesProvider>
        </SplashProvider>
      </SafeAreaProvider>
    </Sentry.TouchEventBoundary>
  );
};

export default App;
