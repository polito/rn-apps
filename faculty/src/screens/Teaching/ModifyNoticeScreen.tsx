import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';

import React, { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, TextInput, View } from 'react-native';

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
import { Text } from '../../ui/components/Text';
import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { useTheme } from '../../ui/hooks/useTheme';
import { Theme } from '../../ui/types/Theme';

// Gestione compatibile del cambio data
const handleDateChange = (
  event: DateTimePickerEvent,
  selectedDate: Date | undefined,
  setShowPicker: React.Dispatch<React.SetStateAction<boolean>>,
  setDate: React.Dispatch<React.SetStateAction<Date>>,
) => {
  if (event?.type === 'set' && selectedDate) {
    setDate(selectedDate);
  }
  setShowPicker(false); // Chiude comunque
};

const handleDateChangeNullable = (
  event: DateTimePickerEvent,
  selectedDate: Date | undefined,
  setShowPicker: React.Dispatch<React.SetStateAction<boolean>>,
  setDate: React.Dispatch<React.SetStateAction<Date | null>>,
) => {
  if (event?.type === 'set' && selectedDate) {
    setDate(selectedDate);
  }
  setShowPicker(false); // Chiude comunque
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${day}-${month}`;
};

const parseDateString = (dateStr: string | undefined): Date | null => {
  if (!dateStr || dateStr === 'Mai') return null;
  const [year, day, month] = dateStr.split('-').map(Number);
  if (!year || !day || !month) return null;
  return new Date(year, month - 1, day);
};

export const ModifyNoticeScreen = () => {
  const {
    selectedCourse,
    updateCourseNotice,
    selectedNotice,
    setSelectedNotice,
  } = useCourses();

  const navigation = useNavigation();
  const { colors, spacing } = useTheme();
  const { t } = useTranslation();
  const [title, setTitle] = useState(selectedNotice?.title || '');
  const [description, setDescription] = useState(selectedNotice?.content || '');
  const styles = useStylesheet(createStyles);
  const [startDate, setStartDate] = useState<Date>(
    selectedNotice?.startDate
      ? (parseDateString(selectedNotice.startDate) ?? new Date())
      : new Date(),
  );

  const [endDate, setEndDate] = useState<Date | null>(
    selectedNotice?.endDate ? parseDateString(selectedNotice.endDate) : null,
  );

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleModify = () => {
    if (!selectedNotice || !selectedCourse) return;

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = endDate ? formatDate(endDate) : 'Mai';

    const noticeToUpdate = {
      id: selectedNotice.id,
      title,
      content: description,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      visible: selectedNotice.visible,
    };

    updateCourseNotice(selectedCourse.id, selectedNotice.id, noticeToUpdate);
    setSelectedNotice(noticeToUpdate);
    navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          variant="heading"
          style={{ marginLeft: Platform.OS === 'android' ? 70 : 0 }}
        >
          Modifica avviso
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Card style={{ marginBottom: spacing[4] }}>
          <Text variant="heading" style={styles.label}>
            {t('other.title')}
          </Text>
          <TextInput
            placeholder="Inserisci il titolo"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
        </Card>

        <Card style={{ marginBottom: spacing[4] }}>
          <Text variant="heading" style={styles.label}>
            {t('other.description')}
          </Text>
          <TextInput
            placeholder="Descrizione"
            value={description}
            onChangeText={setDescription}
            multiline
            style={[styles.input, { minHeight: 100 }]}
          />
        </Card>

        <Card style={{ marginBottom: spacing[4] }}>
          <Text variant="heading" style={styles.label}>
            {t('other.setValidity')}
          </Text>

          <DateRow
            label="Data inizio"
            date={formatDate(startDate)}
            onPressCalendar={() => setShowStartPicker(true)}
          />

          <DateRow
            label="Data fine"
            date={endDate ? formatDate(endDate) : null}
            onPressCalendar={() => setShowEndPicker(true)}
            onClear={() => setEndDate(null)}
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

        {showEndPicker && (
          <DateTimePicker
            value={endDate ?? new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) =>
              handleDateChangeNullable(
                event,
                date,
                setShowEndPicker,
                setEndDate,
              )
            }
          />
        )}

        <View style={{ marginBottom: spacing[8] }} />
      </ScrollView>

      <CtaButton
        title="Conferma modifica"
        action={handleModify}
        absolute={false}
        variant="filled"
      />
    </GestureHandlerRootView>
  );
};

const createStyles = ({ colors, palettes }: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 20,
    },
    label: {
      marginLeft: 15,
      marginTop: 5,
      color: colors.primary[700],
    },
    input: {
      borderBottomWidth: 0,
      padding: 12,
      marginLeft: 10,
      fontSize: 16,
      color: palettes.gray[800],
    },
  });
