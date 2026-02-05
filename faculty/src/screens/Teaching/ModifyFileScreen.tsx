import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useLayoutEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import {
  Card,
  CtaButton,
  IconButton,
  Select,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';

import { useCourses } from '../../core/contexts/CoursesContext';

// Funzione per gestire il cambio della data (gestione robusta per Android)
// const _handleDateChange = (
//   event: DateTimePickerEvent | undefined,
//   selectedDate: Date | undefined,
//   setShowPicker: React.Dispatch<React.SetStateAction<boolean>>,
//   setDate: React.Dispatch<React.SetStateAction<Date>>,
// ) => {
//   if (!event) {
//     // Evento undefined/null (es. Android chiusura picker senza selezionare)
//     setShowPicker(false);
//     return;
//   }

//   if (event.type === 'set' && selectedDate) {
//     setShowPicker(false);
//     setDate(selectedDate);
//   } else if (event.type === 'dismissed') {
//     setShowPicker(false);
//   }
// };

export const ModifyFileScreen = () => {
  const navigation = useNavigation();
  const { selectedCourse, updateCourseFile, selectedFile } = useCourses();
  const { spacing, palettes } = useTheme();
  const styles = useStylesheet(createStyles);
  const [title, setTitle] = useState(selectedFile?.name ?? '');
  const [selectedDirectory, setSelectedDirectory] = useState(
    selectedFile?.dirId.toString() ?? '',
  );

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
  }, [navigation]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Card style={{ marginBottom: spacing[4] }}>
          <Text
            variant="heading"
            style={{
              marginLeft: 15,
              marginTop: 5,
              color: palettes.gray[800],
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
              color: palettes.gray[600],
            }}
          />
        </Card>

        <Card style={{ marginBottom: spacing[4] }}>
          <Text
            variant="heading"
            style={{
              marginLeft: 15,
              marginTop: 5,
              color: palettes.gray[800],
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

const createStyles = ({ colors, palettes }: Theme) =>
  StyleSheet.create({
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
      backgroundColor: palettes.primary[500],
      marginHorizontal: 20,
      borderRadius: 8,
      padding: 0,
    },
    button: {
      backgroundColor: palettes.primary[500],
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
