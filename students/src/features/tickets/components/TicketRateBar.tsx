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

interface TicketRateBarProps {
  onPress: () => void;
}

export const TicketRateBar = ({ onPress }: TicketRateBarProps) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);

  return (
    <View style={styles.container}>
      <Col gap={1}>
        <Text style={styles.title}>{t('ticketScreen.rateBarTitle')}</Text>
        <Text style={styles.subtitle}>{t('ticketScreen.rateBarSubtitle')}</Text>
      </Col>
      <CtaButton
        absolute={false}
        variant="outlined"
        icon={faCheck}
        title={t('ticketScreen.rateBarCta')}
        action={onPress}
        containerStyle={styles.buttonContainer}
      />
    </View>
  );
};

const createStyles = ({ spacing, fontSizes, fontWeights, colors }: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      paddingBottom: spacing[4],
      gap: spacing[3],
    },
    title: {
      color: colors.heading,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
    },
    subtitle: {
      color: colors.secondaryText,
      fontSize: fontSizes.xs,
    },
    buttonContainer: {
      paddingVertical: 0,
    },
  });
