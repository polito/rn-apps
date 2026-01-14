import { PropsWithChildren, useEffect, useMemo } from 'react';
import { Linking, useColorScheme } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import overrideColorScheme from 'react-native-override-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NavigationContainer } from '@lib/core/components/NavigationContainer';
import { usePreferencesContext } from '@lib/core/contexts/PreferencesContext';
import { useSplashContext } from '@lib/core/contexts/SplashContext';
import { fromUiTheme } from '@lib/core/utils/navigation-theme';
import { ThemeContext } from '@lib/ui/contexts/ThemeContext';
import { darkTheme } from '@lib/ui/themes/dark';
import { lightTheme } from '@lib/ui/themes/light';
import { LinkingOptions, ParamListBase } from '@react-navigation/native';

import i18n from 'i18next';
import { Settings } from 'luxon';

type UiProviderProps<T extends ParamListBase = ParamListBase> =
  PropsWithChildren<{
    linking: LinkingOptions<T>;
  }>;
export const UiProvider = <T extends ParamListBase = ParamListBase>({
  linking,
  children,
}: UiProviderProps<T>) => {
  const { colorScheme, language } = usePreferencesContext<{}>();
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useColorScheme();
  const { isAppLoaded } = useSplashContext();
  useEffect(() => {
    if (colorScheme === 'dark' || colorScheme === 'light') {
      overrideColorScheme.setScheme(colorScheme);
    } else {
      overrideColorScheme.setScheme();
    }
  }, [colorScheme]);

  const uiTheme = useMemo(() => {
    const effectiveTheme = colorScheme === 'system' ? theme : colorScheme;

    return {
      ...(effectiveTheme === 'light' ? lightTheme : darkTheme),
      safeAreaInsets,
    };
  }, [colorScheme, theme, safeAreaInsets]);

  const navigationTheme = useMemo(() => fromUiTheme(uiTheme), [uiTheme]);

  useEffect(() => {
    i18n.changeLanguage(language);
    Settings.defaultLocale = language;
  }, [language]);

  useEffect(() => {
    // Ottieni l'URL iniziale e naviga a `PlacesTab` con i parametri
    const GoToUrlOnMap = () => {
      Linking.getInitialURL().then(url => {
        if (url) {
          if (isAppLoaded) {
            Linking.openURL(url);
          }
        }
      });
    };
    GoToUrlOnMap();
  }, [isAppLoaded]);
  return (
    <ThemeContext.Provider value={uiTheme}>
      <SystemBars style="auto" />
      <NavigationContainer<T> linking={linking} theme={navigationTheme}>
        {children}
      </NavigationContainer>
    </ThemeContext.Provider>
  );
};
