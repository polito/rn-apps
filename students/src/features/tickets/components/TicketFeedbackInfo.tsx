import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { formatDate } from '@polito/lib/core';
import { Text, type Theme, useStylesheet } from '@polito/lib/ui';

interface TicketFeedbackInfoProps {
  rating: number;
  comment?: string;
  createdAt: Date;
}

export const TicketFeedbackInfo = ({
  rating,
  comment,
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
      <Text style={styles.title}>{t('ticketScreen.feedbackInfoTitle')}</Text>
      <Text style={styles.body}>
        {`${t('ticketScreen.feedbackInfoRatingPrefix')} `}
        <Text style={styles.bold}>
          {t('ticketScreen.feedbackInfoStars', { count: rating })}
        </Text>
        {` ${t('ticketScreen.feedbackInfoOnDate')} `}
        <Text style={styles.bold}>{date}</Text>
        {` ${t('ticketScreen.feedbackInfoAtTime')} `}
        <Text style={styles.bold}>{time}</Text>.
      </Text>
      {!!comment && <Text style={styles.body}>{`“${comment}”`}</Text>}
      <Text style={styles.body}>{t('ticketScreen.feedbackInfoThanks')}</Text>
    </View>
  );
};

const createStyles = ({
  spacing,
  fontSizes,
  fontWeights,
  colors,
  palettes,
}: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      paddingBottom: spacing[4],
      gap: spacing[1],
    },
    title: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      color: colors.heading,
    },
    body: {
      fontSize: fontSizes.sm,
      color: palettes.gray[700],
    },
    bold: {
      fontWeight: fontWeights.semibold,
    },
  });
