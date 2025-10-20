import { GestureHandlerRootView } from 'react-native-gesture-handler';

import React, { useEffect, useLayoutEffect, useState } from 'react';
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
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

import { useCourses } from '../../core/contexts/CoursesContext';
import { Card } from '../../ui/components/Card';
import { CtaButton } from '../../ui/components/CtaButton';
import { DateRow } from '../../ui/components/DateRow';
import { IconButton } from '../../ui/components/IconButton';
import { Row } from '../../ui/components/Row';
import { Select } from '../../ui/components/Select';
import { Text } from '../../ui/components/Text';
import { useTheme } from '../../ui/hooks/useTheme';

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

export const LectureFormScreen = () => {
  const navigation = useNavigation();
  const { colors, spacing } = useTheme();
  const { selectedCourse, addLesson } = useCourses();

  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');
  const [selectedStartSlot, setSelectedStartSlot] = useState('');
  const [selectedEndSlot, setSelectedEndSlot] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
  const { t } = useTranslation();
  const staffOptions =
    selectedCourse?.staff.map(member => ({
      id: member.id.toString(),
      title: member.name,
    })) || [];

  const toggleStaffSelection = (id: number) => {
    setSelectedStaff(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id],
    );
  };

  const roomOptions = Array.from({ length: 20 }, (_, i) => ({
    id: `Aula ${i + 1}`,
    title: `Aula ${i + 1}`,
  }));

  const languageOptions = [
    { id: 'italiano', title: 'Italiano' },
    { id: 'inglese', title: 'Inglese' },
  ];

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${day}-${month}`;
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

  const handlePublish = () => {
    if (
      !selectedCourse?.id ||
      !selectedType ||
      !description ||
      !selectedLanguage ||
      !selectedRoom ||
      selectedStaff.length === 0 ||
      !selectedStartSlot ||
      !selectedEndSlot
    ) {
      return;
    }

    Alert.alert(t('other.confirm'), t('other.alertLecture'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.upload'),
        onPress: () => {
          const lastLessonId = selectedCourse.lessons?.length
            ? Math.max(...selectedCourse.lessons.map(lesson => lesson.id))
            : 0;

          const existingLessonsOfType =
            selectedCourse.lessons?.filter(lesson =>
              lesson.title.startsWith(selectedType),
            ) ?? [];

          const nextIndex = existingLessonsOfType.length + 1;
          const generatedTitle = `${selectedType} ${nextIndex}`;

          const newLesson = {
            id: lastLessonId + 1,
            title: generatedTitle,
            date: formatDate(startDate),
            time: `${selectedStartSlot} - ${selectedEndSlot}`,
            content: description,
            room: selectedRoom,
            language: selectedLanguage,
            staff: selectedCourse.staff.filter(member =>
              selectedStaff.includes(member.id),
            ),
          };

          addLesson(selectedCourse.id, newLesson);
          navigation.goBack();
        },
      },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text variant="heading" style={{ marginLeft: 80 }}>
          {t('other.createLesson')}
        </Text>
      ),
      headerLeft: () => (
        <IconButton
          icon={faArrowLeft}
          size={22}
          onPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation, colors]);

  const filteredStartSlots = availableSlots.filter(
    slot => !selectedEndSlot || slot < selectedEndSlot,
  );
  const filteredEndSlots = availableSlots.filter(
    slot => !selectedStartSlot || slot > selectedStartSlot,
  );

  useEffect(() => {
    if (
      selectedStartSlot &&
      selectedEndSlot &&
      selectedEndSlot <= selectedStartSlot
    ) {
      setSelectedEndSlot('');
    }
  }, [selectedStartSlot]);

  useEffect(() => {
    if (
      selectedStartSlot &&
      selectedEndSlot &&
      selectedStartSlot >= selectedEndSlot
    ) {
      setSelectedStartSlot('');
    }
  }, [selectedEndSlot]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Card>
          <Text variant="heading" style={styles.label}>
            {t('other.type')}
          </Text>
          <Select
            label={t('other.selectType')}
            value={selectedType}
            onSelectOption={setSelectedType}
            options={[
              { id: 'Lezione', title: 'Lezione' },
              { id: 'Esercitazione', title: 'Esercitazione' },
            ]}
          />
        </Card>

        <Card>
          <Text variant="heading" style={styles.label}>
            {t('other.topic')}
          </Text>
          <TextInput
            placeholder={t('other.enterTopic')}
            value={description}
            onChangeText={setDescription}
            style={[styles.input, { color: colors.formPlaceHolder }]}
          />
        </Card>

        <Card>
          <Text variant="heading" style={styles.label}>
            {t('other.roomAndLanguage')}
          </Text>
          <Row style={{ gap: spacing[2] }}>
            <View style={{ flex: 1 }}>
              <Select
                label={t('other.selectRoom')}
                value={selectedRoom}
                onSelectOption={setSelectedRoom}
                options={roomOptions}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Select
                label={t('other.selectLanguage')}
                value={selectedLanguage}
                onSelectOption={setSelectedLanguage}
                options={languageOptions}
              />
            </View>
          </Row>
        </Card>

        <Card style={{ marginBottom: spacing[4] }}>
          <Text variant="heading" style={styles.label}>
            {t('other.lessonTime')}{' '}
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
          <Text
            variant="heading"
            style={{ marginLeft: 15, marginTop: 5, color: colors.formTitle }}
          >
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

        <Card>
          <Text variant="heading" style={styles.label}>
            {t('other.selectStaff')}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              paddingHorizontal: 10,
            }}
          >
            {selectedCourse?.staff.map(member => {
              const isSelected = selectedStaff.includes(member.id);
              return (
                <TouchableOpacity
                  key={member.id}
                  onPress={() => toggleStaffSelection(member.id)}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    backgroundColor: isSelected ? '#007AFF' : '#eee',
                    borderRadius: 20,
                    margin: 4,
                  }}
                >
                  <Text style={{ color: isSelected ? 'white' : '#333' }}>
                    {member.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>
      </View>

      <CtaButton
        title={t('other.publishLesson')}
        action={handlePublish}
        absolute={false}
        variant="filled"
        disabled={
          !selectedType ||
          !description ||
          !selectedLanguage ||
          !selectedRoom ||
          selectedStaff.length === 0 ||
          !selectedStartSlot ||
          !selectedEndSlot
        }
      />
    </GestureHandlerRootView>
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
