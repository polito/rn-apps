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
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { Card } from '../../ui/components/Card';
import { CtaButton } from '../../ui/components/CtaButton';
import { DateRow } from '../../ui/components/DateRow';
import { IconButton } from '../../ui/components/IconButton';
import { Row } from '../../ui/components/Row';
import { Select } from '../../ui/components/Select';
import { Switch } from '../../ui/components/Switch';
import { Text } from '../../ui/components/Text';
import { useTheme } from '../../ui/hooks/useTheme';
import { ProfileStackParamList } from './ServiceNavigator';

const availableSlots = [
  '08:30',
  '10:00',
  '11:30',
  '13:00',
  '14:30',
  '16:00',
  '17:30',
  '19:00',
];

const places = ['Valentino', 'Centrale'];
export const BookRoomForm = () => {
  const { t } = useTranslation();
  const { spacing, colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedStartSlot, setSelectedStartSlot] = useState('');
  const [selectedEndSlot, setSelectedEndSlot] = useState('');
  const [capacity, setCapacity] = useState('');
  const [hasPowerPlugs, setHasPowerPlugs] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState('');
  const [description, setDescription] = useState('');
  const { addBooking } = useCourses();
  const [selectedChairType, setSelectedChairType] = useState('');
  const chairTypes = [
    t('other.desk1'),
    t('other.desk2'),
    t('other.desk3'),
    t('other.desk4'),
    t('other.notImportant'),
  ];

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

  const filteredStartSlots = availableSlots.filter(
    slot => !selectedEndSlot || slot < selectedEndSlot,
  );
  const filteredEndSlots = availableSlots.filter(
    slot => !selectedStartSlot || slot > selectedStartSlot,
  );

  const generateRandomId = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
  };

  const handlePublish = () => {
    const newId = generateRandomId();
    const formattedStartDate = formatDate(startDate);
    const Booking = {
      id: newId,
      type: 0,
      title: `Richiesta aula #${Math.floor(10000 + Math.random() * 90000)}`,
      content: description,
      date: formattedStartDate,
      time: selectedStartSlot + ' - ' + selectedEndSlot,
      details: description,
      capacity: parseInt(capacity, 10),
      powerOutput: hasPowerPlugs,
      status: 'in attesa',
      chairType: selectedChairType,
    };
    addBooking(Booking);
    navigation.goBack();
  };

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
      headerLeft: () => (
        <IconButton
          icon={faArrowLeft}
          size={22}
          onPress={() => navigation.navigate('PrenotaAula')}
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
          {t('other.requestRoom')}
        </Text>
      ),
    });
  }, [navigation, colors]);

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
            onPressCalendar={() => {
              if (Platform.OS === 'android') {
                openAndroidDatePicker();
              } else {
                setShowStartPicker(true);
              }
            }}
          />
        </Card>
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
            {t('other.selectDeskType')}
          </Text>
          <View style={{ flex: 1, marginRight: spacing[2] }}>
            <Select
              label={t('other.deskType')}
              value={selectedChairType}
              onSelectOption={setSelectedChairType}
              options={chairTypes.map(type => ({
                id: type,
                title: type,
              }))}
            />
          </View>
        </Card>
        <Card style={{ marginBottom: spacing[4] }}>
          <Text variant="heading" style={styles.label}>
            {t('other.capacity')}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderBottomWidth: 1,
                borderColor: '#ccc',
                marginHorizontal: spacing[2],
              },
            ]}
            keyboardType="numeric"
            value={capacity}
            onChangeText={setCapacity}
            placeholder={t('other.enterCapacity')}
          />
        </Card>
        <Card style={{ marginBottom: spacing[4] }}>
          <Row
            justify="space-between"
            style={{
              marginTop: spacing[2],
              alignItems: 'center',
              marginBottom: spacing[2],
            }}
          >
            <Text variant="heading" style={styles.label}>
              {t('other.powerSockets')}
            </Text>
            <Switch value={hasPowerPlugs} onValueChange={setHasPowerPlugs} />
          </Row>
        </Card>
        <Card style={{ marginBottom: spacing[4] }}>
          <Text variant="heading" style={styles.label}>
            {t('other.selectRoomSite')}
          </Text>
          <Select
            label={t('other.noSelection')}
            value={selectedPlace}
            onSelectOption={setSelectedPlace}
            options={places.map(slot => ({ id: slot, title: slot }))}
          />
        </Card>
        <Card>
          <Text
            variant="heading"
            style={{
              marginLeft: 17,
              marginTop: 5,
              color: colors.formTitle,
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
              color: colors.formPlaceHolder,
              minHeight: 50,
            }}
          />
        </Card>
        <View style={{ marginBottom: spacing[10] }} />
      </ScrollView>
      <CtaButton
        title={t('other.sendRequest')}
        action={() => {
          Alert.alert(t('other.confirm'), t('other.alertBooking'), [
            { text: t('common.cancel'), style: 'cancel' },
            {
              text: t('other.confirm'),
              onPress: () => {
                handlePublish();
              },
            },
          ]);
        }}
        absolute={false}
        variant="filled"
        disabled={
          !startDate || !selectedStartSlot || !selectedEndSlot || !selectedPlace
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 10,
  },
  label: {
    marginLeft: 17,
    marginTop: 5,
    color: '#333',
  },
  input: {
    borderBottomWidth: 0,
    padding: 10,
    marginLeft: 10,
    fontSize: 16,
  },
});
