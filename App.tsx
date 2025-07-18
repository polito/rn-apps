import React, { useMemo } from 'react';
import { LogBox, Platform, SafeAreaView, StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';  // <-- import React Query
import { NavBar } from './src/core/components/NavBar';
import { darkTheme } from './src/core/themes/dark';
import { lightTheme } from './src/core/themes/light';
import { fromUiTheme } from './src/utils/navigation-theme';
import { ThemeContext } from './src/ui/contexts/ThemeContext';
import { CoursesProvider } from './src/core/contexts/CoursesContext';
import { FeedbackProvider } from './src/core/components/FeedbackProvider';
import { PreferencesProvider } from './src/core/providers/PreferencesProvider';
import Mapbox from '@rnmapbox/maps';
import { UiProvider } from './src/core/providers/UiProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Sentry from '@sentry/react-native';
import { SplashProvider } from './src/core/providers/SplashProvider';
import { initSentry } from './src/utils/sentry';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews',
]);

// Crea l'istanza di QueryClient
const queryClient = new QueryClient();
initSentry();


Mapbox.setAccessToken(process.env.MAPBOX_TOKEN!);

export const App = () => {
  const colorScheme = useColorScheme();
  const uiTheme = colorScheme === 'light' ? lightTheme : darkTheme;
  const navigationTheme = useMemo(() => fromUiTheme(uiTheme), [uiTheme]);

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
              <GestureHandlerRootView style={{flex: 1}}>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

export default App;
