import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { APP_TIMEZONE, getHtmlTextContent } from '@polito/lib/core';
import { Text, Theme, useStylesheet } from '@polito/lib/ui';
import { Announcement } from '@polito/student-api-client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Image } from 'expo-image';
import { TFunction } from 'i18next';
import { DateTime } from 'luxon';

import { useAccessibility } from '../../../core/hooks/useAccessibilty';

interface Props {
  announcement: Announcement;
  index: number;
  totalData: number;
}

export const formatWhatsNewDate = (
  date: Date,
  language: string,
  t: TFunction,
) => {
  const day = DateTime.fromJSDate(date, { zone: APP_TIMEZONE }).startOf('day');
  const today = DateTime.now().setZone(APP_TIMEZONE).startOf('day');
  const days = Math.round(today.diff(day, 'days').days);

  if (days === 0) return t('common.today');
  if (days === 1) return t('common.yesterday');
  if (days > 1 && days < 7) return t('appInfoScreen.daysAgo', { count: days });

  return DateTime.fromJSDate(date, { zone: APP_TIMEZONE })
    .setLocale(language)
    .toFormat('d MMMM yyyy');
};

export const WhatsNewListItem = ({ announcement, index, totalData }: Props) => {
  const { t, i18n } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { accessibilityListLabel } = useAccessibility();
  const navigation =
    useNavigation<NativeStackNavigationProp<{ NewOverlay: { id: string } }>>();

  const dateLabel = formatWhatsNewDate(announcement.date, i18n.language, t);
  const body =
    announcement.description?.trim() ||
    getHtmlTextContent(announcement.contents ?? '');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={[
        announcement.title,
        dateLabel,
        body,
        accessibilityListLabel(index, totalData),
      ]
        .filter(Boolean)
        .join(', ')}
      accessibilityHint={t('appInfoScreen.openNewsHint')}
      onPress={() => navigation.navigate('NewOverlay', { id: announcement.id })}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
    >
      <Text variant="title" style={styles.title}>
        {announcement.title}
      </Text>
      <Text variant="secondaryText" style={styles.date}>
        {dateLabel}
      </Text>
      {!!body && (
        <Text variant="prose" style={styles.body}>
          {body}
        </Text>
      )}
      {!!announcement.cover && (
        <View
          style={styles.coverWrap}
          accessible={false}
          importantForAccessibility="no-hide-descendants"
        >
          <Image
            source={{ uri: announcement.cover }}
            style={styles.cover}
            contentFit="cover"
            accessible={false}
          />
        </View>
      )}
    </Pressable>
  );
};

const createStyles = ({
  colors,
  shapes,
  spacing,
  fontSizes,
  fontWeights,
}: Theme) =>
  StyleSheet.create({
    item: {
      gap: spacing[1],
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[4],
    },
    pressed: {
      opacity: 0.7,
    },
    title: {
      color: colors.title,
      fontFamily: 'Montserrat-SemiBold',
      fontSize: fontSizes.sm,
      fontStyle: 'normal',
      fontWeight: fontWeights.semibold,
      lineHeight: fontSizes.xl,
    },
    date: {
      color: colors.secondaryText,
      fontFamily: 'Montserrat-Regular',
      fontSize: fontSizes.sm,
      fontStyle: 'normal',
      fontWeight: fontWeights.normal,
      lineHeight: fontSizes.xl,
    },
    body: {
      color: colors.prose,
      fontFamily: 'Montserrat-Regular',
      fontSize: fontSizes.sm,
      fontStyle: 'normal',
      fontWeight: fontWeights.normal,
      lineHeight: fontSizes.xl,
    },
    coverWrap: {
      marginTop: spacing[2],
    },
    cover: {
      borderRadius: shapes.lg,
      width: '100%',
      aspectRatio: 16 / 9,
    },
  });
