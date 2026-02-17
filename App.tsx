import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  LogBox,
  Platform,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Mapbox from '@rnmapbox/maps';
import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { FeedbackProvider } from './src/core/components/FeedbackProvider';
// <-- import React Query
import { NavBar } from './src/core/components/NavBar';
import { CoursesProvider } from './src/core/contexts/CoursesContext';
import { PreferencesProvider } from './src/core/providers/PreferencesProvider';
import { SplashProvider } from './src/core/providers/SplashProvider';
import { UiProvider } from './src/core/providers/UiProvider';
import { darkTheme } from './src/core/themes/dark';
import { lightTheme } from './src/core/themes/light';
import { ThemeContext } from './src/ui/contexts/ThemeContext';
import { initSentry } from './src/utils/sentry';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews',
]);

// Crea l'istanza di QueryClient
const queryClient = new QueryClient();
initSentry();

Mapbox.setAccessToken(process.env.MAPBOX_TOKEN! || 'no_token');

export const App = () => {
  const colorScheme = useColorScheme();
  const uiTheme = colorScheme === 'light' ? lightTheme : darkTheme;

  return (
    // Avvolgi tutto dentro QueryClientProvider e passa il client

    <Sentry.TouchEventBoundary>
      <SafeAreaProvider>
        <SplashProvider>
          <PreferencesProvider>
            <UiProvider>
              <QueryClientProvider client={queryClient}>
                <CoursesProvider>
                  <ThemeContext.Provider value={uiTheme}>
                    <FeedbackProvider>
                      <GestureHandlerRootView style={{ flex: 1 }}>
                        <NavBar />
                      </GestureHandlerRootView>
                    </FeedbackProvider>
                  </ThemeContext.Provider>
                </CoursesProvider>
              </QueryClientProvider>
            </UiProvider>
          </PreferencesProvider>
        </SplashProvider>
      </SafeAreaProvider>
    </Sentry.TouchEventBoundary>
  );
};

const _styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

export default App;
