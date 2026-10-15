import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Col,
  HeaderLogo,
  Row,
  TranslucentView,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import type { Theme } from '@polito/lib/ui';

import { useTeachingScroll } from './TeachingNavigator';

export const TeachingAppBar = () => {
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const { dark } = useTheme();
  const styles = useStylesheet(createStyles);
  const { isScrolled } = useTeachingScroll();

  const showGlass = !dark || isScrolled;

  return (
    <View>
      {showGlass && <TranslucentView blurAmount={10} />}
      <View style={[styles.overlay, !showGlass && styles.overlayOpaque]} />
      <View style={{ height: top }} />
      <Row align="center" justify="space-between" ph={5} style={styles.navRow}>
        <HeaderLogo />
      </Row>
      <Col ph={5} pb={2}>
        <Text style={styles.title} accessibilityRole="header">
          {t('teachingScreen.title')}
        </Text>
      </Col>
      <View style={[styles.separator, !isScrolled && { opacity: 0 }]} />
    </View>
  );
};

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
      height: 42,
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
      backgroundColor: colors.translucentSurface,
    },
  });
