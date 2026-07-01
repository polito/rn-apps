import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { formatDate } from '@polito/lib/core';
import { Col, Text, type Theme, useStylesheet } from '@polito/lib/ui';

interface TicketFeedbackInfoProps {
  rating: number;
  createdAt: Date;
}

export const TicketFeedbackInfo = ({
  rating,
  createdAt,
}: TicketFeedbackInfoProps) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);

  const date = formatDate(createdAt);
  const time = `${createdAt.getHours().toString().padStart(2, '0')}:${createdAt
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <Col gap={3}>
        <Text variant="heading" style={styles.title}>
          {t('ticketScreen.feedbackInfoTitle')}
        </Text>
        <Text variant="prose" style={styles.body}>
          {`${t('ticketScreen.feedbackInfoRatingPrefix')} `}
          <Text variant="heading" style={styles.bold}>
            {t('ticketScreen.feedbackInfoStars', { count: rating })}
          </Text>
          {` ${t('ticketScreen.feedbackInfoOnDate')} `}
          <Text variant="heading" style={styles.bold}>
            {date}
          </Text>
          {` ${t('ticketScreen.feedbackInfoAtTime')} `}
          <Text variant="heading" style={styles.bold}>
            {time}
          </Text>
          .
        </Text>
        <Text variant="prose" style={styles.body}>
          {t('ticketScreen.feedbackInfoThanks')}
        </Text>
      </Col>
    </View>
  );
};

const createStyles = ({ spacing, fontSizes, colors, palettes }: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.divider,
      paddingHorizontal: spacing[5],
      paddingTop: spacing[2],
      paddingBottom: spacing[4],
    },
    title: {
      color: palettes.gray[700],
      fontSize: fontSizes.sm,
      lineHeight: fontSizes.sm * 1.1,
    },
    body: {
      color: palettes.gray[700],
      fontSize: fontSizes.sm,
      lineHeight: fontSizes.sm * 1.1,
    },
    bold: {
      color: palettes.gray[700],
      fontSize: fontSizes.sm,
      lineHeight: fontSizes.sm * 1.1,
    },
  });
