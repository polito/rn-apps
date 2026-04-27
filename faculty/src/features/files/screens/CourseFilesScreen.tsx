import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Text, Theme, useStylesheet, useTheme } from '@polito/lib/ui';
import { BlurView } from '@react-native-community/blur';
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
import {
  CourseFileEntry,
  CourseFilesList,
} from '../components/CourseFilesList';
import { useCourseFilesData } from '../hooks/useCourseFilesData';
import { useFileManagement } from '../hooks/useFileManagement';

const AddFileButton = ({
  onPress,
  bottomOffset,
}: {
  onPress: () => void;
  bottomOffset: number;
}) => {
  const { palettes, fontSizes } = useTheme();
  const styles = useStylesheet(createStyles);
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.ctaWrapper,
        {
          paddingBottom: bottomOffset + 18,
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        accessibilityRole="button"
        style={[
          styles.ctaButton,
          {
            backgroundColor: palettes.primary[500],
          },
        ]}
      >
        <View style={styles.ctaIconWrapper}>
          <FontAwesomeIcon
            icon={faPlus}
            size={fontSizes.md}
            color={palettes.gray[50]}
          />
        </View>
        <Text style={[styles.ctaText, { color: palettes.gray[50] }]}>
          {t('courseFilesTab.addFileOrFolder')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

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

type Props = NativeStackScreenProps<
  FileStackParamList,
  'CourseFilesScreen' | 'CourseFolderFilesScreen'
>;

export const CourseFilesScreen = ({ route, navigation }: Props) => {
  const styles = useStylesheet(createStyles);
  const { colors, dark, palettes } = useTheme();
  const alertSeparatorColor = dark
    ? 'rgba(255, 255, 255, 0.22)'
    : 'rgba(128, 128, 128, 0.55)';
  const alertCardBackground = dark
    ? `${palettes.gray[800]}D9`
    : 'rgba(179,179,179,0.82)';
  const bottomTabBarHeight = useBottomTabBarHeight();
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

  const sortedFileIndexById = useMemo(
    () => new Map(sortedFiles.map((file, index) => [file.id, index])),
    [sortedFiles],
  );
  const downloadTitle = t('courseFilesTab.download', {
    defaultValue: 'Download',
  });
  const downloadOverwriteMessage = t('courseFilesTab.overwriteMessage', {
    defaultValue:
      'This file has been already downloaded. Do you want to overwrite it?',
  });
  const cancelLabel = t('common.cancel', { defaultValue: 'Cancel' });
  const confirmLabel = t('common.confirm', { defaultValue: 'Confirm' });

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
            directory => directory.id === activeDirectoryId,
          ),
    [activeDirectoryId, sortedDirectories],
  );

  const visibleFiles = useMemo(() => {
    if (!activeDirectory) {
      return sortedFiles;
    }

    const normalizedSearch = search.trim().toLowerCase();
    const filesInDirectory = activeDirectory.files.filter(file =>
      normalizedSearch.length === 0
        ? true
        : file.name.toLowerCase().includes(normalizedSearch),
    );

    return [...filesInDirectory].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
    );
  }, [activeDirectory, search, sortedFiles]);

  const fileEntries: CourseFileEntry[] = useMemo(() => {
    return visibleFiles.map(file => {
      const fileId = file.id;
      const status = getFileStatus(
        fileId,
        sortedFileIndexById.get(fileId) ?? 0,
      );

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
    sortedFileIndexById,
    getFileStatus,
    selectedCourse?.id,
    navigation,
    startDownload,
    promptOverwriteDownload,
  ]);
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
            if (selectedCourse?.id == null) {
              return;
            }
            navigation.push('CourseFolderFilesScreen', {
              courseId: selectedCourse.id,
              directoryId: folder.id,
            });
          },
          trailing: <View style={styles.staticTrailing} />,
        };
      }),
    [navigation, selectedCourse?.id, sortedDirectories, styles.staticTrailing],
  );

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {activeDirectory ? (
          <View style={styles.directoryHeader}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              style={styles.directoryBackButton}
            >
              <Text style={styles.directoryBackText}>
                {t('common.back', { defaultValue: 'Back' })}
              </Text>
            </TouchableOpacity>
            <Text numberOfLines={1} style={styles.directoryTitle}>
              {activeDirectory.name}
            </Text>
            <View style={styles.directoryHeaderRightSpacer} />
          </View>
        ) : null}
        <SearchBar value={search} onChangeText={setSearch} />

        <CourseFilesMenu
          sortLabel={
            sortMode === 'nameAsc'
              ? t('courseFilesTab.nameAZ', { defaultValue: 'Name A-Z' })
              : sortMode === 'nameDesc'
                ? t('courseFilesTab.nameZA', { defaultValue: 'Name Z-A' })
                : sortMode === 'mostRecent'
                  ? t('courseFilesTab.mostRecent', {
                      defaultValue: 'Most Recent',
                    })
                  : t('common.oldestFirst', { defaultValue: 'Oldest first' })
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

        {viewMode === 'files' || activeDirectory ? (
          <CourseFilesList files={fileEntries} />
        ) : (
          <CourseFilesList files={folderEntries} />
        )}
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
      <Modal
        visible={Boolean(confirmDownloadFileId)}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => setConfirmDownloadFileId(undefined)}
      >
        <Pressable
          style={[
            styles.confirmBackdrop,
            { backgroundColor: `${colors.black}40` },
          ]}
          onPress={() => setConfirmDownloadFileId(undefined)}
        >
          <Pressable
            style={[
              styles.confirmCard,
              { backgroundColor: alertCardBackground },
            ]}
            onPress={() => {}}
          >
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType={dark ? 'dark' : 'xlight'}
              blurAmount={25}
              reducedTransparencyFallbackColor={
                dark ? palettes.gray[800] : palettes.gray[200]
              }
            />
            <View style={styles.confirmContent}>
              <Text style={styles.confirmTitle}>{downloadTitle}</Text>
              <Text style={styles.confirmBody}>{downloadOverwriteMessage}</Text>
            </View>
            <View
              style={[
                styles.confirmActions,
                { borderTopColor: alertSeparatorColor },
              ]}
            >
              <TouchableOpacity
                onPress={() => setConfirmDownloadFileId(undefined)}
                style={styles.confirmAction}
              >
                <Text
                  style={[styles.cancelActionText, { color: colors.readMore }]}
                >
                  {cancelLabel}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (confirmDownloadFileId) {
                    startDownload(confirmDownloadFileId);
                  }
                  setConfirmDownloadFileId(undefined);
                }}
                style={styles.confirmAction}
              >
                <Text
                  style={[styles.confirmActionText, { color: colors.readMore }]}
                >
                  {confirmLabel}
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

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

const createStyles = ({
  colors,
  spacing,
  shapes,
  fontFamilies,
  fontSizes,
  fontWeights,
}: Theme) =>
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
      gap: spacing[2.5],
      flexGrow: 1,
      flexShrink: 0,
      flexBasis: 0,
      alignSelf: 'stretch',
    },
    directoryHeader: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: spacing[2],
      paddingBottom: spacing[1],
    },
    directoryBackButton: {
      minWidth: 56,
      minHeight: 28,
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingVertical: spacing[1],
    },
    directoryBackText: {
      color: colors.heading,
      fontFamily: fontFamilies.body,
      fontSize: 17,
      fontWeight: fontWeights.normal,
      lineHeight: 22,
      letterSpacing: -0.43,
    },
    directoryTitle: {
      flex: 1,
      textAlign: 'center',
      color: colors.heading,
      fontFamily: fontFamilies.body,
      fontSize: 17,
      fontWeight: fontWeights.semibold,
      lineHeight: 22,
      letterSpacing: -0.43,
      marginHorizontal: spacing[1],
    },
    directoryHeaderRightSpacer: {
      minWidth: 56,
      minHeight: 28,
    },
    ctaWrapper: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[2],
    },
    ctaButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      borderRadius: shapes.lg,
      paddingHorizontal: 21,
      paddingVertical: spacing[3],
      gap: spacing[2],
      alignSelf: 'stretch',
    },
    ctaIconWrapper: {
      height: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    ctaText: {
      textAlign: 'center',
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontStyle: 'normal',
      fontWeight: fontWeights.semibold,
      lineHeight: 21,
    },
    staticTrailing: {
      width: 24,
      height: 24,
    },
    confirmBackdrop: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing[8],
    },
    confirmCard: {
      width: 270,
      borderRadius: shapes.xl,
      overflow: 'hidden',
    },
    confirmContent: {
      paddingHorizontal: spacing[4],
      paddingTop: 19,
      paddingBottom: 15,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2,
    },
    confirmTitle: {
      color: colors.heading,
      textAlign: 'center',
      fontFamily: fontFamilies.body,
      fontSize: 17,
      fontStyle: 'normal',
      fontWeight: '600',
      lineHeight: 22,
      letterSpacing: -0.43,
    },
    confirmBody: {
      color: colors.heading,
      textAlign: 'center',
      fontFamily: fontFamilies.body,
      fontSize: 13,
      fontStyle: 'normal',
      fontWeight: fontWeights.normal,
      lineHeight: 18,
      letterSpacing: -0.08,
    },
    confirmActions: {
      flexDirection: 'row',
      borderTopWidth: StyleSheet.hairlineWidth,
    },
    confirmAction: {
      flex: 1,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    confirmActionText: {
      fontFamily: fontFamilies.body,
      fontSize: 17,
      fontStyle: 'normal',
      fontWeight: fontWeights.semibold,
      lineHeight: 22,
      letterSpacing: -0.43,
    },
    cancelActionText: {
      fontFamily: fontFamilies.body,
      fontSize: 17,
      fontStyle: 'normal',
      fontWeight: fontWeights.normal,
      lineHeight: 22,
      letterSpacing: -0.43,
    },
  });
