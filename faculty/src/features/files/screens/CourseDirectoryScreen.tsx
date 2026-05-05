import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Theme, useStylesheet } from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  ContextMenuItem,
  CourseFilesContextMenu,
} from '../../../core/components/CourseFilesContextMenu';
import { CourseFilesMenu } from '../../../core/components/CourseFilesMenu';
import { SearchBar } from '../../../core/components/SearchBar';
import { useCourses } from '../../../core/contexts/CoursesContext';
import { FileStackParamList } from '../../../core/types/navigation';
import {
  CourseFileEntry,
  CourseFilesList,
} from '../components/CourseFilesList';
import { useAnchoredMenu } from '../hooks/useAnchoredMenu';
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
  const sortMenu = useAnchoredMenu();
  const moreMenu = useAnchoredMenu();
  const { files, directories } = useCourseFilesData(selectedCourse);

  const { search, setSearch, sortMode, setSortMode, sortedDirectories } =
    useFileManagement({
      files,
      directories,
      initialViewMode: 'folders',
      storageKey: String(selectedCourse?.id ?? 'global'),
    });

  const menuItems: ContextMenuItem[] = [
    {
      label: t('courseFilesTab.select', { defaultValue: 'Select' }),
      onPress: () => {
        if (selectedCourse?.id != null) {
          navigation.navigate('CourseFileMultiSelectScreen', {
            courseId: selectedCourse.id,
          });
        }
      },
    },
    {
      label: t('courseFilesTab.viewFiles', { defaultValue: 'View Files' }),
      onPress: () => {
        if (selectedCourse?.id != null) {
          navigation.navigate('CourseFilesScreen', {
            courseId: selectedCourse.id,
          });
        }
      },
    },
  ];

  const sortMenuItems: ContextMenuItem[] = [
    {
      label: t('courseFilesTab.nameAZ', { defaultValue: 'Name A-Z' }),
      onPress: () => setSortMode('nameAsc'),
      checked: sortMode === 'nameAsc',
    },
    {
      label: t('courseFilesTab.nameZA', { defaultValue: 'Name Z-A' }),
      onPress: () => setSortMode('nameDesc'),
      checked: sortMode === 'nameDesc',
    },
  ];

  const folderEntries: CourseFileEntry[] = useMemo(
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
        <SearchBar value={search} onChangeText={setSearch} />
        <CourseFilesMenu
          sortLabel={
            sortMode === 'nameAsc'
              ? t('courseFilesTab.nameAZ', { defaultValue: 'Name A-Z' })
              : t('courseFilesTab.nameZA', { defaultValue: 'Name Z-A' })
          }
          onSortPress={() => {
            moreMenu.close();
            sortMenu.openFromRef({
              verticalOffset: 6,
              strategy: { align: 'left', left: 18 },
            });
          }}
          sortButtonRef={sortMenu.buttonRef}
          moreButtonRef={moreMenu.buttonRef}
          onMorePress={() => {
            sortMenu.close();
            moreMenu.openFromRef({
              verticalOffset: 6,
              strategy: { align: 'right', minLeft: 18, menuWidth: 250 },
            });
          }}
        />
        <CourseFilesList files={folderEntries} fillHeight />
      </View>

      <CourseFilesContextMenu
        visible={moreMenu.visible}
        onClose={moreMenu.close}
        items={menuItems}
        anchorPosition={moreMenu.anchorPosition}
      />
      <CourseFilesContextMenu
        visible={sortMenu.visible}
        onClose={sortMenu.close}
        items={sortMenuItems}
        anchorPosition={sortMenu.anchorPosition}
      />
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
