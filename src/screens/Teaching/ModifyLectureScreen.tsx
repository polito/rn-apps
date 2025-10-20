import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
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

export const ModifyLectureScreen = () => {
  const navigation = useNavigation();
  const { colors, spacing } = useTheme();
  const { selectedCourse, updateCourseLecture, selectedLecture } = useCourses();
  const { t } = useTranslation();

  const [title] = useState(selectedLecture?.title);
  const [description, setDescription] = useState(selectedLecture?.content);
  const [startDate, setStartDate] = useState(
    new Date(selectedLecture?.date || new Date()),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [selectedStartSlot, setSelectedStartSlot] = useState(
    selectedLecture?.time.split('-')[0].trim(),
  );
  const [selectedEndSlot, setSelectedEndSlot] = useState(
    selectedLecture?.time.split('-')[1].trim(),
  );
  const [selectedRoom, setSelectedRoom] = useState(selectedLecture?.room);
  const [selectedLanguage, setSelectedLanguage] = useState(
    selectedLecture?.language,
  );

  const [selectedStaff, setSelectedStaff] = useState<number[]>(
    selectedLecture?.staff?.map(member => member.id) || [],
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          variant="heading"
          style={{ marginLeft: Platform.OS === 'android' ? 70 : 0 }}
        >
          {t('other.modifyLecture')}
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

  if (selectedLecture?.staff == null) return null;

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
    { id: 'Italiano', title: 'Italiano' },
    { id: 'Inglese', title: 'Inglese' },
  ];

  const filteredStartSlots = availableSlots.filter(
    slot => !selectedEndSlot || slot < selectedEndSlot,
  );
  const filteredEndSlots = availableSlots.filter(
    slot => !selectedStartSlot || slot > selectedStartSlot,
  );

  const handleDateChange = (
    event: DateTimePickerEvent | undefined,
    date?: Date,
  ) => {
    if (!event) return;
    if (event.type === 'set' && date) {
      setStartDate(date);
    }
    setShowDatePicker(false);
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${day}-${month}`;
  };

  const handlePublish = () => {
    if (!selectedCourse || !selectedLecture || !title || !description) return;

    const formattedDate = startDate.toISOString().slice(0, 10);
    const formattedTime = `${selectedStartSlot} - ${selectedEndSlot}`;

    const updatedLesson = {
      ...selectedLecture,
      date: formattedDate,
      time: formattedTime,
      content: description,
      room: selectedRoom,
      language: selectedLanguage,
      staff: selectedCourse.staff.filter(member =>
        selectedStaff.includes(member.id),
      ),
    };

    updateCourseLecture(selectedCourse.id, selectedLecture.id, updatedLesson);
    navigation.goBack();
    navigation.goBack();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Card style={{ marginBottom: spacing[4] }}>
          <Text variant="heading" style={styles.label}>
            {t('other.topic')}
          </Text>
          <TextInput
            placeholder={t('other.enterTopic')}
            value={description}
            onChangeText={setDescription}
            multiline
            style={{
              borderBottomWidth: 0,
              padding: spacing[2],
              marginLeft: 10,
              fontSize: 16,
            }}
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
            {t('other.date')}
          </Text>
          <DateRow
            label={t('other.date')}
            date={formatDate(startDate)}
            onPressCalendar={() => setShowDatePicker(true)}
          />
        </Card>
        <Card style={{ marginBottom: spacing[4] }}>
          <Text variant="heading" style={styles.label}>
            {t('other.lessonTime')}
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

      {showDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      <CtaButton
        title={t('common.confirm')}
        action={handlePublish}
        absolute={false}
        variant="filled"
        disabled={
          !title ||
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
  },
  label: {
    marginLeft: 17,
    marginTop: 5,
    color: '#333',
  },
});
