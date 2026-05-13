import { Platform } from 'react-native';

import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { Theme } from '../types/Theme';

export const useTitlesStyles: (
  theme: Theme,
) => Partial<NativeStackNavigationOptions> = ({
  dark,
  colors,
  fontFamilies,
  fontWeights,
}) => ({
  headerTitleStyle: {
    fontFamily: fontFamilies.heading,
    fontSize: Platform.select({ android: 20, ios: 17 }),
    fontWeight: fontWeights.semibold,
    color: colors.title,
  },
  headerLargeTitleStyle: {
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.semibold as string,
    color: colors.title,
  },
  headerBlurEffect: dark
    ? 'systemUltraThinMaterialDark'
    : 'systemUltraThinMaterialLight',
});
