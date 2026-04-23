import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

import { useCourses } from '../../../core/contexts/CoursesContext';

// TODO: replace with real values from the file picker / API response
const DEFAULT_FILE_SIZE = 100;
const DEFAULT_MIME_TYPE = 'pdf';

export const ModifyFileScreen = () => {
  const navigation = useNavigation();
  const { selectedCourse, updateCourseFile, selectedFile } = useCourses();
  const { t } = useTranslation();
  useTheme();
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
      size: DEFAULT_FILE_SIZE, // Dimensione del file, se disponibile
      mimeType: DEFAULT_MIME_TYPE, // Tipo MIME di default
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
        <Text variant="heading" style={styles.headerTitle}>
          {t('courseFilesTab.modifyFileTitle', { defaultValue: 'Edit file' })}
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
  }, [navigation, styles.headerTitle, t]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Text variant="heading" style={styles.sectionTitle}>
            {t('common.title', { defaultValue: 'Title' })}
          </Text>
          <TextInput
            placeholder={
              t('courseFilesTab.insertFileTitle', {
                defaultValue: 'Enter file title',
              }) ?? ''
            }
            value={title}
            onChangeText={setTitle}
            style={styles.textInput}
          />
        </Card>

        <Card style={styles.card}>
          <Text variant="heading" style={styles.sectionTitle}>
            {t('other.folder', { defaultValue: 'Folder' })}
          </Text>
          <Select
            label={t('other.selectDirectory', {
              defaultValue: 'Select directory',
            })}
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

        <Card style={styles.uploadCard}>
          <IconButton
            icon={faFileUpload}
            onPress={() => {}}
            noPadding
            size={40}
          />
          <Text>{t('other.uploadFile', { defaultValue: 'Upload file' })}</Text>
        </Card>
      </View>
      <CtaButton
        title={t('courseFilesTab.confirmEdit', {
          defaultValue: 'Confirm edit',
        })}
        action={handlePublish}
        absolute={false}
        variant="filled"
        disabled={!title || !selectedDirectory}
      />
    </GestureHandlerRootView>
  );
};

const createStyles = ({ palettes, spacing, fontSizes }: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
    headerTitle: {
      marginLeft: 85,
    },
    container: {
      flex: 1,
      paddingBottom: spacing[6], // Distanza tra il contenuto e il fondo per il bottone
    },
    card: {
      marginBottom: spacing[4], // Distanza dal bordo inferiore
    },
    sectionTitle: {
      marginLeft: 15,
      marginTop: 5,
      color: palettes.gray[800],
    },
    textInput: {
      borderBottomWidth: 0,
      padding: spacing[2],
      marginLeft: 10,
      fontSize: fontSizes.md,
      color: palettes.gray[600],
    },
    uploadCard: {
      width: 100,
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
  });
