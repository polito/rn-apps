import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Col, Text, type Theme, useStylesheet } from '@polito/lib/ui';

export const TicketWaitingOperatorBar = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);

  return (
    <View style={styles.container}>
      <Col gap={3}>
        <Text variant="heading" style={styles.title}>
          {t('ticketScreen.waitingOperatorBarTitle')}
        </Text>
        <Text variant="prose" style={styles.subtitle}>
          {t('ticketScreen.waitingOperatorBarSubtitle')}
        </Text>
      </Col>
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
  });
