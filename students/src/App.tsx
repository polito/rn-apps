import { initReactI18next } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FeedbackProvider } from '@lib/core/providers/FeedbackProvider';
import { PreferencesProvider } from '@lib/core/providers/PreferencesProvider';
import { SplashProvider } from '@lib/core/providers/SplashProvider';
import { Sentry } from '@lib/core/utils/sentry';
import { extendSuperJSON } from '@lib/core/utils/superjson';
import { UiProvider } from '@lib/ui/providers/UiProvider';
import Mapbox from '@rnmapbox/maps';

import i18n from 'i18next';

import { en, it } from '../assets/translations';
import { AppContent } from './core/components/AppContent';
import { ApiProvider } from './core/providers/ApiProvider';
import { DownloadsProvider } from './core/providers/DownloadsProvider';
import { RootParamList } from './core/types/navigation';
import {
  AppPreferences,
  editablePreferenceKeys as appEditablePreferenceKeys,
  objectPreferenceKeys as appObjectPreferenceKeys,
  initialAppPreferences,
} from './core/types/preferences';
import { setDeepLink } from './utils/linking';

extendSuperJSON();

Mapbox.setAccessToken(process.env.MAPBOX_TOKEN!);

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
                <DownloadsProvider>
                  <AppContent />
                </DownloadsProvider>
              </ApiProvider>
            </FeedbackProvider>
          </UiProvider>
        </PreferencesProvider>
      </SplashProvider>
    </SafeAreaProvider>
  );
};

export default Sentry.withTouchEventBoundary(App);
