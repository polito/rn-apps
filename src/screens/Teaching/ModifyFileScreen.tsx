import { GestureHandlerRootView } from 'react-native-gesture-handler';

import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

import { useCourses } from '../../core/contexts/CoursesContext';
import { Card } from '../../ui/components/Card';
import { CtaButton } from '../../ui/components/CtaButton';
import { IconButton } from '../../ui/components/IconButton';
import { Select } from '../../ui/components/Select';
import { Text } from '../../ui/components/Text';
import { useTheme } from '../../ui/hooks/useTheme';

// Funzione per gestire il cambio della data (gestione robusta per Android)
const handleDateChange = (
  event: DateTimePickerEvent | undefined,
  selectedDate: Date | undefined,
  setShowPicker: React.Dispatch<React.SetStateAction<boolean>>,
  setDate: React.Dispatch<React.SetStateAction<Date>>,
) => {
  if (!event) {
    // Evento undefined/null (es. Android chiusura picker senza selezionare)
    setShowPicker(false);
    return;
  }

  if (event.type === 'set' && selectedDate) {
    setShowPicker(false);
    setDate(selectedDate);
  } else if (event.type === 'dismissed') {
    setShowPicker(false);
  }
};

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

export const ModifyFileScreen = () => {
  const navigation = useNavigation();
  const { selectedCourse, updateCourseFile, selectedFile } = useCourses();
  const { colors, spacing } = useTheme();

  const [title, setTitle] = useState(selectedFile?.name ?? '');
  const [selectedDirectory, setSelectedDirectory] = useState(
    selectedFile?.dirId.toString() ?? '',
  );

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${year}-${day}-${month}`;
  };

  const handlePublish = () => {
    if (!selectedCourse) return;
    if (!selectedFile) return;
    if (!title) return;
    if (!selectedDirectory) return;

    const newMaterial = {
      id: selectedFile.id,
      name: title,
      date: selectedFile.date,
      size: 100, // Dimensione del file, se disponibile
      mimeType: 'pdf', // Tipo MIME di default
      dirId: Number(selectedDirectory),
    };

    updateCourseFile(
      selectedCourse.id,
      selectedFile.id,
      newMaterial,
      Number(selectedDirectory),
    );

    navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text variant="heading" style={{ marginLeft: 85 }}>
          Modifica file
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
      <View style={styles.container}>
        <Card style={{ marginBottom: spacing[4] }}>
          <Text
            variant="heading"
            style={{
              marginLeft: 15,
              marginTop: 5,
              color: colors.formTitle,
            }}
          >
            Titolo
          </Text>
          <TextInput
            placeholder="Inserisci il titolo"
            value={title}
            onChangeText={setTitle}
            style={{
              borderBottomWidth: 0,
              padding: spacing[2],
              marginLeft: 10,
              fontSize: 16,
              color: colors.formPlaceHolder,
            }}
          />
        </Card>

        <Card style={{ marginBottom: spacing[4] }}>
          <Text
            variant="heading"
            style={{
              marginLeft: 15,
              marginTop: 5,
              color: colors.formTitle,
            }}
          >
            Cartella
          </Text>
          <Select
            label="Seleziona Directory"
            value={selectedDirectory}
            onSelectOption={setSelectedDirectory}
            options={
              selectedCourse?.directories?.map(dir => ({
                id: dir.id.toString(),
                title: dir.name,
              })) || []
            }
          />
        </Card>

        <Card
          style={{
            width: 100,
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}
        >
          <IconButton
            icon={faFileUpload}
            onPress={() => {}}
            noPadding
            size={40}
          />
          <Text>Carica file</Text>
        </Card>
      </View>
      <CtaButton
        title="Conferma modifica"
        action={handlePublish}
        absolute={false}
        variant="filled"
        disabled={!title || !selectedDirectory}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20, // Distanza tra il contenuto e il fondo per il bottone
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 16, // Distanza dal bordo inferiore
  },
  blueButtonContainer: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 0,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
