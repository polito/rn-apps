import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  faCalendar,
  faChevronDown,
  faEye,
  faGrip,
  faRotate,
} from '@fortawesome/free-solid-svg-icons';
import {
  CtaButton,
  Icon,
  ListItem,
  OverviewList,
  Section,
  SectionHeader,
  StatefulMenuView,
  Switch,
  Text,
  Theme,
  faSeat,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DateTime } from 'luxon';

import { ProfileStackParamList } from '../../../screens/Servizi/ServiceNavigator';
import {
  useCreateSpaceEvent,
  useGetInterdepartmentalSpace,
  useGetInterdepartmentalSpaceTypes,
  useUpdateSpaceEvent,
} from '../hooks/useInterdepartmentalSpaces';
import { useBookings } from '../hooks/useBookings';
import {
  fromApiDate,
  fromApiTime,
  toApiDate,
  toApiTime,
} from '../utils/slotTimeline';

const DESCRIPTION_MAX_LENGTH = 30;

const buildTime = (hour: number, minute: number) => {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
};

const formatTime = (date: Date) => DateTime.fromJSDate(date).toFormat('HH:mm');

const ensureEndAfterStart = (start: Date, end: Date) => {
  if (end.getTime() > start.getTime()) {
    return end;
  }
  return DateTime.fromJSDate(start).plus({ minutes: 30 }).toJSDate();
};

export const NewFacilityBookingScreen = () => {
  const { t } = useTranslation();
  const { dark, colors } = useTheme();
  const styles = useStylesheet(createStyles);
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const route =
    useRoute<RouteProp<ProfileStackParamList, 'NuovaPrenotazioneSpazio'>>();
  const spaceId = route.params?.spaceId;
  const eventId = route.params?.eventId;
  const { user, bookings, addBooking, updateBooking } = useBookings();
  const { data: space } = useGetInterdepartmentalSpace(spaceId);
  const { data: spaceTypes } = useGetInterdepartmentalSpaceTypes();
  const createSpaceEvent = useCreateSpaceEvent(spaceId ?? '');
  const updateSpaceEvent = useUpdateSpaceEvent(spaceId ?? '');
  const editingSlot = space?.slotsOccupied.find(slot => slot.id === eventId);
  const isEditing = !!editingSlot;
  const canEdit =
    !editingSlot || editingSlot.bookedBy.email === user.email;
  const availableSeats = space?.numSeats ?? 10;

  const eventTypes = useMemo(
    () =>
      (spaceTypes ?? []).map(item => ({
        id: item.id,
        title: item.name,
      })),
    [spaceTypes],
  );

  useEffect(() => {
    if (!spaceId) {
      navigation.goBack();
    }
  }, [spaceId, navigation]);

  useEffect(() => {
    if (eventId && !canEdit) {
      navigation.goBack();
    }
  }, [eventId, canEdit, navigation]);

  const seatOptions = useMemo(
    () =>
      Array.from({ length: availableSeats }, (_, index) => {
        const count = index + 1;
        return {
          id: String(count),
          title: t('bookingsScreen.availableSeats', { count }),
        };
      }),
    [availableSeats, t],
  );

  const [selectedDate, setSelectedDate] = useState(() =>
    editingSlot ? fromApiDate(editingSlot.startAt) : new Date(),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(() =>
    editingSlot
      ? fromApiTime(editingSlot.startAt)
      : buildTime(11, 30),
  );
  const [endTime, setEndTime] = useState(() =>
    editingSlot
      ? fromApiTime(editingSlot.endAt)
      : buildTime(12, 30),
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [seats, setSeats] = useState(String(availableSeats));
  const [eventTypeId, setEventTypeId] = useState(() => {
    if (!editingSlot?.type) return eventTypes[0]?.id ?? 'meeting';
    return (
      eventTypes.find(item => item.id === editingSlot.type)?.id ??
      eventTypes[0]?.id ??
      'meeting'
    );
  });
  const [recurringEvent, setRecurringEvent] = useState(false);
  const [visibleToOthers, setVisibleToOthers] = useState(true);
  const [description, setDescription] = useState(
    () => editingSlot?.description ?? '',
  );
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);

  useEffect(() => {
    if (!editingSlot) return;
    setSelectedDate(fromApiDate(editingSlot.startAt));
    setStartTime(fromApiTime(editingSlot.startAt));
    setEndTime(fromApiTime(editingSlot.endAt));
    setDescription(editingSlot.description);
    setEventTypeId(
      eventTypes.find(item => item.id === editingSlot.type)?.id ??
        eventTypes[0]?.id ??
        'meeting',
    );
  }, [editingSlot, eventTypes]);

  const iconColor = dark ? colors.secondaryText : TEXT_HEADING;
  const disabledIconColor = dark ? colors.secondaryText : CONTROLS_DISABLE;

  const eventTypeTitle =
    eventTypes.find(item => item.id === eventTypeId)?.title ?? '';
  const seatsTitle =
    seatOptions.find(item => item.id === seats)?.title ??
    t('bookingsScreen.availableSeats', { count: Number(seats) });
  const formattedDate =
    DateTime.fromJSDate(selectedDate).toFormat('dd/MM/yyyy');
  const formattedTimeSlot = `${formatTime(startTime)}-${formatTime(endTime)}`;
  const isDescriptionEmpty = !description.trim();

  const handleConfirmBooking = async () => {
    if (!spaceId) return;

    const request = {
      eventDate: toApiDate(selectedDate),
      startsAt: toApiTime(startTime),
      endsAt: toApiTime(endTime),
      type: eventTypeId,
      eventDescription: description.trim(),
      seatsToAllocate: Number(seats),
      notes: editingSlot?.note ?? '',
      isPubliclyVisible: visibleToOthers,
    };

    const time = `${formatTime(startTime)} - ${formatTime(endTime)}`;
    const details = [eventTypeTitle, description.trim()]
      .filter(Boolean)
      .join(' — ');

    if (editingSlot && eventId) {
      await updateSpaceEvent.mutateAsync({ eventId, request });

      const linkedBooking = bookings.find(
        booking =>
          booking.type === 2 &&
          booking.spaceId === spaceId &&
          booking.eventId === eventId,
      );
      if (linkedBooking) {
        updateBooking({
          ...linkedBooking,
          date: formattedDate,
          time,
          details,
          capacity: Number(seats),
          eventType: eventTypeTitle,
          recurringEvent,
          visibleToOthers,
        });
      }
    } else {
      const newEventId = await createSpaceEvent.mutateAsync(request);
      const bookingId = Date.now();

      addBooking({
        id: bookingId,
        type: 2,
        title: `${t('other.booking')} #${String(bookingId).slice(-5)}`,
        date: formattedDate,
        time,
        details,
        status: 'accettata',
        capacity: Number(seats),
        eventType: eventTypeTitle,
        recurringEvent,
        visibleToOthers,
        ownerName: user.name,
        spaceId,
        eventId: newEventId,
      });
    }

    navigation.goBack();
  };

  const openDatePicker = () => {
    setShowTimePicker(false);
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: selectedDate,
        mode: 'date',
        onChange: (event, date) => {
          if (event.type === 'set' && date) {
            setSelectedDate(date);
          }
        },
      });
      return;
    }
    setShowDatePicker(prev => !prev);
  };

  const openAndroidEndTimePicker = (nextStart: Date) => {
    DateTimePickerAndroid.open({
      value: ensureEndAfterStart(nextStart, endTime),
      mode: 'time',
      is24Hour: true,
      onChange: (event, date) => {
        if (event.type === 'set' && date) {
          setEndTime(ensureEndAfterStart(nextStart, date));
        }
      },
    });
  };

  const openTimePicker = () => {
    setShowDatePicker(false);
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: startTime,
        mode: 'time',
        is24Hour: true,
        onChange: (event, date) => {
          if (event.type !== 'set' || !date) {
            return;
          }
          setStartTime(date);
          setEndTime(ensureEndAfterStart(date, endTime));
          openAndroidEndTimePicker(date);
        },
      });
      return;
    }
    setShowTimePicker(prev => !prev);
  };

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'set' && date) {
      setSelectedDate(date);
    }
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
  };

  const handleStartTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'set' && date) {
      setStartTime(date);
      setEndTime(prev => ensureEndAfterStart(date, prev));
    }
  };

  const handleEndTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'set' && date) {
      setEndTime(ensureEndAfterStart(startTime, date));
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.headerTitle}>
          {isEditing
            ? t('bookingsScreen.reservationDetails')
            : t('bookingsScreen.newBooking')}
        </Text>
      ),
      headerBackTitle: '',
      headerBackVisible: false,
      headerShadowVisible: true,
      headerTransparent: false,
      headerStyle: {
        backgroundColor: dark ? colors.background : HEADER_GRAY,
      },
      contentStyle: {
        backgroundColor: colors.background,
      },
      headerLeft: () => (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Text style={styles.closeText}>{t('common.close')}</Text>
        </TouchableOpacity>
      ),
    });
  }, [
    navigation,
    t,
    dark,
    colors.background,
    styles.headerTitle,
    styles.closeButton,
    styles.closeText,
    isEditing,
  ]);

  const remainingChars = DESCRIPTION_MAX_LENGTH - description.length;

  if (!spaceId || (eventId && !canEdit)) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.datetimeRow}>
          <Pressable
            accessibilityRole="button"
            onPress={openDatePicker}
            style={styles.datetimeCard}
          >
            <Icon icon={faCalendar} size={22} color={disabledIconColor} />
            <View style={styles.fieldTextBlock}>
              <Text style={styles.fieldLabel} numberOfLines={1}>
                {t('other.date')}
              </Text>
              <View style={styles.fieldValueRow}>
                <Text style={styles.fieldValue} numberOfLines={1}>
                  {formattedDate}
                </Text>
                <Icon
                  icon={faChevronDown}
                  size={14}
                  color={dark ? colors.prose : TEXT_SUBTITLE}
                />
              </View>
            </View>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={openTimePicker}
            style={styles.datetimeCard}
          >
            <Icon icon={faCalendar} size={22} color={disabledIconColor} />
            <View style={styles.fieldTextBlock}>
              <Text style={styles.fieldLabel} numberOfLines={1}>
                {t('bookingsScreen.timeSlot')}
              </Text>
              <View style={styles.fieldValueRow}>
                <Text style={styles.fieldValue} numberOfLines={1}>
                  {formattedTimeSlot}
                </Text>
                <Icon
                  icon={faChevronDown}
                  size={14}
                  color={dark ? colors.prose : TEXT_SUBTITLE}
                />
              </View>
            </View>
          </Pressable>
        </View>

        {Platform.OS === 'ios' && showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            style={styles.datePicker}
          />
        )}

        {Platform.OS === 'ios' && showTimePicker && (
          <View style={styles.timePickers}>
            <View style={styles.timePickerColumn}>
              <Text style={styles.timePickerLabel}>{t('other.startTime')}</Text>
              <DateTimePicker
                value={startTime}
                mode="time"
                display="spinner"
                minuteInterval={30}
                is24Hour
                onChange={handleStartTimeChange}
                style={styles.datePicker}
              />
            </View>
            <View style={styles.timePickerColumn}>
              <Text style={styles.timePickerLabel}>{t('other.endTime')}</Text>
              <DateTimePicker
                value={endTime}
                mode="time"
                display="spinner"
                minuteInterval={30}
                is24Hour
                onChange={handleEndTimeChange}
                style={styles.datePicker}
              />
            </View>
          </View>
        )}

        <Section style={styles.section}>
          <SectionHeader
            title={t('other.characteristics')}
            titleStyle={styles.sectionTitle}
            ellipsizeTitle={false}
            separator={false}
          />
          <OverviewList indented>
            <StatefulMenuView
              style={styles.menuFill}
              title={t('bookingsScreen.typeOfEvent')}
              actions={eventTypes.map(option => ({
                id: option.id,
                title: option.title,
                state: (eventTypeId === option.id ? 'on' : 'off') as
                  | 'on'
                  | 'off',
              }))}
              onPressAction={({ nativeEvent: { event } }) =>
                setEventTypeId(event)
              }
            >
              <ListItem
                isAction
                leadingItem={<Icon icon={faGrip} size={28} color={iconColor} />}
                title={t('bookingsScreen.typeOfEvent')}
                titleStyle={styles.listTitle}
                subtitle={eventTypeTitle}
                subtitleStyle={styles.listSubtitle}
                containerStyle={styles.listItem}
              />
            </StatefulMenuView>
            <StatefulMenuView
              style={styles.menuFill}
              title={t('bookingsScreen.specifySeats')}
              actions={seatOptions.map(option => ({
                id: option.id,
                title: option.title,
                state: (seats === option.id ? 'on' : 'off') as 'on' | 'off',
              }))}
              onPressAction={({ nativeEvent: { event } }) => setSeats(event)}
            >
              <ListItem
                isAction
                leadingItem={<Icon icon={faSeat} size={28} color={iconColor} />}
                title={t('bookingsScreen.specifySeats')}
                titleStyle={styles.listTitle}
                subtitle={seatsTitle}
                subtitleStyle={styles.listSubtitle}
                containerStyle={styles.listItem}
              />
            </StatefulMenuView>
            <ListItem
              leadingItem={<Icon icon={faRotate} size={24} color={iconColor} />}
              title={t('bookingsScreen.recurringEvent')}
              titleStyle={styles.listTitle}
              containerStyle={styles.listItem}
              onPress={() => setRecurringEvent(prev => !prev)}
              trailingItem={
                <Switch
                  value={recurringEvent}
                  onChange={() => setRecurringEvent(prev => !prev)}
                  trackColor={{
                    true: IOS_SWITCH_ON,
                    false: IOS_SWITCH_OFF,
                  }}
                  ios_backgroundColor={IOS_SWITCH_OFF}
                />
              }
            />
            <ListItem
              leadingItem={<Icon icon={faEye} size={24} color={iconColor} />}
              title={t('bookingsScreen.visibleToOthers')}
              titleStyle={styles.listTitle}
              containerStyle={styles.listItem}
              onPress={() => setVisibleToOthers(prev => !prev)}
              trailingItem={
                <Switch
                  value={visibleToOthers}
                  onChange={() => setVisibleToOthers(prev => !prev)}
                  trackColor={{
                    true: IOS_SWITCH_ON,
                    false: IOS_SWITCH_OFF,
                  }}
                  ios_backgroundColor={IOS_SWITCH_OFF}
                />
              }
            />
          </OverviewList>
        </Section>

        <View
          style={[
            styles.descriptionCard,
            isDescriptionFocused && styles.descriptionCardFocused,
          ]}
        >
          <View style={styles.descriptionHeader}>
            <Text
              style={[
                styles.descriptionLabel,
                !isDescriptionFocused && styles.descriptionLabelIdle,
              ]}
            >
              {t('other.description')}
            </Text>
            <Text
              style={[
                styles.descriptionCounter,
                isDescriptionFocused
                  ? styles.descriptionCounterActive
                  : styles.descriptionLabelIdle,
              ]}
            >
              {remainingChars}
            </Text>
          </View>
          <TextInput
            value={description}
            onChangeText={text =>
              setDescription(text.slice(0, DESCRIPTION_MAX_LENGTH))
            }
            onFocus={() => setIsDescriptionFocused(true)}
            onBlur={() => setIsDescriptionFocused(false)}
            placeholder={t('other.writeSomething')}
            placeholderTextColor={dark ? colors.secondaryText : PLACEHOLDER}
            selectionColor={CURSOR_ORANGE}
            multiline
            textAlignVertical="top"
            maxLength={DESCRIPTION_MAX_LENGTH}
            style={styles.descriptionInput}
          />
        </View>
      </ScrollView>

      <CtaButton
        title={
          isEditing
            ? t('bookingsScreen.saveChanges')
            : t('bookingsScreen.confirmBooking')
        }
        action={handleConfirmBooking}
        disabled={isDescriptionEmpty}
        absolute={false}
        variant="filled"
        style={[
          styles.ctaButton,
          isDescriptionEmpty && styles.ctaButtonDisabled,
        ]}
        containerStyle={styles.ctaContainer}
        textStyle={{
          ...styles.ctaButtonText,
          ...(isDescriptionEmpty ? styles.ctaButtonTextDisabled : {}),
        }}
      />
    </View>
  );
};

const HEADER_GRAY = '#EDEEF0';
const NATIVE_LABEL_ON_NAVIGATOR = '#171717';
const CARD_SURFACE = '#FFFFFF';
const TEXT_HEADING = '#45556C';
const TEXT_PRIMARY = '#262626';
const TEXT_SUBTITLE = '#314158';
const CONTROLS_DISABLE = '#90A1B9';
const BUTTON_DISABLED = '#45556C';
const PLACEHOLDER = '#90A1B9';
const LINK_BLUE = '#006DB4';
const ON_BUTTON_PRIMARY = '#F8FAFC';
const IOS_SWITCH_ON = '#34C759';
const IOS_SWITCH_OFF = '#E9E9EA';
const TEXTAREA_BORDER_TYPING = '#00ACFF';
const CURSOR_ORANGE = '#FF9500';

const createStyles = ({
  dark,
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  shapes,
  spacing,
}: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: spacing[3],
      paddingBottom: spacing[6],
      gap: spacing[3],
    },
    closeButton: {
      marginLeft: -spacing[2],
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[1],
    },
    closeText: {
      fontFamily: fontFamilies.title,
      fontSize: fontSizes.md,
      fontStyle: 'normal',
      fontWeight: fontWeights.medium,
      lineHeight: 23,
      letterSpacing: 0.16,
      textAlign: 'right',
      color: LINK_BLUE,
    },
    headerTitle: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.md,
      fontStyle: 'normal',
      fontWeight: fontWeights.semibold,
      lineHeight: 22,
      letterSpacing: 0,
      textAlign: 'center',
      color: dark ? colors.title : NATIVE_LABEL_ON_NAVIGATOR,
    },
    datetimeRow: {
      flexDirection: 'row',
      alignItems: 'stretch',
      gap: spacing[3],
      paddingHorizontal: spacing[4],
    },
    datePicker: {
      alignSelf: 'center',
    },
    timePickers: {
      flexDirection: 'row',
      gap: spacing[2],
      paddingHorizontal: spacing[2],
    },
    timePickerColumn: {
      flex: 1,
      alignItems: 'center',
    },
    timePickerLabel: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: dark ? colors.secondaryText : TEXT_SUBTITLE,
      marginBottom: spacing[1],
    },
    menuFill: {
      flex: 1,
      width: '100%',
    },
    datetimeCard: {
      flex: 1,
      height: 72,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
      backgroundColor: dark ? colors.surfaceDark : CARD_SURFACE,
      borderRadius: shapes.lg,
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[4],
      overflow: 'hidden',
    },
    fieldTextBlock: {
      flex: 1,
      gap: spacing[0.5],
      minWidth: 0,
    },
    fieldLabel: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      lineHeight: 20,
      color: dark ? colors.secondaryText : TEXT_PRIMARY,
    },
    fieldValueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[1.5],
    },
    fieldValue: {
      flexShrink: 1,
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      lineHeight: 24,
      color: dark ? colors.prose : TEXT_SUBTITLE,
    },
    section: {
      marginBottom: 0,
    },
    sectionTitle: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.bold,
      lineHeight: 20,
      color: dark ? colors.heading : TEXT_HEADING,
    },
    listItem: {
      minHeight: 52,
      paddingVertical: spacing[1],
    },
    listTitle: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
      color: dark ? colors.title : TEXT_PRIMARY,
    },
    listSubtitle: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.medium,
      lineHeight: 16,
      color: dark ? colors.prose : TEXT_SUBTITLE,
    },
    descriptionCard: {
      marginHorizontal: spacing[4],
      backgroundColor: dark ? colors.surfaceDark : CARD_SURFACE,
      borderRadius: shapes.lg,
      paddingHorizontal: spacing[3],
      paddingTop: spacing[2],
      paddingBottom: spacing[2],
      borderWidth: 1,
      borderColor: 'transparent',
    },
    descriptionCardFocused: {
      borderColor: TEXTAREA_BORDER_TYPING,
    },
    descriptionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    descriptionLabel: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      lineHeight: 24,
      color: dark ? colors.heading : TEXT_HEADING,
    },
    descriptionLabelIdle: {
      color: dark ? colors.secondaryText : PLACEHOLDER,
    },
    descriptionCounter: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.medium,
      lineHeight: 16,
    },
    descriptionCounterActive: {
      color: dark ? colors.heading : TEXT_HEADING,
    },
    descriptionInput: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      lineHeight: 20,
      color: dark ? colors.prose : TEXT_PRIMARY,
      overflow: 'hidden',
      padding: 0,
      marginTop: spacing[0.5],
      minHeight: 20,
    },
    ctaContainer: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      paddingBottom: spacing[12],
    },
    ctaButton: {
      height: 45,
      paddingVertical: spacing[3],
      paddingHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      borderRadius: shapes.lg,
      backgroundColor: LINK_BLUE,
      borderColor: LINK_BLUE,
      elevation: 0,
    },
    ctaButtonDisabled: {
      backgroundColor: dark ? BUTTON_DISABLED : CONTROLS_DISABLE,
      borderColor: dark ? BUTTON_DISABLED : CONTROLS_DISABLE,
    },
    ctaButtonText: {
      color: ON_BUTTON_PRIMARY,
      textAlign: 'center',
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
    },
    ctaButtonTextDisabled: {
      color: dark ? NATIVE_LABEL_ON_NAVIGATOR : ON_BUTTON_PRIMARY,
    },
  });
