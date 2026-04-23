import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

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
import { useCourseFilesData } from '../hooks/useCourseFilesData';
import { useFileManagement } from '../hooks/useFileManagement';

const formatFolderDetails = (
  totalBytes: number,
  fileCount: number,
  folderCount = 0,
) => {
  if (totalBytes === 0 && fileCount === 0 && folderCount === 0) {
    return undefined;
  }

  const sizeInMb = totalBytes / (1024 * 1024);
  const sizeLabel =
    sizeInMb >= 1
      ? `${Math.round(sizeInMb)} MB`
      : `${(totalBytes / 1024).toFixed(1)} KB`;
  const filesLabel = `${fileCount} ${fileCount === 1 ? 'file' : 'files'}`;
  if (folderCount <= 0) {
    return `${sizeLabel} - ${filesLabel}`;
  }
  const foldersLabel = `${folderCount} ${folderCount === 1 ? 'folder' : 'folders'}`;

  return `${sizeLabel} - ${filesLabel} - ${foldersLabel}`;
};

/** Directory-first files screen. */
export const CourseDirectoryScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<FileStackParamList>>();
  const styles = useStylesheet(createStyles);
  const { selectedCourse } = useCourses();
  const { t } = useTranslation();
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const sortButtonRef = useRef<View>(null);
  const moreButtonRef = useRef<View>(null);
  const [sortAnchorPosition, setSortAnchorPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 170, left: 18 });
  const [menuAnchorPosition, setMenuAnchorPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 170, left: 18 });
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
                path: String(folder.id),
              });
            }
          },
        };
      }),
    [navigation, selectedCourse?.id, sortedDirectories],
  );

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SearchBar value={search} onChangeText={setSearch} />
        <CourseFilesMenu
          sortLabel={
            sortMode === 'nameAsc'
              ? t('courseFilesTab.nameAZ', { defaultValue: 'Name A-Z' })
              : t('courseFilesTab.nameZA', { defaultValue: 'Name Z-A' })
          }
          onSortPress={() => {
            setMenuVisible(false);
            const node = sortButtonRef.current;
            if (node?.measureInWindow) {
              node.measureInWindow(
                (x: number, y: number, w: number, h: number) => {
                  setSortAnchorPosition({
                    top: y + h + 6,
                    left: 18,
                  });
                  setSortMenuVisible(true);
                },
              );
            } else {
              setSortMenuVisible(true);
            }
          }}
          sortButtonRef={sortButtonRef}
          moreButtonRef={moreButtonRef}
          onMorePress={() => {
            setSortMenuVisible(false);
            const node = moreButtonRef.current;
            if (node?.measureInWindow) {
              node.measureInWindow(
                (x: number, y: number, w: number, h: number) => {
                  setMenuAnchorPosition({
                    top: y + h + 6,
                    left: Math.max(18, x + w - 250),
                  });
                  setMenuVisible(true);
                },
              );
            } else {
              setMenuVisible(true);
            }
          }}
        />
        <CourseFilesList files={folderEntries} />
      </ScrollView>

      <CourseFilesContextMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        items={menuItems}
        anchorPosition={menuAnchorPosition}
      />
      <CourseFilesContextMenu
        visible={sortMenuVisible}
        onClose={() => setSortMenuVisible(false)}
        items={sortMenuItems}
        anchorPosition={sortAnchorPosition}
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
    scrollView: {
      flex: 1,
    },
    content: {
      padding: spacing[5],
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: spacing[2],
      flexGrow: 1,
      flexShrink: 0,
      flexBasis: 0,
      alignSelf: 'stretch',
    },
  });
