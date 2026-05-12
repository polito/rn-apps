import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import {
  Card,
  CtaButton,
  IconButton,
  Select,
  Text,
  TextField,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useCourses } from '../../../core/contexts/CoursesContext';

type ModifyFileRouteParams = { courseId: number; fileId: string };

export const ModifyFileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { fakeCourses, updateCourseFile } = useCourses();
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const [title, setTitle] = useState('');
  const [selectedDirectory, setSelectedDirectory] = useState('');

  const { courseId, fileId } = route.params as ModifyFileRouteParams;
  const course = useMemo(
    () => fakeCourses.find(currentCourse => currentCourse.id === courseId),
    [courseId, fakeCourses],
  );
  const file = useMemo(() => {
    if (!course) {
      return undefined;
    }

    for (const directory of course.directories) {
      const match = directory.files.find(
        currentFile => String(currentFile.id) === fileId,
      );
      if (match) {
        return { ...match, dirId: directory.id };
      }
    }

    return undefined;
  }, [course, fileId]);

  useEffect(() => {
    setTitle(file?.name ?? '');
    setSelectedDirectory(file?.dirId?.toString() ?? '');
  }, [file]);

  const handlePublish = () => {
    if (!course) return;
    if (!file) return;
    if (!title) return;
    if (!selectedDirectory) return;

    const newMaterial = {
      id: file.id,
      name: title,
      date: file.date,
      size: file.size,
      mimeType: file.mimeType,
      dirId: Number(selectedDirectory),
    };

    updateCourseFile(
      course.id,
      file.id,
      newMaterial,
      Number(selectedDirectory),
    );

    navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text variant="heading">
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
  }, [navigation, t]);

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Text variant="heading" style={styles.sectionTitle}>
            {t('courseFilesTab.fileTitle', { defaultValue: 'File title' })}
          </Text>
          <TextField
            label={
              t('courseFilesTab.insertFileTitle', {
                defaultValue: 'Enter file title',
              }) ?? ''
            }
            value={title}
            onChangeText={setTitle}
            inputStyle={styles.textInput}
          />
        </Card>

        <Card style={styles.card}>
          <Text variant="heading" style={styles.sectionTitle}>
            {t('courseFilesTab.folder', { defaultValue: 'Folder' })}
          </Text>
          <Select
            label={t('courseFilesTab.selectDirectory', {
              defaultValue: 'Select directory',
            })}
            value={selectedDirectory}
            onSelectOption={setSelectedDirectory}
            options={
              course?.directories?.map(dir => ({
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
          <Text>
            {t('courseFilesTab.uploadFile', { defaultValue: 'Upload file' })}
          </Text>
        </Card>
      </View>
      <CtaButton
        title={t('courseFilesTab.confirmEdit', {
          defaultValue: 'Confirm edit',
        })}
        action={handlePublish}
        absolute={false}
        variant="filled"
        disabled={!file || !title || !selectedDirectory}
      />
    </View>
  );
};

const createStyles = ({ palettes, spacing, fontSizes }: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingBottom: spacing[6],
    },
    card: {
      marginBottom: spacing[4],
    },
    sectionTitle: {
      marginLeft: spacing[3],
      marginTop: spacing[1],
      color: palettes.gray[800],
    },
    textInput: {
      borderBottomWidth: 0,
      padding: spacing[2],
      marginLeft: spacing[2.5],
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
