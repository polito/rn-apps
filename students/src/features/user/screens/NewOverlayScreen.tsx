import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AccessibilityInfo,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  findNodeHandle,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  IS_ANDROID,
  getHtmlTextContent,
  useScreenReader,
} from '@polito/lib/core';
import {
  ActivityIndicator,
  CtaButton,
  HtmlView,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Image } from 'expo-image';

import {
  useGetAnnouncements,
  useMarkAnnouncementAsRead,
} from '../../../core/queries/announcementHooks';
import { UserStackParamList } from '../components/UserNavigator';
import { formatWhatsNewDate } from '../components/WhatsNewListItem';

type Props = NativeStackScreenProps<UserStackParamList, 'NewOverlay'>;

export const NewOverlayScreen = ({ route, navigation }: Props) => {
  const { id } = route.params;
  const { t, i18n } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { spacing, shapes } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const announcementsQuery = useGetAnnouncements();
  const { isEnabled, announce } = useScreenReader();
  const { mutate: markAsRead } = useMarkAnnouncementAsRead();
  const announcement = announcementsQuery.data?.find(item => item.id === id);
  const [coverAspectRatio, setCoverAspectRatio] = useState<number>();
  const titleRef = useRef<View>(null);

  useEffect(() => {
    if (announcement && !announcement.seen) {
      markAsRead(announcement.id);
    }
  }, [announcement, markAsRead]);

  useEffect(() => {
    if (!announcement && isEnabled) {
      announce(t('common.loading'));
    }
  }, [announcement, announce, isEnabled, t]);

  useLayoutEffect(() => {
    if (!announcement) return;
    const timer = setTimeout(() => {
      const node = findNodeHandle(titleRef.current);
      if (node) AccessibilityInfo.setAccessibilityFocus(node);
    }, 100);
    return () => clearTimeout(timer);
  }, [announcement]);

  const htmlViewProps = useMemo(
    () => ({
      source: { html: announcement?.contents ?? '' },
      baseStyle: {
        paddingHorizontal: spacing[5],
        paddingVertical: 0,
        paddingBottom: 0,
        color: styles.body.color,
        fontFamily: styles.body.fontFamily,
        fontSize: styles.body.fontSize,
        fontWeight: styles.body.fontWeight,
        lineHeight: styles.body.lineHeight,
      },
    }),
    [announcement?.contents, spacing, styles.body],
  );

  const coverWidth = screenWidth - spacing[5] * 2;
  const htmlText = getHtmlTextContent(announcement?.contents ?? '');

  if (!announcement) {
    return (
      <SafeAreaView
        style={styles.screen}
        accessibilityState={{ busy: true }}
        accessibilityLabel={t('common.loading')}
      >
        <ActivityIndicator accessibilityLabel={t('common.loading')} />
      </SafeAreaView>
    );
  }

  const dateLabel = formatWhatsNewDate(announcement.date, i18n.language, t);

  return (
    <View style={styles.screen} accessibilityViewIsModal={IS_ANDROID}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
      >
        {!!announcement.cover && (
          <View
            style={styles.coverWrap}
            accessible={false}
            importantForAccessibility="no-hide-descendants"
          >
            <Image
              source={{ uri: announcement.cover }}
              style={{
                borderRadius: shapes.lg,
                width: coverWidth,
                aspectRatio: coverAspectRatio ?? 16 / 9,
              }}
              contentFit="cover"
              accessible={false}
              onLoad={e => {
                const { width: w, height: h } = e.source;
                if (w > 0 && h > 0) setCoverAspectRatio(w / h);
              }}
            />
          </View>
        )}
        <View
          ref={titleRef}
          accessible
          accessibilityRole="header"
          accessibilityLabel={announcement.title}
        >
          <Text variant="title" accessible={false} style={styles.title}>
            {announcement.title}
          </Text>
        </View>
        <Text variant="secondaryText" style={styles.date}>
          {dateLabel}
        </Text>
        <View
          accessible
          accessibilityLabel={htmlText}
          importantForAccessibility="no-hide-descendants"
        >
          <HtmlView variant="onboarding" props={htmlViewProps} />
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: bottom }]}>
        <CtaButton
          absolute={false}
          title={t('appInfoScreen.gotIt')}
          action={() => navigation.goBack()}
          containerStyle={styles.ctaContainer}
          style={styles.ctaButton}
          textStyle={styles.ctaButtonText}
          accessibilityHint={t('appInfoScreen.gotItHint')}
        />
      </View>
    </View>
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
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
    scroll: {
      flex: 1,
    },
    content: {
      gap: spacing[1],
      paddingTop: spacing[4],
      paddingBottom: spacing[4],
    },
    coverWrap: {
      alignItems: 'center',
      alignSelf: 'stretch',
      marginBottom: spacing[3],
      paddingHorizontal: spacing[5],
    },
    footer: {
      backgroundColor: colors.background,
    },
    ctaContainer: {
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[4],
    },
    ctaButton: {
      alignItems: 'center',
      alignSelf: 'stretch',
      backgroundColor: colors.link,
      borderColor: colors.link,
      borderRadius: shapes.lg,
      elevation: 0,
      gap: spacing[2],
      height: 45,
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    ctaButtonText: {
      color: colors.white,
      fontFamily: 'Montserrat-SemiBold',
      fontSize: fontSizes.sm,
      fontStyle: 'normal',
      fontWeight: fontWeights.semibold,
      lineHeight: fontSizes.xl,
      textAlign: 'center',
    },
    title: {
      color: colors.title,
      fontFamily: 'Montserrat-SemiBold',
      fontSize: fontSizes.sm,
      fontStyle: 'normal',
      fontWeight: fontWeights.semibold,
      lineHeight: fontSizes.xl,
      paddingHorizontal: spacing[5],
    },
    date: {
      color: colors.secondaryText,
      fontFamily: 'Montserrat-Regular',
      fontSize: fontSizes.sm,
      fontStyle: 'normal',
      fontWeight: fontWeights.normal,
      lineHeight: fontSizes.xl,
      paddingHorizontal: spacing[5],
    },
    body: {
      color: colors.prose,
      fontFamily: 'Montserrat-Regular',
      fontSize: fontSizes.sm,
      fontStyle: 'normal',
      fontWeight: fontWeights.normal,
      lineHeight: fontSizes.xl,
    },
  });
