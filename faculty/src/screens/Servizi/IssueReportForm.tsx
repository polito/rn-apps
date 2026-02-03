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
  Select,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DateRow } from '../../core/components/DateRow';
import { useCourses } from '../../core/contexts/CoursesContext';
import { ProfileStackParamList } from './ServiceNavigator';

const places = [
  'Aula 1',
  'Aula 2',
  'Aula 3',
  'Aula 4',
  'Aula 5',
  'Aula 6',
  'Aula 7',
  'Aula 8',
  'Aula 9',
];
export const IssueReportForm = () => {
  const { t } = useTranslation();
  const { spacing, palettes } = useTheme();
  const styles = useStylesheet(createStyles);
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedPlace, setSelectedPlace] = useState('');
  const [description, setDescription] = useState('');
  const { addIssue } = useCourses();

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

  const generateRandomId = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
  };

  const handlePublish = () => {
    Alert.alert(t('other.confirm'), t('other.alertSegnalation2'), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('other.confirm'),
        onPress: () => {
          const newId = generateRandomId();
          const formattedStartDate = formatDate(startDate);

          const Issue = {
            id: newId,
            type: 0,
            title: `Segnalazione #${Math.floor(10000 + Math.random() * 90000)}`,
            date: formattedStartDate,
            details: description,
            where: selectedPlace,
            status: 'in attesa',
          };

          addIssue(Issue);
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
          onPress={() => navigation.navigate('IssueReport')}
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
          {t('other.newReportFault')}
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
            {t('other.selectPlace')}
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
              color: palettes.gray[800],
            }}
          >
            {t('other.describeFault')}
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
        title={t('other.sendReport')}
        action={() => {
          handlePublish();
        }}
        absolute={false}
        variant="filled"
        disabled={!startDate || !selectedPlace} // Disabilita il pulsante se uno dei campi è vuoto
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
      color: palettes.gray[500],
    },
    input: {
      borderBottomWidth: 0,
      padding: 10,
      marginLeft: 10,
      fontSize: 16,
    },
  });
