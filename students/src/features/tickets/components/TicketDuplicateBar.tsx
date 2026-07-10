import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import {
  Col,
  CtaButton,
  Text,
  type Theme,
  useStylesheet,
} from '@polito/lib/ui';

interface TicketDuplicateBarProps {
  onPress: () => void;
}

export const TicketDuplicateBar = ({ onPress }: TicketDuplicateBarProps) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);

  return (
    <View style={styles.container}>
      <Col gap={3}>
        <Text variant="heading" style={styles.title}>
          {t('ticketScreen.duplicateBarTitle')}
        </Text>
        <Text variant="prose" style={styles.subtitle}>
          {t('ticketScreen.duplicateBarSubtitle')}
        </Text>
      </Col>
      <CtaButton
        absolute={false}
        variant="outlined"
        title={t('ticketScreen.duplicateBarCta')}
        action={onPress}
        containerStyle={styles.buttonContainer}
      />
    </View>
  );
};

const createStyles = ({ spacing, fontSizes, colors }: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      paddingHorizontal: spacing[5],
      paddingTop: spacing[2],
      paddingBottom: spacing[4],
      gap: spacing[3],
    },
    title: {
      color: colors.title,
      fontSize: fontSizes.sm,
      lineHeight: fontSizes.sm * 1.25,
    },
    subtitle: {
      color: colors.secondaryText,
      fontSize: fontSizes.xs,
      lineHeight: fontSizes.xs * 1.5,
    },
    buttonContainer: {
      paddingVertical: 0,
      paddingHorizontal: 0,
    },
  });
