import { GestureHandlerRootView } from 'react-native-gesture-handler';

import React, { useLayoutEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faFileUpload, faVideo } from '@fortawesome/free-solid-svg-icons';
import {
  Card,
  IconButton,
  Row,
  Select,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

import { useCourses } from '../../core/contexts/CoursesContext';

// Funzione per gestire il cambio della data
const handleDateChange = (
  event: DateTimePickerEvent,
  selectedDate: Date | undefined,
  setShowPicker: React.Dispatch<React.SetStateAction<boolean>>,
  setDate: React.Dispatch<React.SetStateAction<Date>>,
) => {
  // Controllo se l'evento ha il tipo 'set' (data selezionata) o 'dismissed' (chiusura senza selezione)
  if (event.type === 'set' && selectedDate) {
    // Se l'evento è 'set' e la data è valida, aggiorniamo la data e chiudiamo il picker
    setShowPicker(false);
    setDate(selectedDate);
  } else if (event.type === 'dismissed') {
    // Se l'evento è 'dismissed' (su iOS), chiudiamo semplicemente il picker
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

export const FormScreen = () => {
  const navigation = useNavigation();
  const { colors, spacing } = useTheme();
  const styles = useStylesheet(createStyles);
  const [formType, setFormType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [selectedDirectory, setSelectedDirectory] = useState<string>(''); // Nuovo stato per directory
  const { selectedCourse, addNoticeToCourse, addMaterialToCourse, addLesson } =
    useCourses();
  const [selectedStartSlot, setSelectedStartSlot] = useState('');
  const [selectedEndSlot, setSelectedEndSlot] = useState('');
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, '0'); // Padroneggia il giorno
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Padroneggia il mese (ricorda che il mese è 0-based)

    return `${year}-${day}-${month}`;
  };

  const handlePublish = () => {
    if (formType === 'avviso' && selectedCourse?.id != null) {
      const lastId =
        selectedCourse.notices.length > 0
          ? Math.max(...selectedCourse.notices.map(notice => notice.id))
          : 0;
      const newId = lastId + 1;

      const formattedStartDate = startDate
        .toISOString()
        .slice(0, 16)
        .replace('T', ' ');
      const formattedEndDate = endDate
        .toISOString()
        .slice(0, 16)
        .replace('T', ' ');

      const Notice = {
        id: newId,
        title,
        content: description,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        visible: true, // ATTENZIONE
      };
      addNoticeToCourse(selectedCourse?.id, Notice);
    }

    // Gestire la parte 'materiale'
    if (
      formType === 'materiale' &&
      selectedCourse?.id != null &&
      selectedDirectory &&
      title
    ) {
      // Trova l'ID massimo tra tutti i file del corso
      const allFiles = selectedCourse.directories.flatMap(dir => dir.files);
      const lastFileId =
        allFiles.length > 0 ? Math.max(...allFiles.map(f => f.id)) : 0;
      const newFileId = lastFileId + 1; // Incremento di 1 per il nuovo file

      const newMaterial = {
        id: newFileId,
        name: title,
        date: new Date().toISOString(),
        size: 100, // Dimensione del file, se disponibile
        mimeType: 'pdf', // Tipo MIME di default
        dirId: Number(selectedDirectory),
      };

      addMaterialToCourse(
        selectedCourse.id,
        Number(selectedDirectory),
        newMaterial,
      );
    }

    if (
      formType === 'lezione' &&
      selectedCourse?.id != null &&
      title &&
      startDate
    ) {
      const lastLessonId =
        selectedCourse.lessons && selectedCourse.lessons.length > 0
          ? Math.max(...selectedCourse.lessons.map(lesson => lesson.id))
          : 0;
      const newLessonId = lastLessonId + 1;

      const formattedDate = startDate.toISOString().slice(0, 10); // Formattazione della data YYYY-MM-DD

      const formattedTime = `${selectedStartSlot} - ${selectedEndSlot}`;

      const newLesson = {
        id: newLessonId,
        title,
        date: formattedDate,
        time: formattedTime,
        content: description,
      };

      addLesson(selectedCourse.id, newLesson);
    }

    navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Crea Nuovo Elemento',
      headerLeft: () => (
        <IconButton icon={faArrowLeft} onPress={() => navigation.goBack()} />
      ),
    });
  }, [navigation, colors]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Card style={{ marginBottom: spacing[4] }}>
          <Select
            label="Tipo di contenuto"
            value={formType}
            onSelectOption={setFormType}
            options={[
              { id: 'avviso', title: 'Avviso' },
              { id: 'materiale', title: 'Materiale' },
              { id: 'lezione', title: 'Lezione' },
            ]}
          />
        </Card>

        {formType && (
          <>
            <Card style={{ marginBottom: spacing[4] }}>
              <TextInput
                placeholder="Titolo"
                value={title}
                onChangeText={setTitle}
                style={{
                  borderBottomWidth: 0,
                  padding: spacing[2],
                  marginBottom: spacing[4],
                  marginLeft: 10,
                  fontSize: 16,
                }}
              />
            </Card>

            {formType === 'avviso' && (
              <>
                <Card style={{ marginBottom: spacing[4] }}>
                  <TextInput
                    placeholder="Descrizione"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    style={{
                      borderBottomWidth: 0,
                      padding: spacing[2],
                      marginBottom: spacing[4],
                      marginLeft: 10,
                      fontSize: 16,
                    }}
                  />
                </Card>

                <Card style={{ marginBottom: spacing[4] }}>
                  <Row justify="space-between">
                    <View style={styles.blueButtonContainer}>
                      <TouchableOpacity
                        onPress={() => setShowStartPicker(true)}
                        style={[
                          styles.button,
                          {
                            width: 150,
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                          },
                        ]}
                      >
                        <Text style={styles.buttonText}>Data inizio</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.blueButtonContainer}>
                      <TouchableOpacity
                        onPress={() => setShowEndPicker(true)}
                        style={[
                          styles.button,
                          {
                            width: 150,
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                          },
                        ]}
                      >
                        <Text style={styles.buttonText}>Data fine</Text>
                      </TouchableOpacity>
                    </View>
                  </Row>
                  <Text style={{ marginTop: 20, fontSize: 16, marginLeft: 20 }}>
                    Data inizio: {formatDate(startDate)}
                  </Text>
                  <Text style={{ marginTop: 10, fontSize: 16, marginLeft: 20 }}>
                    Data fine: {formatDate(endDate)}
                  </Text>
                </Card>

                {showStartPicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="datetime"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, date) =>
                      handleDateChange(
                        event,
                        date,
                        setShowStartPicker,
                        setStartDate,
                      )
                    }
                  />
                )}
                {showEndPicker && (
                  <DateTimePicker
                    value={endDate}
                    mode="datetime"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, date) =>
                      handleDateChange(
                        event,
                        date,
                        setShowEndPicker,
                        setEndDate,
                      )
                    }
                  />
                )}
              </>
            )}

            {formType === 'materiale' && (
              <>
                <Card style={{ marginBottom: spacing[4] }}>
                  <Select
                    label="Seleziona Directory"
                    value={selectedDirectory}
                    onSelectOption={setSelectedDirectory}
                    options={
                      selectedCourse?.directories?.map(dir => ({
                        id: dir.id.toString(), // Converti l'ID in stringa
                        title: dir.name,
                      })) || []
                    }
                  />
                </Card>
                <Card
                  style={{
                    width: 100, // Larghezza fissa (puoi modificarla)
                    height: 100, // Stessa altezza per renderla quadrata
                    justifyContent: 'center', // Centra contenuto verticalmente
                    alignItems: 'center', // Centra contenuto orizzontalmente
                    alignSelf: 'center', // Centra la card nello schermo
                  }}
                >
                  <IconButton
                    icon={faFileUpload}
                    onPress={() => {
                      /* Gestione upload PDF */
                    }}
                    noPadding
                    size={40}
                  />
                  <Text>Carica file</Text>
                </Card>
              </>
            )}

            {formType === 'lezione' && (
              <>
                <Card style={{ marginBottom: spacing[4] }}>
                  <TextInput
                    placeholder="Descrizione"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    style={{
                      borderBottomWidth: 0,
                      padding: spacing[2],
                      marginBottom: spacing[4],
                      marginLeft: 10,
                      fontSize: 16,
                    }}
                  />
                </Card>

                <Card style={{ marginBottom: spacing[4] }}>
                  <Row justify="space-between">
                    <View style={{ flex: 1, marginRight: spacing[2] }}>
                      <Select
                        label="Orario Inizio"
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
                        label="Orario Fine"
                        value={selectedEndSlot}
                        onSelectOption={setSelectedEndSlot}
                        options={availableSlots.map(slot => ({
                          id: slot,
                          title: slot,
                        }))}
                      />
                    </View>
                  </Row>
                </Card>

                <Card
                  style={{
                    width: 100, // Larghezza fissa (puoi modificarla)
                    height: 100, // Stessa altezza per renderla quadrata
                    justifyContent: 'center', // Centra contenuto verticalmente
                    alignItems: 'center', // Centra contenuto orizzontalmente
                    alignSelf: 'center', // Centra la card nello schermo
                  }}
                >
                  <IconButton
                    icon={faVideo}
                    onPress={() => {
                      /* Gestione upload PDF */
                    }}
                    noPadding
                    size={40}
                  />
                  <Text style={{ textAlign: 'center' }}>
                    Collega videolezione
                  </Text>
                </Card>
              </>
            )}
          </>
        )}
        <View style={[styles.buttonContainer, styles.blueButtonContainer]}>
          <TouchableOpacity onPress={handlePublish} style={styles.button}>
            <Text style={styles.buttonText}> Pubblica </Text>
          </TouchableOpacity>
        </View>
      </View>
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
      backgroundColor: palettes.lightBlue[500],
      marginHorizontal: 20,
      borderRadius: 8,
      padding: 0,
    },
    button: {
      backgroundColor: palettes.lightBlue[500],
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: colors.white, // Colore del testo del bottone
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
