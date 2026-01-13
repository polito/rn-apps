import { GestureHandlerRootView } from 'react-native-gesture-handler';

import React, { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
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
import { Text } from '../../ui/components/Text';
import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { useTheme } from '../../ui/hooks/useTheme';
import { Theme } from '../../ui/types/Theme';

// Gestione sicura e compatibile dei date picker
const handleDateChange = <T extends Date | null>(
  event: DateTimePickerEvent | undefined,
  selectedDate: Date | undefined,
  setShowPicker: React.Dispatch<React.SetStateAction<boolean>>,
  setDate: React.Dispatch<React.SetStateAction<T>>,
) => {
  if (!event) {
    setShowPicker(false);
    return;
  }

  if (event.type === 'set' && selectedDate) {
    setDate(selectedDate as T);
  }
  setShowPicker(false);
};

export const NoticeFormScreen = () => {
  const navigation = useNavigation();
  const { colors, spacing } = useTheme();
  const styles = useStylesheet(createStyles);
  const { selectedCourse, addNoticeToCourse } = useCourses();
  const { t } = useTranslation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${day}-${month}`;
  };

  const handlePublish = () => {
    Alert.alert(t('other.confirm'), t('other.alertNotice'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('other.publish'),
        style: 'default',
        onPress: () => {
          if (selectedCourse?.id != null) {
            const lastId =
              selectedCourse.notices.length > 0
                ? Math.max(...selectedCourse.notices.map(notice => notice.id))
                : 0;
            const newId = lastId + 1;

            const formattedStartDate = formatDate(startDate);
            const formattedEndDate = endDate ? formatDate(endDate) : null;

            const newNotice = {
              id: newId,
              title,
              content: description,
              startDate: formattedStartDate,
              ...(formattedEndDate && { endDate: formattedEndDate }),
              visible: true,
            };

            addNoticeToCourse(selectedCourse?.id, newNotice);
            navigation.goBack();
          }
        },
      },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          variant="heading"
          style={{ marginLeft: Platform.OS === 'android' ? 60 : 0 }}
        >
          {t('other.createNewNotice')}
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
  }, [navigation, colors, t]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Card>
          <Text variant="heading" style={styles.label}>
            {t('other.title')}
          </Text>
          <TextInput
            placeholder={t('other.insertTitle')}
            value={title}
            onChangeText={setTitle}
            style={[styles.input, { color: colors.formPlaceHolder }]}
          />
        </Card>

        <Card>
          <Text variant="heading" style={styles.label}>
            {t('other.description')}
          </Text>
          <TextInput
            placeholder={t('other.insertDescription')}
            value={description}
            onChangeText={setDescription}
            multiline
            style={[styles.input, { color: colors.formPlaceHolder }]}
          />
        </Card>

        <Card style={{ marginBottom: spacing[4] }}>
          <Text variant="heading" style={styles.label}>
            {t('other.setValidity')}
          </Text>

          <DateRow
            label={t('other.startDate')}
            date={formatDate(startDate)}
            onPressCalendar={() => setShowStartPicker(true)}
          />

          <DateRow
            label={t('other.endDate')}
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
              handleDateChange(event, date, setShowEndPicker, setEndDate)
            }
          />
        )}
      </ScrollView>

      <CtaButton
        title={t('other.publishNotice')}
        action={handlePublish}
        absolute={false}
        variant="filled"
        disabled={!title || !description}
      />
    </GestureHandlerRootView>
  );
};

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 20,
      paddingTop: 10,
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
    },
  });
