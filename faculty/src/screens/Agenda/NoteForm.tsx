import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';

import React, { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {
  Card,
  CtaButton,
  IconButton,
  Row,
  Select,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

import { DateRow } from '../../core/components/DateRow';
import { useCourses } from '../../core/contexts/CoursesContext';

const generateTimeSlots = () => {
  const slots: string[] = [];
  const startHour = 8;
  const endHour = 20;
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
    if (hour !== endHour) {
      slots.push(`${String(hour).padStart(2, '0')}:30`);
    }
  }
  return slots;
};

const handleDateChange = <T extends Date | null>(
  event: DateTimePickerEvent,
  selectedDate: Date | undefined,
  setShowPicker: React.Dispatch<React.SetStateAction<boolean>>,
  setDate: React.Dispatch<React.SetStateAction<T>>,
) => {
  if (Platform.OS === 'android') {
    if (event.type === 'set' && selectedDate) {
      setDate(selectedDate as T);
    }
    setShowPicker(false);
  } else {
    if (event.type === 'set' && selectedDate) {
      setDate(selectedDate as T);
    }
  }
};

export const NoteForm = () => {
  const navigation = useNavigation();
  const { colors, spacing, palettes } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const { addAgendaItem, agendaItems } = useCourses();
  const [selectedStartSlot, setSelectedStartSlot] = useState('');
  const [selectedEndSlot, setSelectedEndSlot] = useState('');
  const [eventType, setEventType] = useState<'APPUNTAMENTO' | 'LEZIONE'>(
    'APPUNTAMENTO',
  );
  const [selectedPlace, setSelectedPlace] = useState('');
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon={faArrowLeft}
          size={22}
          onPress={() => navigation.goBack()}
        />
      ),
      headerTitle: () => (
        <Text
          variant="heading"
          style={{
            textAlign: 'center',
            width: '100%',
            marginLeft: Platform.OS === 'android' ? -25 : -55,
          }}
        >
          {t('other.createEvent')}
        </Text>
      ),
    });
  }, [navigation, t]);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formattedStartDate = formatDate(startDate);

  const generateRandomId = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
  };

  const occupiedSlots = agendaItems
    .filter(item => item.date === formattedStartDate)
    .flatMap(item => {
      const [start, end] = item.time.split(' - ');
      const times: string[] = [];
      let current = start;
      while (current < end) {
        times.push(current);
        const [h, m] = current.split(':').map(Number);
        const nextDate = new Date(0, 0, 0, h, m + 30);
        const next = `${String(nextDate.getHours()).padStart(2, '0')}:${String(
          nextDate.getMinutes(),
        ).padStart(2, '0')}`;
        current = next;
      }
      return times;
    });

  const allSlots = generateTimeSlots();
  const freeSlots = allSlots.filter(slot => !occupiedSlots.includes(slot));

  const filteredStartSlots = freeSlots.filter(
    slot => !selectedEndSlot || slot < selectedEndSlot,
  );
  const filteredEndSlots = freeSlots.filter(
    slot => !selectedStartSlot || slot > selectedStartSlot,
  );

  const handlePublish = () => {
    Alert.alert(t('other.confirm'), t('other.alertTextAgenda'), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('other.confirm'),
        onPress: () => {
          const newId = generateRandomId();

          const Item: any = {
            id: newId,
            title,
            time: selectedStartSlot + ' - ' + selectedEndSlot,
            description,
            date: formattedStartDate,
            type: eventType,
          };

          if (eventType === 'LEZIONE') {
            Item.location = selectedPlace;
          }

          addAgendaItem(Item);
          navigation.goBack();
        },
      },
    ]);
  };

  // Funzioni per aprire i picker Android
  const openStartDatePickerAndroid = () => {
    DateTimePickerAndroid.open({
      value: startDate,
      mode: 'date',
      is24Hour: true,
      display: 'default',
      onChange: (event, selectedDate) => {
        if (event.type === 'set' && selectedDate) {
          setStartDate(selectedDate);
        }
        setShowStartPicker(false);
      },
    });
  };

  const openEndDatePickerAndroid = () => {
    DateTimePickerAndroid.open({
      value: endDate ?? new Date(),
      mode: 'date',
      is24Hour: true,
      display: 'default',
      onChange: (event, selectedDate) => {
        if (event.type === 'set' && selectedDate) {
          setEndDate(selectedDate);
        }
        setShowEndPicker(false);
      },
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Card style={{ marginBottom: spacing[4] }}>
          <Text variant="heading" style={styles.label}>
            {t('other.eventType')}
          </Text>
          <Select
            label="Tipo"
            value={eventType}
            onSelectOption={id =>
              setEventType(id as 'APPUNTAMENTO' | 'LEZIONE')
            }
            options={[
              { id: 'APPUNTAMENTO', title: t('other.appointment') },
              { id: 'LEZIONE', title: t('common.lecture') },
            ]}
          />
        </Card>

        {eventType === 'LEZIONE' && (
          <Card style={{ marginBottom: spacing[4] }}>
            <Text variant="heading" style={styles.label}>
              {t('other.selectRoom')}
            </Text>
            <Select
              label="Aula"
              value={selectedPlace}
              onSelectOption={setSelectedPlace}
              options={Array.from({ length: 10 }, (_, i) => ({
                id: `Aula ${i + 1}`,
                title: `Aula ${i + 1}`,
              }))}
            />
          </Card>
        )}

        <Card>
          <Text
            variant="heading"
            style={{ marginLeft: 15, marginTop: 5, color: palettes.gray[800] }}
          >
            {eventType === 'LEZIONE' ? t('other.subject') : t('other.title')}
          </Text>

          {eventType === 'LEZIONE' ? (
            <Select
              label="Materia"
              value={title}
              onSelectOption={setTitle}
              options={[
                { id: 'Matematica', title: 'Matematica' },
                { id: 'Fisica', title: 'Fisica' },
                { id: 'Programmazione', title: 'Programmazione' },
                { id: 'Chimica', title: 'Chimica' },
              ]}
            />
          ) : (
            <TextInput
              placeholder={t('other.insertTitle')}
              value={title}
              onChangeText={setTitle}
              style={{
                borderBottomWidth: 0,
                padding: spacing[2],
                marginLeft: 10,
                fontSize: 16,
                color: palettes.gray[600],
              }}
            />
          )}
        </Card>

        <Card>
          <Text
            variant="heading"
            style={{ marginLeft: 17, marginTop: 5, color: palettes.gray[800] }}
          >
            {t('other.description')}
          </Text>
          <TextInput
            placeholder={t('other.insertDescription')}
            value={description}
            onChangeText={setDescription}
            style={{
              borderBottomWidth: 0,
              padding: spacing[2],
              marginLeft: 10,
              fontSize: 16,
              color: palettes.gray[600],
            }}
          />
        </Card>

        <Card style={{ marginBottom: spacing[4] }}>
          <Text
            variant="heading"
            style={{ marginLeft: 15, marginTop: 5, color: palettes.gray[800] }}
          >
            {t('other.setDate')}
          </Text>

          <DateRow
            label={t('other.date')}
            date={formatDate(startDate)}
            onPressCalendar={() => {
              if (Platform.OS === 'android') {
                openStartDatePickerAndroid();
              } else {
                setShowStartPicker(true);
              }
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 20,
              marginBottom: 15,
              marginTop: 10,
            }}
          >
            {endDate && (
              <TouchableOpacity
                onPress={() => setEndDate(null)}
                style={{
                  marginLeft: 10,
                  backgroundColor: palettes.danger[600],
                  borderRadius: 12,
                  width: 24,
                  height: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontWeight: 'bold',
                    marginTop: -2,
                  }}
                >
                  x
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={() => {
              if (Platform.OS === 'android') {
                openEndDatePickerAndroid();
              } else {
                setShowEndPicker(true);
              }
            }}
            style={{
              padding: 10,
              borderRadius: 5,
              alignSelf: 'flex-start',
              marginLeft: 15,
            }}
          >
            <Text style={{ color: colors.white }}>
              {endDate ? formatDate(endDate) : t('other.selectEndDate')}
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Picker inline iOS */}
        {Platform.OS === 'ios' && showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="datetime"
            display="spinner"
            onChange={(event, date) =>
              handleDateChange(event, date, setShowStartPicker, setStartDate)
            }
          />
        )}

        {Platform.OS === 'ios' && showEndPicker && (
          <DateTimePicker
            value={endDate ?? new Date()}
            mode="datetime"
            display="spinner"
            onChange={(event, date) =>
              handleDateChange(event, date, setShowEndPicker, setEndDate)
            }
          />
        )}

        <Card style={{ marginBottom: spacing[4] }}>
          <Text variant="heading" style={styles.label}>
            {t('other.selectSlot')}
          </Text>
          <Row justify="space-between">
            <View style={{ flex: 1, marginRight: spacing[2] }}>
              <Select
                label={t('other.startTime')}
                value={selectedStartSlot}
                onSelectOption={setSelectedStartSlot}
                options={filteredStartSlots.map(slot => ({
                  id: slot,
                  title: slot,
                }))}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Select
                label={t('other.endTime')}
                value={selectedEndSlot}
                onSelectOption={setSelectedEndSlot}
                options={filteredEndSlots.map(slot => ({
                  id: slot,
                  title: slot,
                }))}
              />
            </View>
          </Row>
        </Card>
      </ScrollView>

      <CtaButton
        title={t('other.uploadEvent')}
        action={handlePublish}
        absolute={false}
        variant="filled"
        disabled={
          !title ||
          !description ||
          !selectedStartSlot ||
          !selectedEndSlot ||
          (eventType === 'LEZIONE' && !selectedPlace)
        }
      />
    </GestureHandlerRootView>
  );
};

const createStyles = ({ palettes }: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 20,
      paddingTop: 10,
    },
    blueButtonContainer: {
      marginHorizontal: 20,
      padding: 0,
    },
    label: {
      marginLeft: 17,
      marginTop: 5,
      color: palettes.gray[800],
    },
  });
