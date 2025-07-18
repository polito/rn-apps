import React, {useLayoutEffect, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Card} from '../../ui/components/Card';
import {Select} from '../../ui/components/Select';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../ui/hooks/useTheme';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {IconButton} from '../../ui/components/IconButton';
import {
  faArrowLeft,
  faEnvelope,
  faFileUpload,
} from '@fortawesome/free-solid-svg-icons';
import {useCourses} from '../../core/contexts/CoursesContext';
import {Text} from '../../ui/components/Text';
import {CtaButton} from '../../ui/components/CtaButton';
import {Platform} from 'react-native';
import { useTranslation } from 'react-i18next';
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 perché i mesi partono da 0
  return `${year}-${day}-${month}`;
};
export const FilesFormScreen = () => {
  const navigation = useNavigation();
  const {colors, spacing} = useTheme();
  const [title, setTitle] = useState('');
  const [selectedDirectory, setSelectedDirectory] = useState<string>('');
  const {selectedCourse, addMaterialToCourse} = useCourses();
  const {t} = useTranslation()
  const handlePublish = () => {
    if (!title || !selectedDirectory || !selectedCourse?.id) return;

    Alert.alert(
      t('other.confirm'),
      t('other.alertFile'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.upload'),
          onPress: () => {
            const allFiles = selectedCourse.directories.flatMap(
              dir => dir.files,
            );
            const lastFileId =
              allFiles.length > 0 ? Math.max(...allFiles.map(f => f.id)) : 0;
            const newFileId = lastFileId + 1;

            const newMaterial = {
              id: newFileId,
              name: title,
              date: formatDate(new Date()),
              size: 100,
              mimeType: 'pdf',
              dirId: Number(selectedDirectory),
            };

            addMaterialToCourse(
              selectedCourse.id,
              Number(selectedDirectory),
              newMaterial,
            );
            navigation.goBack();
          },
        },
      ],
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          variant="heading"
          style={{marginLeft: Platform.OS === 'android' ? 75 : 0}}>
          {t('other.uploadMaterial')}
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
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <Card>
          <Text
            variant="heading"
            style={{
              marginLeft: 15,
              marginTop: 5,
              color: colors.formTitle,
            }}>
            {t('other.title')}
          </Text>
          <TextInput
            placeholder={t('other.insertTitle')}
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

        <Card style={{marginBottom: spacing[4]}}>
          <Text
            variant="heading"
            style={{
              marginLeft: 15,
              marginTop: 5,
              color: colors.formTitle,
            }}>
            {t('other.folder')}
          </Text>
          <Select
            label={t('other.selectDirectory')}
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
          }}>
          <IconButton
            icon={faFileUpload}
            onPress={() => console.log('Gestione upload PDF')}
            noPadding
            size={40}
          />
          <Text>{t('other.uploadFile')}</Text>
        </Card>
      </View>
      <CtaButton
        title={t('other.upload')}
        action={() => {
          handlePublish();
        }}
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
    paddingBottom: 20,
    paddingTop: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 16,
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
