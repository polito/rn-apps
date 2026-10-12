import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { SearchBar, Theme, useStylesheet } from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../../core/contexts/CoursesContext';
import { FileStackParamList } from '../../../core/types/navigation';
import { CourseFilesList, FileListItem } from '../components/CourseFilesList';
import {
  CourseFilesMenu,
  CourseFilesMenuItem,
} from '../components/CourseFilesMenu';
import { useCourseFilesData } from '../hooks/useCourseFilesData';
import { useFileManagement } from '../hooks/useFileManagement';
import { formatFolderDetails } from '../utils/formatFolderDetails';

/** Directory-first files screen. */
export const CourseDirectoryScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<FileStackParamList>>();
  const styles = useStylesheet(createStyles);
  const { selectedCourse } = useCourses();
  const { t } = useTranslation();
  const { files, directories } = useCourseFilesData(selectedCourse);

  const { search, setSearch, sortMode, setSortMode, sortedDirectories } =
    useFileManagement({
      files,
      directories,
      initialViewMode: 'folders',
      storageKey: String(selectedCourse?.id ?? 'global'),
    });

  const menuItems: CourseFilesMenuItem[] = [
    {
      id: 'item0',
      title: t('courseFilesTab.select', { defaultValue: 'Select' }),
      onPress: () => {
        if (selectedCourse?.id != null) {
          navigation.navigate('CourseFileMultiSelectScreen', {
            courseId: selectedCourse.id,
          });
        }
      },
    },
    {
      id: 'item1',
      title: t('courseFilesTab.viewFiles', { defaultValue: 'View Files' }),
      onPress: () => {
        if (selectedCourse?.id != null) {
          navigation.navigate('CourseFilesScreen', {
            courseId: selectedCourse.id,
          });
        }
      },
    },
  ];

  const sortMenuItems: CourseFilesMenuItem[] = [
    {
      id: 'item2',
      title: t('courseFilesTab.nameAZ', { defaultValue: 'Name A-Z' }),
      onPress: () => setSortMode('nameAsc'),
      checked: sortMode === 'nameAsc',
    },
    {
      id: 'item3',
      title: t('courseFilesTab.nameZA', { defaultValue: 'Name Z-A' }),
      onPress: () => setSortMode('nameDesc'),
      checked: sortMode === 'nameDesc',
    },
  ];

  const folderEntries: FileListItem[] = useMemo(
    () =>
      sortedDirectories.map(folder => {
        const totalBytes = folder.files.reduce(
          (acc, currentFile) => acc + (currentFile.size ?? 0),
          0,
        );

        return {
          id: `folder-${folder.id}`,
          name: folder.name,
          subtitle: formatFolderDetails(totalBytes, folder.files.length),
          status: 'idle',
          isFolder: true,
          onPress: () => {
            if (selectedCourse?.id != null) {
              navigation.navigate('CourseFilesScreen', {
                courseId: selectedCourse.id,
                directoryId: Number(folder.id),
              });
            }
          },
        };
      }),
    [navigation, selectedCourse?.id, sortedDirectories],
  );

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          label={t('courseDirectoryScreen.search', { defaultValue: 'Search' })}
        />
        <CourseFilesMenu
          sortLabel={
            sortMode === 'nameAsc'
              ? t('courseFilesTab.nameAZ', { defaultValue: 'Name A-Z' })
              : t('courseFilesTab.nameZA', { defaultValue: 'Name Z-A' })
          }
          sortItems={sortMenuItems}
          moreItems={menuItems}
        />
        <CourseFilesList files={folderEntries} fillHeight />
      </View>
    </View>
  );
};

const createStyles = ({ colors, spacing }: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      padding: spacing[5],
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: spacing[2],
    },
  });
