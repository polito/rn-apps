import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { faBell } from '@fortawesome/free-solid-svg-icons';
import {
  HeaderLogo,
  IconButton,
  TranslucentView,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import type { Theme } from '@polito/lib/ui';

import { useTeachingScroll } from './TeachingNavigator';

export const TeachingAppBar = () => {
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const { palettes, spacing, dark, colors } = useTheme();
  const styles = useStylesheet(createStyles);
  const { isScrolled } = useTeachingScroll();

  const showGlass = !dark || isScrolled;

  return (
    <View>
      {showGlass && <TranslucentView blurAmount={10} />}
      <View style={[styles.overlay, !showGlass && styles.overlayOpaque]} />
      <View style={{ height: top }} />
      <View style={styles.navRow}>
        <HeaderLogo />
        <IconButton
          icon={faBell}
          color={dark ? colors.title : palettes.primary[700]}
          size={20}
          accessibilityLabel={t('common.notifications')}
          style={{ marginRight: -spacing[2] }}
          onPress={() => {}}
        />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t('teachingScreen.title')}</Text>
      </View>
      <View style={[styles.separator, !isScrolled && { opacity: 0 }]} />
    </View>
  );
};

const SHADOW_COLOR = 'rgba(0, 0, 0, 0.10)';

const createStyles = ({ colors, fontFamilies, fontWeights }: Theme) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.background,
      opacity: 0.31,
    },
    overlayOpaque: {
      opacity: 1,
    },
    navRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 18,
      height: 42,
    },
    titleContainer: {
      paddingHorizontal: 18,
      paddingBottom: 8,
    },
    title: {
      fontFamily: fontFamilies.heading,
      fontSize: 35,
      fontWeight: fontWeights.semibold,
      color: colors.title,
      lineHeight: 35 * 1.25,
    },
    separator: {
      height: 0.5,
      backgroundColor: SHADOW_COLOR,
    },
  });
