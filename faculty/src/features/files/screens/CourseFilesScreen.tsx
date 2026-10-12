import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, Platform, StyleSheet, View } from 'react-native';

import {
  faChevronDown,
  faChevronUp,
  faEllipsisVertical,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import {
  CtaButton,
  Icon,
  IconButton,
  IndentedDivider,
  ManagedFileListItem,
  OverviewList,
  SearchBar,
  Text,
  TextButton,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import {
  MenuAction,
  MenuView,
  NativeActionEvent,
} from '@react-native-menu/menu';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCourses } from '../../../core/contexts/CoursesContext';
import { useCourseFilesData } from '../hooks/useCourseFilesData';
import { FileSortMode, useFileManagement } from '../hooks/useFileManagement';
import { FileStackParamList } from '../navigation/FileNavigator';
import { FileListEntry } from '../types/FileListEntry';
import { formatFolderDetails } from '../utils/formatFolderDetails';

type Props = NativeStackScreenProps<
  FileStackParamList,
  'CourseFilesScreen' | 'CourseFolderFilesScreen'
>;

export const CourseFilesScreen = ({ route, navigation }: Props) => {
  const styles = useStylesheet(createStyles);
  const { spacing, palettes, fontSizes } = useTheme();
  const [isSortOpen, setSortOpen] = useState(false);
  const { selectedCourse } = useCourses();
  const { t } = useTranslation();
  const { files, directories } = useCourseFilesData(selectedCourse);
  const activeDirectoryId = route.params?.directoryId ?? null;
  const {
    search,
    setSearch,
    viewMode,
    setViewMode,
    sortMode,
    setSortMode,
    sortedFiles,
    sortedDirectories,
    startDownload,
    getFileStatus,
  } = useFileManagement({
    files,
    directories,
    storageKey: String(selectedCourse?.id ?? 'global'),
  });
  const menuActions: MenuAction[] = [
    {
      id: 'select',
      title: t('courseFilesTab.select', { defaultValue: 'Select' }),
    },
    {
      id: 'folders',
      title: t('courseFilesTab.viewFolders', { defaultValue: 'View Folders' }),
      state: viewMode === 'folders' ? 'on' : 'off',
    },
    {
      id: 'files',
      title: t('courseFilesTab.viewFiles', { defaultValue: 'View Files' }),
      state: viewMode === 'files' ? 'on' : 'off',
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
    {
      id: 'mostRecent',
      title: t('courseFilesTab.mostRecent', { defaultValue: 'Most Recent' }),
      state: sortMode === 'mostRecent' ? 'on' : 'off',
    },
    {
      id: 'oldestFirst',
      title: t('common.oldestFirst', { defaultValue: 'Oldest first' }),
      state: sortMode === 'oldestFirst' ? 'on' : 'off',
    },
  ];

  const onPressMenuAction = ({ nativeEvent: { event } }: NativeActionEvent) => {
    if (event === 'select') {
      if (selectedCourse?.id != null) {
        navigation.navigate('CourseFileMultiSelectScreen', {
          courseId: selectedCourse.id,
        });
      }
      return;
    }
    if (activeDirectoryId != null) {
      navigation.setParams({ directoryId: undefined });
    }
    setViewMode(event === 'folders' ? 'folders' : 'files');
  };

  const downloadTitle = t('courseFilesTab.download', {
    defaultValue: 'Download',
  });
  const downloadOverwriteMessage = t('courseFilesTab.overwriteMessage', {
    defaultValue:
      'This file has been already downloaded. Do you want to overwrite it?',
  });
  const cancelLabel = t('common.cancel', { defaultValue: 'Cancel' });
  const confirmLabel = t('common.confirm', { defaultValue: 'Confirm' });
  const sortLabels = useMemo<Record<FileSortMode, string>>(
    () => ({
      nameAsc: t('courseFilesTab.nameAZ', { defaultValue: 'Name A-Z' }),
      nameDesc: t('courseFilesTab.nameZA', { defaultValue: 'Name Z-A' }),
      mostRecent: t('courseFilesTab.mostRecent', {
        defaultValue: 'Most Recent',
      }),
      oldestFirst: t('common.oldestFirst', { defaultValue: 'Oldest first' }),
    }),
    [t],
  );

  const promptOverwriteDownload = useCallback(
    (fileId: string) => {
      Alert.alert(downloadTitle, downloadOverwriteMessage, [
        { text: cancelLabel, style: 'cancel' },
        {
          text: confirmLabel,
          onPress: () => startDownload(fileId),
        },
      ]);
    },
    [
      cancelLabel,
      confirmLabel,
      downloadOverwriteMessage,
      downloadTitle,
      startDownload,
    ],
  );

  const activeDirectory = useMemo(
    () =>
      activeDirectoryId == null
        ? undefined
        : sortedDirectories.find(
            directory => directory.id === String(activeDirectoryId),
          ),
    [activeDirectoryId, sortedDirectories],
  );

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    if (activeDirectory) {
      const directoryTitle =
        activeDirectory.name?.trim() ||
        t('courseFilesTab.folder', { defaultValue: 'Folder' });
      navigation.setOptions({
        headerShown: true,
        headerTitle: directoryTitle,
      });
      return;
    }

    navigation.setOptions({
      headerShown: false,
      headerTitle: '',
    });
  }, [activeDirectory, navigation, t]);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const teachingStackNavigation = navigation.getParent()?.getParent();
    if (!teachingStackNavigation) {
      return;
    }

    teachingStackNavigation.setOptions({
      headerShown: !activeDirectory,
    });

    return () => {
      teachingStackNavigation.setOptions({ headerShown: true });
    };
  }, [activeDirectory, navigation]);

  const visibleFiles = useMemo(() => {
    if (!activeDirectory) {
      return sortedFiles;
    }

    const activeFileIds = new Set(activeDirectory.files.map(file => file.id));
    return sortedFiles.filter(file => activeFileIds.has(file.id));
  }, [activeDirectory, sortedFiles]);

  const fileEntries: FileListEntry[] = useMemo(() => {
    return visibleFiles.map(file => {
      const fileId = file.id;
      const status = getFileStatus(fileId);

      return {
        id: fileId,
        name: file.name,
        status,
        onPress: () => {},
        onLongPress:
          selectedCourse?.id != null
            ? () => {
                navigation.navigate('CourseFileMultiSelectScreen', {
                  courseId: selectedCourse.id,
                  initialSelectedIds: [fileId],
                });
              }
            : undefined,
        onActionPress:
          status === 'idle'
            ? () => {
                startDownload(fileId);
              }
            : status === 'downloaded'
              ? () => promptOverwriteDownload(fileId)
              : undefined,
      };
    });
  }, [
    visibleFiles,
    getFileStatus,
    selectedCourse?.id,
    navigation,
    startDownload,
    promptOverwriteDownload,
  ]);
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
            if (selectedCourse?.id == null) {
              return;
            }
            navigation.push('CourseFolderFilesScreen', {
              courseId: selectedCourse.id,
              directoryId: Number(folder.id),
            });
          },
          trailing: <View style={styles.staticTrailing} />,
        };
      }),
    [navigation, selectedCourse?.id, sortedDirectories, styles.staticTrailing],
  );
  const listEntries =
    viewMode === 'files' || activeDirectory ? fileEntries : folderEntries;

  return (
    <View style={styles.screen}>
      {activeDirectory && Platform.OS === 'ios' ? (
        <View style={styles.header}>
          <TextButton onPress={() => navigation.goBack()}>
            {t('common.back', { defaultValue: 'Back' })}
          </TextButton>
          <Text numberOfLines={1} weight="semibold" style={styles.headerTitle}>
            {activeDirectory.name}
          </Text>
          <View style={styles.headerSpacer} />
        </View>
      ) : null}
      <View style={styles.controlsContainer}>
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
              <TextButton>{sortLabels[sortMode]}</TextButton>
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
      </View>

      <FlatList
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        data={listEntries}
        keyExtractor={item => item.id}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={4}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.itemContainer,
              index === 0 ? styles.firstItem : null,
              index === listEntries.length - 1 ? styles.lastItem : null,
            ]}
          >
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
            {index < listEntries.length - 1 ? (
              <IndentedDivider
                style={[styles.fileDivider, { marginRight: -spacing[5] }]}
              />
            ) : null}
          </View>
        )}
        ListHeaderComponent={<View style={styles.listTopSpacing} />}
        ListFooterComponent={
          <View
            style={
              activeDirectory
                ? styles.listBottomSpacing
                : styles.listBottomSpacingWithCta
            }
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <OverviewList
              style={styles.emptyStateCard}
              emptyStateText={t('courseFilesTab.empty', {
                defaultValue: 'No files yet',
              })}
            />
          </View>
        }
      />

      {!activeDirectory ? (
        <CtaButton
          icon={faPlus}
          title={t('courseFilesTab.addFileOrFolder', {
            defaultValue: 'Add file or folder',
          })}
          action={() => {
            if (selectedCourse?.id != null) {
              navigation.navigate('CourseFilesUploadScreen', {
                courseId: selectedCourse.id,
                path: '/',
              });
            }
          }}
        />
      ) : null}
    </View>
  );
};

const createStyles = ({ colors, spacing }: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing[2],
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[2],
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
    },
    headerSpacer: {
      minWidth: 48,
    },
    flatList: {
      flex: 1,
    },
    flatListContent: {
      paddingHorizontal: spacing[5],
      flexGrow: 1,
    },
    listTopSpacing: {
      height: spacing[2],
    },
    listBottomSpacing: {
      height: spacing[5],
    },
    listBottomSpacingWithCta: {
      height: spacing[20],
    },
    emptyStateContainer: {
      alignSelf: 'stretch',
    },
    emptyStateCard: {
      borderRadius: spacing[3],
      alignSelf: 'stretch',
      marginHorizontal: 0,
      marginVertical: 0,
    },
    itemContainer: {
      alignSelf: 'stretch',
      backgroundColor: colors.surface,
      paddingLeft: spacing[4],
      paddingRight: spacing[5],
    },
    firstItem: {
      borderTopLeftRadius: spacing[3],
      borderTopRightRadius: spacing[3],
    },
    lastItem: {
      borderBottomLeftRadius: spacing[3],
      borderBottomRightRadius: spacing[3],
    },
    fileDivider: {
      alignSelf: 'stretch',
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
    controlsContainer: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[5],
      gap: spacing[2.5],
    },
    staticTrailing: {
      width: 24,
      height: 24,
    },
  });
