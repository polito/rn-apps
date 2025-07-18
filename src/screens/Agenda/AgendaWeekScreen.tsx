import {useLayoutEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {AgendaCard} from '../../ui/components/AgendaCard';
import {Tab} from '../../ui/components/Tab';
import {Tabs} from '../../ui/components/Tabs';
import {Text} from '../../ui/components/Text';
import {useTheme} from '../../ui/hooks/useTheme';
import {useBottomBarAwareStyles} from '../../core/hooks/useBottomBarAwareStyles';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Logo} from '../../core/components/Logo';
import {
  faCalendar,
  faCalendarDay,
  faEllipsisVertical,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import {Row} from '../../ui/components/Row';
import {IconButton} from '../../ui/components/IconButton';
import {Theme} from '../../ui/types/Theme';
import {useStylesheet} from '../../ui/hooks/useStylesheet';
import {HeaderAccessory} from '../../ui/components/HeaderAccessory';
import {AgendaFilters} from './components/AgendaFilters';
import DateTimePicker, {
  DateTimePickerEvent,
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import {useSafeAreaSpacing} from '../../core/hooks/useSafeAreaSpacing';
import {ActivityIndicator} from '../../ui/components/ActivityIndicator';
import {BottomBarSpacer} from '../../core/components/BottomBarSpacer';
import {format} from 'date-fns';
import {it} from 'date-fns/locale';
import {useCourses} from '../../core/contexts/CoursesContext';
import Popover from 'react-native-popover-view';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Calendar} from '../../ui/components/calendar/Calendar';
import {DateTime} from 'luxon';
import {AgendaItem} from './AgendaItem';
import {LectureCard} from './components/LectureCard';
import {LectureItem} from './types/AgendaItem';
import {CalendarHeader} from '../../ui/components/calendar/CalendarHeader';

const cellHeight = 25;
const handleDateChange = <T extends Date | null>(
  event: DateTimePickerEvent,
  selectedDate: Date | undefined,
  setShowPicker: React.Dispatch<React.SetStateAction<boolean>>,
  setDate: React.Dispatch<React.SetStateAction<T>>,
) => {
  if (event.type === 'set' && selectedDate) {
    setShowPicker(false);
    setDate(selectedDate as T);
  } else if (event.type === 'dismissed') {
    setShowPicker(false);
  }
};

export const AgendaWeekScreen = () => {
  const {t} = useTranslation();
  const {colors, spacing, palettes, fontSizes} = useTheme();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const navigation = useNavigation();
  const styles = useStylesheet(createStyles);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const {marginHorizontal} = useSafeAreaSpacing();
  const {agendaItems, selectCourseByName, setSelectedAgendaItem} = useCourses();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const buttonRef = useRef(null);

  const openAndroidDatePicker = () => {
    DateTimePickerAndroid.open({
      value: startDate,
      mode: 'date',
      display: 'default',
      onChange: (event, selectedDate) => {
        if (event.type === 'set' && selectedDate) {
          setStartDate(selectedDate);
        }
        setShowStartPicker(false);
      },
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          variant="heading"
          style={{
            marginLeft: Platform.OS === 'android' ? 85 : 120,
            width: 100,
          }}>
          Agenda
        </Text>
      ),
      headerLeft: () => <Logo />,
      headerRight: () => (
        <Row>
          <View style={{width: fontSizes.lg + spacing[6]}} />

          <IconButton
            icon={faCalendarDay}
            color={colors.primary[400]}
            size={fontSizes.lg}
            onPress={() => {
              if (Platform.OS === 'android') {
                openAndroidDatePicker();
              } else {
                setShowStartPicker(true);
              }
            }}
          />

          <IconButton
            icon={faPlus}
            color={colors.primary[400]}
            size={fontSizes.lg}
            onPress={() => {
              navigation.navigate('Form');
            }}
          />

          <TouchableOpacity
            ref={buttonRef}
            onPress={() => setMenuVisible(true)}>
            <FontAwesomeIcon
              style={{marginTop: spacing[3], marginLeft: spacing[2]}}
              icon={faEllipsisVertical}
              size={fontSizes.lg}
              color={colors.primary[400]}
            />
          </TouchableOpacity>
        </Row>
      ),
    });
  }, []);

  const date = DateTime.now();

  const [currentWeek, setCurrentWeek] = useState<DateTime>(
    date ? date.startOf('week') : DateTime.now().startOf('week'),
  );

  const calendarEvents = useMemo(() => {
    const mapped = agendaItems.map(item => {
      let startHour = 0;
      let startMinute = 0;
      let endHour = 0;
      let endMinute = 0;
      const cleanedPlace =
        typeof item.location === 'string'
          ? item.location.replace(/^Aula\s*/, '')
          : item.location;

      if (typeof item.time === 'string' && item.time.includes(' - ')) {
        const [startTime, endTime] = item.time.split(' - ');
        const startParts = startTime.split(':').map(Number);
        if (startParts.length === 2 && !isNaN(startParts[0]) && !isNaN(startParts[1])) {
          [startHour, startMinute] = startParts;
        }
        const endParts = endTime.split(':').map(Number);
        if (endParts.length === 2 && !isNaN(endParts[0]) && !isNaN(endParts[1])) {
          [endHour, endMinute] = endParts;
        }
      }

      const start = DateTime.fromISO(item.date).set({
        hour: startHour,
        minute: startMinute,
      });

      const end = DateTime.fromISO(item.date).set({
        hour: endHour,
        minute: endMinute,
      });

      return {
        id: item.id,
        key: item.id.toString(),
        title: item.title,
        description: item.description,
        place: cleanedPlace,
        type: 'lecture',
        date: item.date,
        fromTime: start.toString(),
        toTime: end.toString(),
        start,
        end,
        startTimestamp: start.toMillis(),
        courseId: 0,
        teacherId: 0,
        virtualClassrooms: [],
      };
    });

    return mapped as LectureItem[];
  }, [agendaItems]);

  const calendarHeight = 600;

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Popover
        isVisible={isMenuVisible}
        from={buttonRef}
        onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity>
          <Text style={styles.menuItem}>Aggiorna</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Agenda2');
            setMenuVisible(false);
          }}>
          <Text style={styles.menuItem}>Formato Giornaliero</Text>
        </TouchableOpacity>
      </Popover>

      {Platform.OS === 'ios' && showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="spinner"
          onChange={(event, date) =>
            handleDateChange(event, date, setShowStartPicker, setStartDate)
          }
        />
      )}

      <Calendar<LectureItem>
        events={calendarEvents}
        height={calendarHeight}
        hours={[...Array(14).keys()].map(i => i + 8)}
        startHour={8}
        onPressEvent={event => {
          selectCourseByName(event.title);
          const originalItem = agendaItems.find(i => i.id === event.id);
          if (originalItem) {
            setSelectedAgendaItem(originalItem);
          }
          navigation.navigate('SingleElement');
        }}
        mode="custom"
        weekStartsOn={1}
        weekEndsOn={5}
        date={DateTime.fromJSDate(startDate)}
        showAllDayEventCell={false}
        scrollOffsetMinutes={0}
        ampm={false}
        hideNowIndicator={false}
        overlapOffset={10000}
        headerContentStyle={styles.dayHeader}
        renderHeader={props => <CalendarHeader {...props} cellHeight={-1} />}
        renderEvent={(item, touchableOpacityProps, key) => {
          const startPosition = (item.start.hour - 8) * 60 + item.start.minute;
          const eventHeight = (((item.end.hour - item.start.hour) * 60 + (item.end.minute - item.start.minute)) / 30) * cellHeight;
          const top = (startPosition / 30) * cellHeight;

          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.event,
                {
                  position: 'absolute',
                  top: top,
                  height: eventHeight,
                  width: '100%',
                  zIndex: 10,
                },
              ]}>
              <LectureCard
                item={item}
                compact={true}
                onPress={() => {
                  selectCourseByName(item.title);
                  const originalItem = agendaItems.find(i => i.id === item.id);
                  if (originalItem) {
                    setSelectedAgendaItem(originalItem);
                  }
                  navigation.navigate('SingleElement');
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const createStyles = ({spacing, fontSizes}: Theme) =>
  StyleSheet.create({
    tabs: {
      alignItems: 'center',
    },
    headerContainer: {
      paddingVertical: spacing[2],
      paddingLeft: spacing[4],
    },
    container: {
      display: 'flex',
      flexDirection: 'row',
      gap: spacing[2],
    },
    calendarContainer: {
      height: '100%',
      width: '100%',
    },
    dayHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    eventText: {
      fontSize: fontSizes.md,
      color: 'white',
    },
    event: {
      backgroundColor: undefined,
      shadowColor: undefined,
      shadowOffset: undefined,
      shadowOpacity: undefined,
      shadowRadius: undefined,
      elevation: undefined,
    },
    loader: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    menuItem: {
      padding: 10,
      fontSize: 16,
    },
  });