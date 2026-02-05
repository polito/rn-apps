import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Popover from 'react-native-popover-view';

import {
  faCalendarDay,
  faEllipsisVertical,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  BottomBarSpacer,
  IconButton,
  Row,
  Text,
  Theme,
  useSafeAreaSpacing,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { AgendaCard } from '@polito/lib/ui';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Locale, format } from 'date-fns';
import { enUS, it } from 'date-fns/locale';

import { Logo } from '../../core/components/Logo';
import { useCourses } from '../../core/contexts/CoursesContext';
import { AgendaStackParamList } from './AgendaNavigator';

const localeMap: Record<string, Locale> = {
  it: it,
  en: enUS,
};

export const AgendaScreen = () => {
  const { t, i18n } = useTranslation();
  const locale = localeMap[i18n.language] || enUS;

  const { colors, spacing, fontSizes, palettes } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<AgendaStackParamList>>();
  const styles = useStylesheet(createStyles);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const { marginHorizontal } = useSafeAreaSpacing();
  const { agendaItems, selectCourseByName, setSelectedAgendaItem } =
    useCourses();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const buttonRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          variant="heading"
          style={{
            marginLeft: Platform.OS === 'android' ? 85 : 130,
            width: 100,
          }}
        >
          Agenda
        </Text>
      ),
      headerLeft: () => <Logo />,
      headerRight: () => (
        <Row>
          <View style={{ width: fontSizes.lg + spacing[6] }} />

          <IconButton
            icon={faCalendarDay}
            color={palettes.primary[400]}
            size={fontSizes.lg}
            accessibilityLabel={t('common.preferences')}
            hitSlop={{ left: spacing[2], right: spacing[2] }}
            onPress={() => {
              if (Platform.OS === 'android') {
                try {
                  DateTimePickerAndroid.open({
                    value: startDate,
                    mode: 'date',
                    is24Hour: true,
                    display: 'default',
                    onChange: (event, selectedDate) => {
                      if (event.type === 'set' && selectedDate) {
                        setStartDate(selectedDate);
                      }
                    },
                  });
                } catch (e) {
                  console.error('Errore apertura DateTimePickerAndroid:', e);
                }
              } else {
                setShowStartPicker(true);
              }
            }}
          />

          <IconButton
            icon={faPlus}
            color={palettes.primary[400]}
            size={fontSizes.lg}
            accessibilityLabel={t('common.add')}
            hitSlop={{ left: spacing[2], right: spacing[2] }}
            onPress={() => {
              navigation.navigate('Form');
            }}
          />

          <TouchableOpacity
            ref={buttonRef}
            onPress={() => setMenuVisible(true)}
          >
            <FontAwesomeIcon
              style={{
                marginRight: spacing[2],
                marginTop: spacing[3],
                marginLeft: spacing[2],
              }}
              icon={faEllipsisVertical}
              size={fontSizes.lg}
              color={palettes.primary[400]}
            />
          </TouchableOpacity>
        </Row>
      ),
    });
  }, [navigation, startDate, spacing, fontSizes.lg, palettes.primary, t]);

  const normalizeDate = (date: Date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const groupedAgendaItems = useMemo(() => {
    const filteredAgendaItems = agendaItems.filter(
      item => normalizeDate(new Date(item.date)) >= normalizeDate(startDate),
    );

    const grouped: { [date: string]: typeof agendaItems } = {};
    filteredAgendaItems.forEach(item => {
      const dateKey = format(normalizeDate(new Date(item.date)), 'yyyy-MM-dd');
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(item);
    });

    Object.entries(grouped).forEach(([_, events]) => {
      events.sort((a, b) => {
        const [aHours, aMinutes] = a.time.split(':').map(Number);
        const [bHours, bMinutes] = b.time.split(':').map(Number);
        return aHours !== bHours ? aHours - bHours : aMinutes - bMinutes;
      });
    });

    return Object.entries(grouped).sort(
      ([dateA], [dateB]) =>
        new Date(dateA).getTime() - new Date(dateB).getTime(),
    );
  }, [agendaItems, startDate]);

  return (
    <View style={styles.container}>
      <Popover
        isVisible={isMenuVisible}
        from={buttonRef.current}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity>
          <Text style={styles.menuItem}>{t('other.refresh')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AgendaWeek');
            setMenuVisible(false);
          }}
        >
          <Text style={styles.menuItem}>{t('other.weeklyLayout')}</Text>
        </TouchableOpacity>
      </Popover>

      {Platform.OS === 'ios' && showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="datetime"
          display="spinner"
          onChange={(event, selectedDate) => {
            if (event.type === 'set' && selectedDate) {
              setStartDate(selectedDate);
            }
            setShowStartPicker(false);
          }}
        />
      )}

      <FlatList
        data={groupedAgendaItems}
        initialNumToRender={1}
        keyExtractor={([date]) => date}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={[styles.listContainer, marginHorizontal]}
        scrollEventThrottle={100}
        onEndReachedThreshold={0.3}
        ListFooterComponent={<BottomBarSpacer />}
        renderItem={({ item: [_date, items] }) => {
          return (
            <>
              {items.map((item, idx) => (
                <View key={idx} style={{ flexDirection: 'row' }}>
                  <View style={{ width: '20%' }}>
                    {idx === 0 && (
                      <View
                        style={{
                          alignItems: 'center',
                          marginRight: 8,
                          marginTop: 8,
                        }}
                      >
                        {(() => {
                          const isToday =
                            format(new Date(item.date), 'yyyy-MM-dd') ===
                            format(new Date(), 'yyyy-MM-dd');
                          const dayLabel = format(new Date(item.date), 'EEE', {
                            locale,
                          });
                          const dayNumber = format(new Date(item.date), 'd');

                          return (
                            <View
                              style={{
                                backgroundColor: isToday
                                  ? palettes.primary[700]
                                  : undefined,
                                borderRadius: 8,
                                paddingHorizontal: 6,
                                paddingVertical: 4,
                                alignItems: 'center',
                              }}
                            >
                              <Text
                                variant="title"
                                style={{
                                  color: isToday ? colors.white : undefined,
                                }}
                              >
                                {dayLabel.charAt(0).toUpperCase() +
                                  dayLabel.slice(1)}
                              </Text>
                              <Text
                                variant="title"
                                style={{
                                  color: isToday ? colors.white : undefined,
                                }}
                              >
                                {dayNumber}
                              </Text>
                            </View>
                          );
                        })()}
                      </View>
                    )}
                  </View>
                  <AgendaCard
                    style={{ flex: 1 }}
                    title={item.title}
                    color={palettes.info[500]}
                    type={
                      item.type === 'lezione'
                        ? t('common.lecture')
                        : t('other.appointment')
                    }
                    time={item.time}
                    location={item.location}
                    onPress={() => {
                      selectCourseByName(item.title);
                      setSelectedAgendaItem(item);
                      navigation.navigate('SingleElement');
                    }}
                  />
                </View>
              ))}
            </>
          );
        }}
      />
    </View>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    separator: {
      height: spacing[8],
    },
    container: { flex: 1 },
    listContainer: {
      paddingLeft: spacing[1],
      paddingRight: spacing[3],
      paddingVertical: spacing[5],
    },
    menuItem: {
      padding: 10,
      fontSize: 16,
    },
  });
