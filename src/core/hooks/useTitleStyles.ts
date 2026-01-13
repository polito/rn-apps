import { Platform } from 'react-native';

import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { Theme } from '../../ui/types/Theme';

export const useTitlesStyles: (
  theme: Theme,
) => Partial<NativeStackNavigationOptions> = ({
  dark,
  spacing,
  colors,
  fontFamilies,
  fontWeights,
}) => ({
  headerTitleAlign: 'center',
  headerTitleStyle: {
    fontFamily: fontFamilies.heading,
    fontSize: Platform.select({ android: 20, ios: 17 }),
    fontWeight: fontWeights.semibold,
    color: colors.title,
    width: '110px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing[2.5],
  },
  headerLargeTitleStyle: {
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.bold as string,
    color: colors.title,
  },
  headerBackTitleStyle: {
    fontFamily: fontFamilies.heading,
  },
  headerBlurEffect: dark
    ? 'systemUltraThinMaterialDark'
    : 'systemUltraThinMaterialLight',
});
