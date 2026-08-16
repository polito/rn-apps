import { ReactNode, useLayoutEffect } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Icon, Text, Theme, useStylesheet, useTheme } from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';

import { bookingsColors } from '../utils/bookingsTheme';

type Options = {
  title: string;
  headerBackTitle?: string;
  headerBackButtonDisplayMode?: 'default' | 'minimal';
};

const AndroidBackButton = ({
  label,
  displayMode,
}: {
  label?: string;
  displayMode: 'default' | 'minimal';
}) => {
  const navigation = useNavigation();
  const styles = useStylesheet(createStyles);
  const showLabel = displayMode === 'default' && !!label;

  return (
    <Pressable
      onPress={() => navigation.goBack()}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.backButton}
    >
      <Icon icon={faChevronLeft} size={20} color={bookingsColors.linkBlue} />
      {showLabel ? <Text style={styles.backTitle}>{label}</Text> : null}
    </Pressable>
  );
};

export { AndroidBackButton };

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
      headerTitle: () => <Text style={styles.headerTitle}>{title}</Text>,
      headerTitleAlign: 'center',
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
          android: dark ? colors.background : colors.headersBackground,
        }),
      },
      ...(Platform.OS === 'android'
        ? {
            headerLeft: () => (
              <AndroidBackButton
                label={headerBackTitle}
                displayMode={headerBackButtonDisplayMode}
              />
            ),
          }
        : {}),
    });
  }, [
    navigation,
    title,
    headerBackTitle,
    headerBackButtonDisplayMode,
    dark,
    colors.background,
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
  const headerBackTitle = options?.headerBackTitle ?? '';
  const headerBackButtonDisplayMode =
    options?.headerBackButtonDisplayMode ?? 'default';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle,
      headerTitleAlign: 'center',
      headerBackTitle,
      headerBackButtonDisplayMode,
      headerTransparent: Platform.OS === 'ios',
      headerBlurEffect: dark
        ? 'systemUltraThinMaterialDark'
        : 'systemUltraThinMaterialLight',
      headerShadowVisible: true,
      headerStyle: {
        backgroundColor: Platform.select({
          ios: undefined,
          android: dark ? colors.background : colors.headersBackground,
        }),
      },
      ...(Platform.OS === 'android'
        ? {
            headerLeft: () => (
              <AndroidBackButton
                label={headerBackTitle}
                displayMode={headerBackButtonDisplayMode}
              />
            ),
          }
        : {}),
    });
  }, [
    navigation,
    headerTitle,
    headerBackTitle,
    headerBackButtonDisplayMode,
    dark,
    colors.background,
    colors.headersBackground,
  ]);
};

const createStyles = ({
  dark,
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
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
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: -spacing[2],
      gap: spacing[1],
    },
    backTitle: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.normal,
      lineHeight: 22,
      color: bookingsColors.linkBlue,
    },
  });
