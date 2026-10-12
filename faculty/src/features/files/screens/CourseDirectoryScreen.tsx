import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Platform, StyleSheet, View } from 'react-native';

import {
  faChevronDown,
  faChevronUp,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import {
  Icon,
  IconButton,
  IndentedDivider,
  ManagedFileListItem,
  OverviewList,
  SearchBar,
  TextButton,
  Theme,
  useSafeAreaSpacing,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import {
  MenuAction,
  MenuView,
  NativeActionEvent,
} from '@react-native-menu/menu';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../../core/contexts/CoursesContext';
import { useCourseFilesData } from '../hooks/useCourseFilesData';
import { FileSortMode, useFileManagement } from '../hooks/useFileManagement';
import { FileStackParamList } from '../navigation/FileNavigator';
import { FileListEntry } from '../types/FileListEntry';
import { formatFolderDetails } from '../utils/formatFolderDetails';

/** Directory-first files screen. */
export const CourseDirectoryScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<FileStackParamList>>();
  const styles = useStylesheet(createStyles);
  const { selectedCourse } = useCourses();
  const { t } = useTranslation();
  const { paddingHorizontal } = useSafeAreaSpacing();
  const { palettes, fontSizes } = useTheme();
  const [isSortOpen, setSortOpen] = useState(false);
  const { files, directories } = useCourseFilesData(selectedCourse);

  const { search, setSearch, sortMode, setSortMode, sortedDirectories } =
    useFileManagement({
      files,
      directories,
      initialViewMode: 'folders',
      storageKey: String(selectedCourse?.id ?? 'global'),
    });

  const menuActions: MenuAction[] = [
    {
      id: 'select',
      title: t('courseFilesTab.select', { defaultValue: 'Select' }),
    },
    {
      id: 'viewFiles',
      title: t('courseFilesTab.viewFiles', { defaultValue: 'View Files' }),
    },
  ];

  const sortActions: MenuAction[] = [
    {
      id: 'nameAsc',
      title: t('courseFilesTab.nameAZ', { defaultValue: 'Name A-Z' }),
      state: sortMode === 'nameAsc' ? 'on' : 'off',
    },
    {
      id: 'nameDesc',
      title: t('courseFilesTab.nameZA', { defaultValue: 'Name Z-A' }),
      state: sortMode === 'nameDesc' ? 'on' : 'off',
    },
  ];

  const onPressMenuAction = ({ nativeEvent: { event } }: NativeActionEvent) => {
    if (selectedCourse?.id == null) return;
    if (event === 'select') {
      navigation.navigate('CourseFileMultiSelectScreen', {
        courseId: selectedCourse.id,
      });
    } else if (event === 'viewFiles') {
      navigation.navigate('CourseFilesScreen', { courseId: selectedCourse.id });
    }
  };

  const folderEntries: FileListEntry[] = useMemo(
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
        <View style={styles.menuRow}>
          <MenuView
            actions={sortActions}
            onPressAction={({ nativeEvent: { event } }) =>
              setSortMode(event as FileSortMode)
            }
            onOpenMenu={() => setSortOpen(true)}
            onCloseMenu={() => setSortOpen(false)}
          >
            <View style={styles.sortTrigger}>
              <TextButton>
                {sortActions.find(a => a.state === 'on')?.title}
              </TextButton>
              <Icon
                icon={isSortOpen ? faChevronUp : faChevronDown}
                size={fontSizes.md}
                color={palettes.primary[400]}
                style={styles.sortChevron}
              />
            </View>
          </MenuView>
          <MenuView actions={menuActions} onPressAction={onPressMenuAction}>
            <IconButton
              icon={faEllipsisVertical}
              color={palettes.primary[400]}
              size={fontSizes.lg}
              adjustSpacing="right"
              accessibilityLabel={t('common.options', {
                defaultValue: 'Options',
              })}
            />
          </MenuView>
        </View>
        <FlatList
          data={folderEntries}
          contentContainerStyle={paddingHorizontal}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ManagedFileListItem
              name={item.name}
              subtitle={item.subtitle}
              status={item.status}
              onPress={item.onPress}
              isFolder={item.isFolder}
              onLongPress={item.onLongPress}
              onActionPress={item.trailing ? undefined : item.onActionPress}
              trailing={item.trailing}
            />
          )}
          ItemSeparatorComponent={Platform.select({ ios: IndentedDivider })}
          ListEmptyComponent={
            <OverviewList
              emptyStateText={t('courseFilesTab.empty', {
                defaultValue: 'No files yet',
              })}
            />
          }
        />
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
    menuRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'stretch',
    },
    sortTrigger: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sortChevron: {
      marginLeft: spacing[1],
    },
    content: {
      flex: 1,
      padding: spacing[5],
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: spacing[2],
    },
  });
