import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import {
  Col,
  CtaButton,
  Icon,
  Row,
  Text,
  type Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { PodiumIcon } from './PodiumIcon';

const ANDROID_TAB_BAR_HEIGHT = 60;
const IOS_TAB_BAR_HEIGHT = 49;

interface TicketAutoResolvedProps {
  onClose: () => void;
}

const PODIUM_ICON_SIZE = 64;

export const TicketAutoResolved = ({ onClose }: TicketAutoResolvedProps) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { palettes, spacing } = useTheme();
  const measuredTabBarHeight = useBottomTabBarHeight();
  const { bottom: safeBottom } = useSafeAreaInsets();
  const tabBarHeight =
    measuredTabBarHeight ||
    Platform.select({
      android: ANDROID_TAB_BAR_HEIGHT + safeBottom,
      default: IOS_TAB_BAR_HEIGHT + safeBottom,
    });

  return (
    <View style={styles.screen}>
      <Col flex={1} align="center" justify="center" gap={6}>
        <PodiumIcon size={PODIUM_ICON_SIZE} color={palettes.success[700]} />
        <Col gap={3} align="center">
          <Text style={styles.title}>{t('ticketResolvedScreen.title')}</Text>
          <Text style={styles.subtitle}>
            {t('ticketScreen.autoResolvedSubtitle')}
          </Text>
        </Col>
      </Col>
      <Col gap={2} style={{ paddingBottom: tabBarHeight + spacing[2] }}>
        <Row gap={4} style={styles.infoMessage}>
          <Icon
            icon={faTriangleExclamation}
            size={16}
            color={palettes.warning[800]}
          />
          <Text style={styles.infoText}>
            {t('ticketScreen.autoResolvedHint')}
          </Text>
        </Row>
        <CtaButton
          absolute={false}
          title={t('common.close')}
          action={onClose}
          containerStyle={styles.buttonContainer}
        />
      </Col>
    </View>
  );
};

const createStyles = ({
  spacing,
  fontSizes,
  fontWeights,
  colors,
  palettes,
  shapes,
}: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: spacing[5],
    },
    title: {
      fontSize: fontSizes['2xl'],
      fontWeight: fontWeights.semibold,
      color: colors.heading,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: colors.prose,
      textAlign: 'center',
    },
    infoMessage: {
      alignItems: 'flex-start',
      backgroundColor: palettes.warning[50],
      borderWidth: 1,
      borderColor: palettes.warning[600],
      borderRadius: shapes.lg,
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[3],
    },
    infoText: {
      flex: 1,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.medium,
      color: palettes.warning[800],
      lineHeight: 16,
    },
    buttonContainer: {
      paddingVertical: 0,
      paddingHorizontal: 0,
    },
  });
