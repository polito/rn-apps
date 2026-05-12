import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, Platform, StyleSheet, View } from 'react-native';

import {
  IndentedDivider,
  ManagedFileListItem,
  OverviewList,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  ContextMenuItem,
  CourseFilesContextMenu,
} from '../../../core/components/CourseFilesContextMenu';
import { CourseFilesMenu } from '../../../core/components/CourseFilesMenu';
import { SearchBar } from '../../../core/components/SearchBar';
import { useCourses } from '../../../core/contexts/CoursesContext';
import { FileStackParamList } from '../../../core/types/navigation';
import { AddFileButton } from '../components/AddFileButton';
import { CourseDirectoryTopBar } from '../components/CourseDirectoryTopBar';
import { FileListItem } from '../components/CourseFilesList';
import { DownloadOverwriteModal } from '../components/DownloadOverwriteModal';
import { useAnchoredMenu } from '../hooks/useAnchoredMenu';
import { useCourseFilesData } from '../hooks/useCourseFilesData';
import { FileSortMode, useFileManagement } from '../hooks/useFileManagement';
import { formatFolderDetails } from '../utils/formatFolderDetails';

type Props = NativeStackScreenProps<
  FileStackParamList,
  'CourseFilesScreen' | 'CourseFolderFilesScreen'
>;

export const CourseFilesScreen = ({ route, navigation }: Props) => {
  const styles = useStylesheet(createStyles);
  const { spacing } = useTheme();
  const bottomTabBarHeight = useBottomTabBarHeight();
  const { selectedCourse } = useCourses();
  const { t } = useTranslation();
  const sortMenu = useAnchoredMenu();
  const moreMenu = useAnchoredMenu();
  const { files, directories } = useCourseFilesData(selectedCourse);
  const activeDirectoryId = route.params?.directoryId ?? null;
  const {
    search,
    setSearch,
    viewMode,
    setViewMode,
    sortMode,
    setSortMode,
    confirmDownloadFileId,
    setConfirmDownloadFileId,
    sortedFiles,
    sortedDirectories,
    startDownload,
    getFileStatus,
  } = useFileManagement({
    files,
    directories,
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
      label: t('courseFilesTab.viewFolders', { defaultValue: 'View Folders' }),
      onPress: () => {
        if (activeDirectoryId != null) {
          navigation.setParams({ directoryId: undefined });
        }
        setViewMode('folders');
      },
      checked: viewMode === 'folders',
    },
    {
      label: t('courseFilesTab.viewFiles', { defaultValue: 'View Files' }),
      onPress: () => {
        if (activeDirectoryId != null) {
          navigation.setParams({ directoryId: undefined });
        }
        setViewMode('files');
      },
      checked: viewMode === 'files',
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
    {
      label: t('courseFilesTab.mostRecent', { defaultValue: 'Most Recent' }),
      onPress: () => setSortMode('mostRecent'),
      checked: sortMode === 'mostRecent',
    },
    {
      label: t('common.oldestFirst', { defaultValue: 'Oldest first' }),
      onPress: () => setSortMode('oldestFirst'),
      checked: sortMode === 'oldestFirst',
    },
  ];

  const downloadTitle = t('courseFilesTab.download', {
    defaultValue: 'Download',
  });
  const downloadOverwriteMessage = t('courseFilesTab.overwriteMessage', {
    defaultValue:
      'This file has been already downloaded. Do you want to overwrite it?',
  });
  const cancelLabel = t('common.cancel', { defaultValue: 'Cancel' });
  const confirmLabel = t('common.confirm', { defaultValue: 'Confirm' });
  const menuVerticalOffset = Platform.OS === 'ios' ? 2 : 6;
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
      if (Platform.OS === 'android') {
        Alert.alert(downloadTitle, downloadOverwriteMessage, [
          { text: cancelLabel, style: 'cancel' },
          {
            text: confirmLabel,
            onPress: () => startDownload(fileId),
          },
        ]);
        return;
      }

      setConfirmDownloadFileId(fileId);
    },
    [
      cancelLabel,
      confirmLabel,
      downloadOverwriteMessage,
      downloadTitle,
      setConfirmDownloadFileId,
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

  const fileEntries: FileListItem[] = useMemo(() => {
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
        <CourseDirectoryTopBar
          title={activeDirectory.name}
          backLabel={t('common.back', { defaultValue: 'Back' })}
          onBackPress={() => navigation.goBack()}
        />
      ) : null}
      <View style={styles.controlsContainer}>
        <SearchBar value={search} onChangeText={setSearch} />

        <CourseFilesMenu
          sortLabel={sortLabels[sortMode]}
          onSortPress={() => {
            moreMenu.close();
            sortMenu.openFromRef({
              verticalOffset: menuVerticalOffset,
              strategy: { align: 'left', left: spacing[4] + spacing[0.5] },
            });
          }}
          sortButtonRef={sortMenu.buttonRef}
          moreButtonRef={moreMenu.buttonRef}
          onMorePress={() => {
            sortMenu.close();
            moreMenu.openFromRef({
              verticalOffset: menuVerticalOffset,
              strategy: {
                align: 'right',
                minLeft: spacing[4] + spacing[0.5],
                menuWidth: 250,
              },
            });
          }}
        />
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
        ListFooterComponent={<View style={styles.listBottomSpacing} />}
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
      <DownloadOverwriteModal
        visible={Boolean(confirmDownloadFileId)}
        title={downloadTitle}
        message={downloadOverwriteMessage}
        cancelLabel={cancelLabel}
        confirmLabel={confirmLabel}
        onCancel={() => setConfirmDownloadFileId(undefined)}
        onConfirm={() => {
          if (confirmDownloadFileId) {
            startDownload(confirmDownloadFileId);
          }
          setConfirmDownloadFileId(undefined);
        }}
      />

      {!activeDirectory ? (
        <AddFileButton
          onPress={() => {
            if (selectedCourse?.id != null) {
              navigation.navigate('CourseFilesUploadScreen', {
                courseId: selectedCourse.id,
                path: '/',
              });
            }
          }}
          bottomOffset={bottomTabBarHeight}
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
