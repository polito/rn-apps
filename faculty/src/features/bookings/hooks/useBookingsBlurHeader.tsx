import { ReactNode, useLayoutEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';

import { Text, Theme, useStylesheet, useTheme } from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';

import { bookingsColors } from '../utils/bookingsTheme';

type Options = {
  title: string;
  headerBackTitle?: string;
  headerBackButtonDisplayMode?: 'default' | 'minimal';
};

export const useBookingsBlurHeader = ({
  title,
  headerBackTitle,
  headerBackButtonDisplayMode = 'default',
}: Options) => {
  const navigation = useNavigation();
  const { dark, colors } = useTheme();
  const styles = useStylesheet(createStyles);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.headerTitle}>{title}</Text>
      ),
      headerBackTitle: headerBackTitle ?? '',
      headerBackButtonDisplayMode,
      headerTransparent: Platform.OS === 'ios',
      headerBlurEffect: dark
        ? 'systemUltraThinMaterialDark'
        : 'systemUltraThinMaterialLight',
      headerShadowVisible: true,
      headerStyle: {
        backgroundColor: Platform.select({
          ios: undefined,
          android: colors.headersBackground,
        }),
      },
    });
  }, [
    navigation,
    title,
    headerBackTitle,
    headerBackButtonDisplayMode,
    dark,
    colors.headersBackground,
    styles.headerTitle,
  ]);
};

export const useBookingsBlurHeaderNode = (
  headerTitle: () => ReactNode,
  options?: Pick<Options, 'headerBackTitle' | 'headerBackButtonDisplayMode'>,
) => {
  const navigation = useNavigation();
  const { dark, colors } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle,
      headerBackTitle: options?.headerBackTitle ?? '',
      headerBackButtonDisplayMode:
        options?.headerBackButtonDisplayMode ?? 'default',
      headerTransparent: Platform.OS === 'ios',
      headerBlurEffect: dark
        ? 'systemUltraThinMaterialDark'
        : 'systemUltraThinMaterialLight',
      headerShadowVisible: true,
      headerStyle: {
        backgroundColor: Platform.select({
          ios: undefined,
          android: colors.headersBackground,
        }),
      },
    });
  }, [
    navigation,
    headerTitle,
    options?.headerBackTitle,
    options?.headerBackButtonDisplayMode,
    dark,
    colors.headersBackground,
  ]);
};

const createStyles = ({
  dark,
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
}: Theme) =>
  StyleSheet.create({
    headerTitle: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      lineHeight: 22,
      letterSpacing: 0,
      color: dark ? colors.title : bookingsColors.nativeLabelOnNavigator,
      textAlign: 'center',
    },
  });
