import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import {
  Col,
  CtaButton,
  Text,
  type Theme,
  useStylesheet,
} from '@polito/lib/ui';

interface TicketAutoresolvedBarProps {
  onPress: () => void;
}

export const TicketAutoresolvedBar = ({
  onPress,
}: TicketAutoresolvedBarProps) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);

  return (
    <View style={styles.container}>
      <Col gap={3}>
        <Text variant="heading" style={styles.title}>
          {t('ticketScreen.autoResolvedBarTitle')}
        </Text>
        <Text variant="prose" style={styles.subtitle}>
          {t('ticketScreen.autoResolvedBarSubtitle')}
        </Text>
      </Col>
      <CtaButton
        absolute={false}
        variant="outlined"
        icon={faCheck}
        title={t('ticketResolvedScreen.sendFeedback')}
        action={onPress}
        containerStyle={styles.buttonContainer}
      />
    </View>
  );
};

const createStyles = ({ spacing, fontSizes, colors, palettes }: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      paddingHorizontal: spacing[5],
      paddingTop: spacing[2],
      paddingBottom: spacing[4],
      gap: spacing[3],
    },
    title: {
      color: palettes.primary[700],
      fontSize: fontSizes.sm,
      lineHeight: fontSizes.sm * 1.25,
    },
    subtitle: {
      color: palettes.gray[600],
      fontSize: fontSizes.xs,
      lineHeight: fontSizes.xs * 1.5,
    },
    buttonContainer: {
      paddingVertical: 0,
      paddingHorizontal: 0,
    },
  });
