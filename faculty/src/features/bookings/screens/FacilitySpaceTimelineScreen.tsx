import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  CtaButton,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DateTime } from 'luxon';

import { ProfileStackParamList } from '../../../screens/Servizi/ServiceNavigator';
import {
  DATE_SELECTOR_WEEKDAY_COUNT,
  DateSelector,
} from '../components/DateSelector';
import { useBookings } from '../hooks/useBookings';
import { AndroidBackButton } from '../hooks/useBookingsBlurHeader';
import {
  useGetInterdepartmentalSpace,
  useGetInterdepartmentalSpaceTypes,
} from '../hooks/useInterdepartmentalSpaces';
import { bookingsColors } from '../utils/bookingsTheme';
import { TimelineEvent, slotsToTimelineEvents } from '../utils/slotTimeline';

const HOUR_HEIGHT = 64;
const START_HOUR = 8;
const START_MINUTE = 30;
const END_HOUR = 19;
const END_MINUTE = 0;

const toMinutes = (hour: number, minute: number) => hour * 60 + minute;

const START_MINUTES = toMinutes(START_HOUR, START_MINUTE);
const END_MINUTES = toMinutes(END_HOUR, END_MINUTE);

type HourMarker = { hour: number; minute: number };

const HOUR_MARKERS: HourMarker[] = [
  { hour: START_HOUR, minute: START_MINUTE },
  ...Array.from({ length: END_HOUR - START_HOUR }, (_, index) => ({
    hour: START_HOUR + 1 + index,
    minute: 0,
  })),
];

/** Hour slots between markers (first is half-hour: 08:30–09:00). */
const HOUR_SLOTS = HOUR_MARKERS.slice(0, -1).map((marker, index) => {
  const next = HOUR_MARKERS[index + 1];
  const durationMinutes =
    toMinutes(next.hour, next.minute) - toMinutes(marker.hour, marker.minute);
  return {
    key: `${marker.hour}:${marker.minute}`,
    height: (durationMinutes / 60) * HOUR_HEIGHT,
  };
});

const DAYS_BEFORE = 14;
const DAYS_AFTER = 30;

const pad = (value: number) => value.toString().padStart(2, '0');

const formatEventTime = (event: TimelineEvent) =>
  `${pad(event.startHour)}:${pad(event.startMinute)}-${pad(event.endHour)}:${pad(event.endMinute)}`;

const formatHourMarker = (marker: HourMarker) =>
  `${pad(marker.hour)}:${pad(marker.minute)}`;

const topForMinutes = (minutes: number) =>
  ((minutes - START_MINUTES) / 60) * HOUR_HEIGHT;

/** University is closed on Sunday — Luxon weekday: Mon=1 … Sat=6. */
const isSelectableDay = (day: DateTime) => day.weekday >= 1 && day.weekday <= 6;

const toMonday = (day: DateTime) => day.minus({ days: day.weekday - 1 });

const CtaFade = ({ height }: { height: number }) => {
  const { colors } = useTheme();
  const styles = useStylesheet(createStyles);

  if (height <= 0) return null;

  return (
    <View pointerEvents="none" style={[styles.ctaFade, { height }]}>
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="ctaFade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.background} stopOpacity="0" />
            <Stop offset="1" stopColor={colors.background} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#ctaFade)" />
      </Svg>
    </View>
  );
};

export const FacilitySpaceTimelineScreen = () => {
  const { t } = useTranslation();
  const { dark, colors, spacing } = useTheme();
  const styles = useStylesheet(createStyles);
  const [ctaFooterHeight, setCtaFooterHeight] = useState(0);
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const route =
    useRoute<RouteProp<ProfileStackParamList, 'VistaCalendarioSpazio'>>();
  const { user } = useBookings();
  const spaceId = route.params.spaceId;
  const { data: space } = useGetInterdepartmentalSpace(spaceId);
  const { data: spaceTypes } = useGetInterdepartmentalSpaceTypes();
  const daysScrollRef = useRef<ScrollView>(null);
  const { width: windowWidth } = useWindowDimensions();

  const typeLabels = useMemo(
    () =>
      Object.fromEntries((spaceTypes ?? []).map(item => [item.id, item.name])),
    [spaceTypes],
  );

  const today = useMemo(() => DateTime.now().startOf('day'), []);

  const initialDate = useMemo(() => {
    if (isSelectableDay(today)) return today;
    // Sunday → next Monday
    return today.plus({ days: 1 });
  }, [today]);

  // Full Mon–Sat weeks so weekly snap lands on calendar weeks.
  const days = useMemo(() => {
    const rangeStart = toMonday(today.minus({ days: DAYS_BEFORE }));
    const rangeEnd = toMonday(today.plus({ days: DAYS_AFTER })).plus({
      days: DATE_SELECTOR_WEEKDAY_COUNT - 1,
    });

    const result: DateTime[] = [];
    for (let day = rangeStart; day <= rangeEnd; day = day.plus({ days: 1 })) {
      if (isSelectableDay(day)) result.push(day);
    }
    return result;
  }, [today]);

  const [selectedDate, setSelectedDate] = useState(initialDate);

  const eventsForDay = useMemo(
    () =>
      slotsToTimelineEvents(space?.slotsOccupied ?? [], selectedDate, {
        currentEmail: user.email,
        typeLabels,
      }),
    [space?.slotsOccupied, selectedDate, user.email, typeLabels],
  );

  const scrollToDate = useCallback(
    (day: DateTime) => {
      const selectedIndex = days.findIndex(item => item.hasSame(day, 'day'));
      if (selectedIndex < 0) return;

      const weekIndex = Math.floor(selectedIndex / DATE_SELECTOR_WEEKDAY_COUNT);
      requestAnimationFrame(() => {
        daysScrollRef.current?.scrollTo({
          x: weekIndex * windowWidth,
          animated: false,
        });
      });
    },
    [days, windowWidth],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.headerTitle}>
          {t('bookingsScreen.facilitySpaceCalendar')}
        </Text>
      ),
      headerTitleAlign: 'center',
      headerBackTitle: '',
      headerBackButtonDisplayMode: 'minimal',
      headerTransparent: false,
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: Platform.select({
          ios: colors.surface,
          android: dark ? colors.background : colors.surface,
        }),
      },
      ...(Platform.OS === 'android'
        ? {
            headerLeft: () => (
              <AndroidBackButton displayMode="minimal" />
            ),
          }
        : {}),
    });
  }, [navigation, t, styles.headerTitle, dark, colors.background, colors.surface]);

  useLayoutEffect(() => {
    scrollToDate(initialDate);
  }, [initialDate, scrollToDate]);

  const timelineHeight = ((END_MINUTES - START_MINUTES) / 60) * HOUR_HEIGHT;

  return (
    <View style={styles.screen}>
      <View style={styles.headerDivider} />
      <View style={styles.daysContainer}>
        <DateSelector
          ref={daysScrollRef}
          days={days}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </View>

      <ScrollView
        style={styles.timelineScroll}
        contentContainerStyle={styles.timelineContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.timeline, { height: timelineHeight }]}>
          {HOUR_SLOTS.map(slot => (
            <View
              key={slot.key}
              style={[styles.hourRow, { height: slot.height }]}
            >
              <View style={styles.hourLabelSpacer} />
              <View style={styles.hourFrame} />
            </View>
          ))}

          {HOUR_MARKERS.map(marker => {
            const isStartMarker =
              marker.hour === START_HOUR && marker.minute === START_MINUTE;
            if (isStartMarker) return null;

            const top = topForMinutes(toMinutes(marker.hour, marker.minute));
            return (
              <View
                key={formatHourMarker(marker)}
                style={[styles.hourMarker, { top: top - 8 }]}
              >
                <Text style={styles.hourLabel}>{formatHourMarker(marker)}</Text>
                <View style={styles.hourLine} />
              </View>
            );
          })}

          {eventsForDay.map(event => {
            const start = toMinutes(event.startHour, event.startMinute);
            const end = toMinutes(event.endHour, event.endMinute);
            const top = topForMinutes(start);
            const height = ((end - start) / 60) * HOUR_HEIGHT;
            const eventCardStyle = [
              styles.eventCard,
              {
                top,
                height,
                borderColor: event.borderColor,
                backgroundColor: event.backgroundColor,
              },
            ];
            const eventContent = (
              <>
                <View style={styles.eventHeading}>
                  <Text style={styles.eventTime} numberOfLines={1}>
                    {formatEventTime(event)}
                  </Text>
                  <Text style={styles.eventCategory} numberOfLines={1}>
                    {event.category}
                  </Text>
                </View>
                <Text
                  style={[styles.eventPerson, { color: event.personColor }]}
                  numberOfLines={1}
                >
                  {event.person}
                </Text>
                {!!event.description && (
                  <Text style={styles.eventDescription} numberOfLines={1}>
                    {event.description}
                  </Text>
                )}
              </>
            );

            if (event.isOwn) {
              return (
                <Pressable
                  key={event.id}
                  accessibilityRole="button"
                  onPress={() =>
                    navigation.navigate('NuovaPrenotazioneSpazio', {
                      spaceId,
                      eventId: event.id,
                    })
                  }
                  style={eventCardStyle}
                >
                  {eventContent}
                </Pressable>
              );
            }

            return (
              <View key={event.id} style={eventCardStyle}>
                {eventContent}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <CtaFade height={ctaFooterHeight + spacing[24]} />

      <View
        onLayout={event => setCtaFooterHeight(event.nativeEvent.layout.height)}
      >
        <CtaButton
          title={t('bookingsScreen.newBooking')}
          icon={faPlus}
          action={() =>
            navigation.navigate('NuovaPrenotazioneSpazio', {
              spaceId,
            })
          }
          absolute={false}
          variant="filled"
          style={styles.ctaButton}
          containerStyle={styles.ctaContainer}
          textStyle={styles.ctaButtonText}
        />
      </View>
    </View>
  );
};

const createStyles = ({
  dark,
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  shapes,
}: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerTitle: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      lineHeight: 22,
      letterSpacing: 0,
      color: dark ? colors.title : bookingsColors.nativeLabelOnNavigator,
      textAlign: 'center',
    },
    headerDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Platform.select({
        ios: colors.divider,
        android: dark ? colors.translucentSurface : colors.divider,
      }),
    },
    daysContainer: {
      flexGrow: 0,
      flexShrink: 0,
      ...Platform.select({
        android: {
          backgroundColor: dark ? colors.background : colors.surface,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: dark
            ? colors.translucentSurface
            : colors.divider,
        },
        default: {},
      }),
    },
    timelineScroll: {
      flex: 1,
    },
    timelineContent: {
      // Space for hour markers that sit on the hour boundaries,
      // plus extra room so the CTA fade doesn't cover the last slots.
      paddingTop: 8 + spacing[2],
      paddingBottom: 8 + spacing[24],
    },
    timeline: {
      marginLeft: 0,
      marginRight: 0,
      position: 'relative',
      overflow: 'visible',
    },
    hourRow: {
      flexShrink: 0,
      alignSelf: 'stretch',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    hourLabelSpacer: {
      width: 36,
    },
    hourMarker: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    hourLabel: {
      width: 36,
      fontFamily: fontFamilies.body,
      fontSize: 10,
      fontWeight: fontWeights.normal,
      lineHeight: 16,
      textAlign: 'center',
      color: dark ? colors.title : bookingsColors.textPrimary,
    },
    hourFrame: {
      flexGrow: 1,
      flexShrink: 0,
      flexBasis: 0,
      alignSelf: 'stretch',
      borderLeftWidth: 0.5,
      borderLeftColor: dark ? colors.divider : bookingsColors.gray300,
    },
    hourLine: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      height: StyleSheet.hairlineWidth,
      backgroundColor: dark ? colors.divider : bookingsColors.gray300,
    },
    eventCard: {
      position: 'absolute',
      left: 48,
      right: spacing[4],
      borderRadius: 12,
      borderWidth: 1,
      paddingHorizontal: spacing[3],
      paddingTop: spacing[3],
      paddingBottom: spacing[2],
      justifyContent: 'flex-start',
      gap: 2,
      overflow: 'hidden',
    },
    eventHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing[2],
    },
    eventTime: {
      flexShrink: 0,
      fontFamily: fontFamilies.body,
      fontSize: 12,
      fontWeight: fontWeights.normal,
      lineHeight: 19,
      letterSpacing: 0.12,
      color: bookingsColors.nativeLabelOnNavigator,
    },
    eventCategory: {
      flexShrink: 1,
      textAlign: 'right',
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
      color: bookingsColors.textPrimary,
    },
    eventPerson: {
      fontFamily: fontFamilies.heading,
      fontSize: 16,
      fontWeight: fontWeights.semibold,
      lineHeight: 22,
      letterSpacing: 0,
    },
    eventDescription: {
      overflow: 'hidden',
      fontFamily: fontFamilies.body,
      fontSize: 12,
      fontWeight: fontWeights.normal,
      lineHeight: 19,
      letterSpacing: 0.12,
      color: bookingsColors.textPrimary,
    },
    ctaFade: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
    },
    ctaContainer: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      paddingBottom: spacing[12],
      alignItems: 'flex-start',
    },
    ctaButton: {
      height: 45,
      paddingVertical: spacing[3],
      paddingHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      borderRadius: shapes.lg,
      backgroundColor: bookingsColors.linkBlue,
      borderColor: bookingsColors.linkBlue,
      elevation: 0,
    },
    ctaButtonText: {
      color: bookingsColors.onButtonPrimary,
      textAlign: 'center',
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
    },
  });
