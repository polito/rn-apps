import React, { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
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
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DateRow } from '../../../core/components/DateRow';
import { ProfileStackParamList } from '../../../screens/Servizi/ServiceNavigator';
import { useBookings } from '../hooks/useBookings';

const availableSlots = [
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',

  '11:30',
  '12:00',
  '12:30',

  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
];

const places = ['Saletta studi 1', 'Saletta studi 2', 'Sala Riunioni 1'];
export const BookStructureForm = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { spacing, palettes } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedStartSlot, setSelectedStartSlot] = useState('');
  const [selectedEndSlot, setSelectedEndSlot] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [description, setDescription] = useState('');
  const { addBooking, bookings } = useBookings();

  const getAvailablePlaces = () => {
    if (!startDate || !selectedStartSlot || !selectedEndSlot) return places;

    const selectedDateStr = formatDate(startDate);

    const isOverlapping = (timeRange1: string, timeRange2: string) => {
      const [start1, end1] = timeRange1.split(' - ').map(time => time.trim());
      const [start2, end2] = timeRange2.split(' - ').map(time => time.trim());
      return start1 < end2 && start2 < end1; // controllo sovrapposizione
    };

    const occupiedPlaces = bookings
      .filter(
        booking =>
          booking.date === selectedDateStr &&
          isOverlapping(
            booking.time,
            `${selectedStartSlot} - ${selectedEndSlot}`,
          ),
      )
      .map(booking => booking.where);

    return places.filter(place => !occupiedPlaces.includes(place));
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
    setShowPicker: React.Dispatch<React.SetStateAction<boolean>>,
    setDate: React.Dispatch<React.SetStateAction<Date>>,
  ) => {
    if (event.type === 'set' && selectedDate) {
      setShowPicker(false);
      setDate(selectedDate);
    } else if (event.type === 'dismissed') {
      setShowPicker(false);
    }
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${day}-${month}`;
  };

  const filteredEndSlots = availableSlots.filter(
    slot => !selectedStartSlot || slot > selectedStartSlot,
  );

  const generateRandomId = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
  };

  const handlePublish = () => {
    Alert.alert(t('other.confirm'), t('other.alertBooking'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('other.confirm'),
        onPress: () => {
          const newId = generateRandomId();
          const formattedStartDate = formatDate(startDate);

          const Booking = {
            id: newId,
            type: 2,
            title: `Richiesta spazio #${Math.floor(
              10000 + Math.random() * 90000,
            )}`,
            where: selectedPlace,
            content: description,
            date: formattedStartDate,
            time: selectedStartSlot + ' - ' + selectedEndSlot,
            details: description,
            status: 'in attesa',
          };

          addBooking(Booking);
          navigation.goBack();
        },
      },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon={faArrowLeft}
          size={22}
          onPress={() => navigation.navigate('PrenotaSpaziStrutture')}
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
          {t('other.bookStructurePlaces')}
        </Text>
      ),
    });
  }, [navigation, t]);

  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Card>
          <Text variant="heading" style={styles.label}>
            {t('other.selectDate')}
          </Text>
          <DateRow
            label={t('other.date')}
            date={formatDate(startDate)}
            onPressCalendar={() => setShowStartPicker(true)}
          />
        </Card>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) =>
              handleDateChange(event, date, setShowStartPicker, setStartDate)
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
                options={availableSlots.map(slot => ({
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

        <Card style={{ marginBottom: spacing[4] }}>
          <Text variant="heading" style={styles.label}>
            {t('other.selectLocal')}
          </Text>
          <Select
            label={t('other.noSelection')}
            value={selectedPlace}
            onSelectOption={setSelectedPlace}
            options={getAvailablePlaces().map(place => ({
              id: place,
              title: place,
            }))}
            disabled={!startDate || !selectedStartSlot || !selectedEndSlot}
          />
          {(!startDate || !selectedStartSlot || !selectedEndSlot) && (
            <Text
              style={{
                marginLeft: 17,
                color: palettes.red[500],
                marginTop: 5,
                fontSize: 12,
                marginBottom: 5,
              }}
            >
              {t('other.selectBefore')}
            </Text>
          )}
        </Card>
        <Card>
          <Text
            variant="heading"
            style={{
              marginLeft: 17,
              marginTop: 5,
              color: palettes.gray[800],
            }}
          >
            {t('other.requestReason')}
          </Text>
          <TextInput
            placeholder={t('other.enterDetails')}
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            style={{
              borderBottomWidth: 0,
              padding: spacing[2],
              marginLeft: 10,
              fontSize: 16,
              color: palettes.gray[600],
              minHeight: 50, // puoi regolare l'altezza minima
            }}
          />
        </Card>
        <View style={{ marginBottom: spacing[10] }} />
      </ScrollView>
      <CtaButton
        title={t('other.book')}
        action={() => {
          handlePublish();
        }}
        absolute={false}
        variant="filled"
        disabled={
          !startDate || !selectedStartSlot || !selectedEndSlot || !selectedPlace
        } // Disabilita il pulsante se uno dei campi è vuoto
      />
    </>
  );
};

const createStyles = ({ palettes }: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 20,
      paddingTop: 10,
    },
    label: {
      marginLeft: 17,
      marginTop: 5,
      color: palettes.gray[800],
    },
    input: {
      borderBottomWidth: 0,
      padding: 10,
      marginLeft: 10,
      fontSize: 16,
    },
  });
