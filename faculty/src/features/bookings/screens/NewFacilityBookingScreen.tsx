import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import {
  faCalendar,
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
  Switch,
  Text,
  TextButton,
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
import { DateTimeFieldRow } from '../components/DateTimeFieldRow';
import { LimitedTextArea } from '../components/LimitedTextArea';
import { SelectMenuField } from '../components/SelectMenuField';
import { useBookings } from '../hooks/useBookings';
import {
  useCreateSpaceEvent,
  useGetInterdepartmentalSpace,
  useGetInterdepartmentalSpaceTypes,
  useUpdateSpaceEvent,
} from '../hooks/useInterdepartmentalSpaces';
import {
  fromApiDate,
  fromApiTime,
  toApiDate,
  toApiTime,
} from '../utils/apiDates';
import { bookingsColors } from '../utils/bookingsTheme';

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
  const canEdit = !editingSlot || editingSlot.bookedBy.email === user.email;
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
    editingSlot ? fromApiTime(editingSlot.startAt) : buildTime(11, 30),
  );
  const [endTime, setEndTime] = useState(() =>
    editingSlot ? fromApiTime(editingSlot.endAt) : buildTime(12, 30),
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

  const iconColor = dark ? colors.secondaryText : bookingsColors.textHeading;

  const eventTypeTitle =
    eventTypes.find(item => item.id === eventTypeId)?.title ?? '';
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
        backgroundColor: dark ? colors.background : bookingsColors.headerGray,
      },
      contentStyle: {
        backgroundColor: colors.background,
      },
      headerLeft: () => (
        <TextButton
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          {t('common.close')}
        </TextButton>
      ),
    });
  }, [
    navigation,
    t,
    dark,
    colors.background,
    styles.headerTitle,
    styles.closeButton,
    isEditing,
  ]);

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
        <DateTimeFieldRow
          fields={[
            {
              icon: faCalendar,
              label: t('other.date'),
              value: formattedDate,
              onPress: openDatePicker,
            },
            {
              icon: faCalendar,
              label: t('bookingsScreen.timeSlot'),
              value: formattedTimeSlot,
              onPress: openTimePicker,
            },
          ]}
        />

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
            <SelectMenuField
              icon={faGrip}
              title={t('bookingsScreen.typeOfEvent')}
              value={eventTypeId}
              options={eventTypes}
              onSelect={setEventTypeId}
              iconSize={28}
            />
            <SelectMenuField
              icon={faSeat}
              title={t('bookingsScreen.specifySeats')}
              value={seats}
              options={seatOptions}
              onSelect={setSeats}
              iconSize={28}
            />
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
                    true: bookingsColors.iosSwitchOn,
                    false: bookingsColors.iosSwitchOff,
                  }}
                  ios_backgroundColor={bookingsColors.iosSwitchOff}
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
                    true: bookingsColors.iosSwitchOn,
                    false: bookingsColors.iosSwitchOff,
                  }}
                  ios_backgroundColor={bookingsColors.iosSwitchOff}
                />
              }
            />
          </OverviewList>
        </Section>

        <LimitedTextArea
          label={t('other.description')}
          value={description}
          onChange={setDescription}
          maxLength={DESCRIPTION_MAX_LENGTH}
          placeholder={t('other.writeSomething')}
        />
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
      paddingVertical: spacing[1],
    },
    headerTitle: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.md,
      fontStyle: 'normal',
      fontWeight: fontWeights.semibold,
      lineHeight: 22,
      letterSpacing: 0,
      textAlign: 'center',
      color: dark ? colors.title : bookingsColors.nativeLabelOnNavigator,
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
      color: dark ? colors.secondaryText : bookingsColors.textSubtitle,
      marginBottom: spacing[1],
    },
    section: {
      marginBottom: 0,
    },
    sectionTitle: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.bold,
      lineHeight: 20,
      color: dark ? colors.heading : bookingsColors.textHeading,
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
      color: dark ? colors.title : bookingsColors.textPrimary,
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
      backgroundColor: bookingsColors.linkBlue,
      borderColor: bookingsColors.linkBlue,
      elevation: 0,
    },
    ctaButtonDisabled: {
      backgroundColor: dark
        ? bookingsColors.buttonDisabled
        : bookingsColors.controlsDisable,
      borderColor: dark
        ? bookingsColors.buttonDisabled
        : bookingsColors.controlsDisable,
    },
    ctaButtonText: {
      color: bookingsColors.onButtonPrimary,
      textAlign: 'center',
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
    },
    ctaButtonTextDisabled: {
      color: dark
        ? bookingsColors.nativeLabelOnNavigator
        : bookingsColors.onButtonPrimary,
    },
  });
