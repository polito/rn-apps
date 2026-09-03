import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';

import { faBullhorn } from '@fortawesome/free-solid-svg-icons';
import { IS_IOS, dateFormatter, useScreenReader } from '@polito/lib/core';
import { Icon, Text, Theme, useStylesheet, useTheme } from '@polito/lib/ui';
import { Announcement } from '@polito/student-api-client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAccessibility } from '../../../core/hooks/useAccessibilty';

interface Props {
  announcements: Announcement[];
}

interface CardProps {
  announcement: Announcement;
  index: number;
  total: number;
}

const formatAnnouncementDate = dateFormatter('d MMMM yyyy');

const Card = ({ announcement, index, total }: CardProps) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createCardStyles);
  const { fontSizes } = useTheme();
  const { accessibilityListLabel } = useAccessibility();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<{ NewOverlay: { id: string } }>
    >();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={[
        formatAnnouncementDate(announcement.date),
        announcement.title,
        accessibilityListLabel(index, total),
      ]
        .filter(Boolean)
        .join(', ')}
      accessibilityHint={t('appInfoScreen.openNewsHint')}
      onPress={() =>
        navigation.navigate('NewOverlay', { id: announcement.id })
      }
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.text}>
        <Text variant="secondaryText" style={styles.date}>
          {formatAnnouncementDate(announcement.date)}
        </Text>
        <Text variant="title" style={styles.title} numberOfLines={2}>
          {announcement.title}
        </Text>
      </View>
      <View
        style={styles.icon}
        accessible={false}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden={IS_IOS}
      >
        <Icon
          icon={faBullhorn}
          size={fontSizes['2xl']}
          color={styles.icon.color}
        />
      </View>
    </Pressable>
  );
};

export const WhatsNewCard = ({ announcements }: Props) => {
  const { t } = useTranslation();
  const { isEnabled, announce } = useScreenReader();
  const { width: pageWidth } = useWindowDimensions();
  const { spacing, colors } = useTheme();
  const styles = useStylesheet(createStyles);
  const [index, setIndex] = useState(0);

  const onScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextIndex = Math.round(
        event.nativeEvent.contentOffset.x / pageWidth,
      );
      const clamped = Math.max(
        0,
        Math.min(nextIndex, announcements.length - 1),
      );
      setIndex(clamped);
      if (isEnabled) {
        announce(
          t('common.elementCount', {
            count: clamped + 1,
            total: announcements.length,
          }),
        );
      }
    },
    [announce, announcements.length, isEnabled, pageWidth, t],
  );

  return (
    <View
      style={styles.container}
      accessibilityRole="list"
      accessibilityLabel={t('appInfoScreen.whatsNewListLabel', {
        count: announcements.length,
      })}
    >
      <ScrollView
        horizontal
        pagingEnabled
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
      >
        {announcements.map((announcement, cardIndex) => (
          <View
            key={announcement.id}
            style={{
              width: pageWidth,
              paddingHorizontal: spacing[4],
            }}
          >
            <Card
              announcement={announcement}
              index={cardIndex}
              total={announcements.length}
            />
          </View>
        ))}
      </ScrollView>
      {announcements.length > 1 && (
        <View
          style={styles.dots}
          accessible={false}
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden={IS_IOS}
        >
          <AnimatedDotsCarousel
            length={announcements.length}
            currentIndex={index}
            maxIndicators={announcements.length}
            activeIndicatorConfig={{
              color: colors.link,
              margin: 5,
              opacity: 1,
              size: 10,
            }}
            inactiveIndicatorConfig={{
              color: colors.heading,
              margin: 5,
              opacity: 0.5,
              size: 10,
            }}
            decreasingDots={[
              {
                config: {
                  color: colors.heading,
                  margin: 5,
                  opacity: 0.5,
                  size: 8,
                },
                quantity: 1,
              },
              {
                config: {
                  color: colors.heading,
                  margin: 5,
                  opacity: 0.5,
                  size: 6,
                },
                quantity: 1,
              },
            ]}
          />
        </View>
      )}
    </View>
  );
};

const createCardStyles = ({
  colors,
  palettes,
  shapes,
  spacing,
  fontSizes,
  fontWeights,
}: Theme) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: palettes.navy[400],
      borderRadius: shapes.lg,
      borderWidth: 1,
      gap: spacing[3],
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[4],
    },
    pressed: {
      opacity: 0.7,
    },
    text: {
      flex: 1,
      gap: spacing[1],
    },
    date: {
      color: colors.secondaryText,
      fontFamily: 'Montserrat-Regular',
      fontSize: fontSizes.xs,
      fontStyle: 'normal',
      fontWeight: fontWeights.normal,
      lineHeight: fontSizes.lg,
    },
    title: {
      color: colors.title,
      fontFamily: 'Montserrat-SemiBold',
      fontSize: fontSizes.md,
      fontStyle: 'normal',
      fontWeight: fontWeights.semibold,
      lineHeight: fontSizes.xl,
    },
    icon: {
      alignItems: 'center',
      color: colors.heading,
      justifyContent: 'center',
    },
  });

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    container: {
      marginTop: spacing[3],
    },
    dots: {
      alignItems: 'center',
      marginTop: spacing[6],
    },
  });
