import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';

import { faFolder } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowsRotate,
  faChevronDown,
  faChevronUp,
  faDownload,
  faEllipsis,
  faPlus,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { MENU_ACTIONS } from '@polito/lib/features/courses';
import {
  BottomBarSpacer,
  CtaButton,
  CtaButtonSpacer,
  FileListItem,
  GlobalStyles,
  Icon,
  IconButton,
  ListItem,
  OverviewList,
  Row,
  StatefulMenuView,
  Text,
  Theme,
  TranslucentTextField,
  createHeaderCloseButton,
  useSafeAreaSpacing,
  useSafeBottomBarHeight,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import {
  MenuAction,
  MenuView,
  NativeActionEvent,
} from '@react-native-menu/menu';
import { useHeaderHeight } from '@react-navigation/elements';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCourses } from '../../../core/contexts/CoursesContext';
import { useCourseFilesData } from '../hooks/useCourseFilesData';
import { FileSortMode, useFileManagement } from '../hooks/useFileManagement';
import { FileStackParamList } from '../navigation/FileNavigator';
import { FileListEntry } from '../types/FileListEntry';
import { formatFolderDetails } from '../utils/formatFolderDetails';

const CtaFade = () => {
  const { colors, spacing } = useTheme();
  const bottomBarHeight = useSafeBottomBarHeight();
  const styles = useStylesheet(createStyles);

  return (
    <View
      pointerEvents="none"
      style={[styles.fade, { bottom: bottomBarHeight, height: spacing[24] }]}
    >
      <Svg
        width="100%"
        height={spacing[24]}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <Defs>
          <LinearGradient id="filesCtaFade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.background} stopOpacity="0" />
            <Stop offset="1" stopColor={colors.background} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100" height="100" fill="url(#filesCtaFade)" />
      </Svg>
    </View>
  );
};

type Props = NativeStackScreenProps<
  FileStackParamList,
  'CourseFilesScreen' | 'CourseFolderFilesScreen'
>;

export const CourseFilesScreen = ({ route, navigation }: Props) => {
  const styles = useStylesheet(createStyles);
  const { spacing, palettes, fontSizes, dark } = useTheme();
  const { paddingHorizontal } = useSafeAreaSpacing();
  const headerHeight = useHeaderHeight();
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
  const menuActions: MenuAction[] = useMemo(
    () => [
      {
        id: MENU_ACTIONS.SELECT,
        title: t('courseFilesTab.select', { defaultValue: 'Select' }),
      },
      {
        id: 'folders',
        title: t('courseFilesTab.viewFolders', {
          defaultValue: 'View Folders',
        }),
        state: viewMode === 'folders' ? 'on' : 'off',
      },
      {
        id: 'files',
        title: t('courseFilesTab.viewFiles', { defaultValue: 'View Files' }),
        state: viewMode === 'files' ? 'on' : 'off',
      },
    ],
    [t, viewMode],
  );

  const sortActions: MenuAction[] = useMemo(
    () => [
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
    ],
    [t, sortMode],
  );

  const onPressSortAction = useCallback(
    ({ nativeEvent: { event } }: NativeActionEvent) =>
      setSortMode(event as FileSortMode),
    [setSortMode],
  );

  const onPressMenuAction = useCallback(
    ({ nativeEvent: { event } }: NativeActionEvent) => {
      if (event === MENU_ACTIONS.SELECT) {
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
    },
    [activeDirectoryId, navigation, selectedCourse?.id, setViewMode],
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
      Alert.alert(downloadTitle, downloadOverwriteMessage, [
        { text: cancelLabel, style: 'cancel' },
        {
          text: confirmLabel,
          isPreferred: true,
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
    if (activeDirectory) {
      const directoryTitle =
        activeDirectory.name?.trim() ||
        t('courseFilesTab.folder', { defaultValue: 'Folder' });
      navigation.setOptions({
        headerShown: true,
        headerTitle: directoryTitle,
        headerRight:
          Platform.OS === 'ios' && route.name === 'CourseFolderFilesScreen'
            ? createHeaderCloseButton(navigation)
            : undefined,
      });
      return;
    }

    navigation.setOptions({
      headerShown: false,
      headerTitle: '',
    });
  }, [activeDirectory, navigation, route.name, t]);

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
        mimeType: file.mimeType,
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
        };
      }),
    [navigation, selectedCourse?.id, sortedDirectories],
  );
  const listEntries =
    viewMode === 'files' || activeDirectory ? fileEntries : folderEntries;

  return (
    <View
      style={[
        styles.screen,
        Platform.OS === 'ios' &&
          activeDirectory && { paddingTop: headerHeight + spacing[2] },
      ]}
    >
      <ScrollView
        style={styles.scroll}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[paddingHorizontal, styles.scrollContent]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchBar}>
          <TranslucentTextField
            autoCorrect={false}
            leadingIcon={faSearch}
            value={search}
            onChangeText={setSearch}
            style={GlobalStyles.grow}
            containerStyle={styles.searchField}
            label={t('courseDirectoryScreen.search', {
              defaultValue: 'Search',
            })}
            editable
            isClearable={search.length > 0}
            onClear={() => setSearch('')}
          />
        </View>

        <Row
          mh={4}
          justify="space-between"
          align="center"
          style={styles.filterRow}
        >
          <StatefulMenuView
            actions={sortActions}
            onPressAction={onPressSortAction}
            onOpenMenu={() => setSortOpen(true)}
            onCloseMenu={() => setSortOpen(false)}
          >
            <Row align="center" gap={1}>
              <Text weight="semibold" style={styles.filterLabel}>
                {sortActions.find(action => action.state === 'on')?.title}
              </Text>
              <Icon
                icon={isSortOpen ? faChevronUp : faChevronDown}
                size={fontSizes.sm}
                color={palettes.primary[400]}
              />
            </Row>
          </StatefulMenuView>
          <MenuView actions={menuActions} onPressAction={onPressMenuAction}>
            <IconButton
              icon={faEllipsis}
              color={palettes.primary[400]}
              size={fontSizes.lg}
              iconPadding={spacing[1.5]}
              style={styles.moreButton}
              accessibilityLabel={t('common.moreOptions', {
                defaultValue: 'More options',
              })}
            />
          </MenuView>
        </Row>

        <OverviewList
          dividers
          indented
          style={styles.list}
          emptyStateText={t('courseFilesTab.empty', {
            defaultValue: 'No files yet',
          })}
        >
          {listEntries.map(item =>
            item.isFolder ? (
              <ListItem
                key={item.id}
                title={item.name}
                subtitle={item.subtitle}
                leadingItem={
                  <Icon
                    icon={faFolder}
                    size={fontSizes.xl}
                    color={palettes.secondary[500]}
                  />
                }
                onPress={item.onPress}
              />
            ) : (
              <FileListItem
                key={item.id}
                title={item.name}
                subtitle={item.subtitle}
                mimeType={item.mimeType}
                isDownloaded={item.status === 'downloaded'}
                onPress={item.onPress}
                onLongPress={item.onLongPress}
                trailingItem={
                  <IconButton
                    icon={
                      item.status === 'syncing' ? faArrowsRotate : faDownload
                    }
                    size={fontSizes.md}
                    color={
                      item.status === 'downloaded'
                        ? dark
                          ? palettes.gray[200]
                          : palettes.gray[400]
                        : dark
                          ? palettes.gray[100]
                          : palettes.gray[500]
                    }
                    adjustSpacing="right"
                    onPress={item.onActionPress}
                    disabled={!item.onActionPress}
                    accessibilityLabel={t('courseFilesTab.download', {
                      defaultValue: 'Download',
                    })}
                  />
                }
              />
            ),
          )}
        </OverviewList>
        {!activeDirectory ? <CtaButtonSpacer /> : null}
        <BottomBarSpacer />
      </ScrollView>

      {!activeDirectory ? <CtaFade /> : null}

      {!activeDirectory ? (
        <CtaButton
          absolute={true}
          containerStyle={styles.ctaButton}
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

const createStyles = ({ colors, spacing, palettes, fontSizes }: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: spacing[4],
    },
    searchBar: {
      marginHorizontal: spacing[4],
    },
    searchField: {
      marginHorizontal: 0,
      marginTop: spacing[2],
    },
    filterRow: {
      marginTop: spacing[2],
      marginBottom: spacing[2],
    },
    filterLabel: {
      color: palettes.primary[400],
      fontSize: fontSizes.sm,
      marginLeft: spacing[3],
    },
    moreButton: {
      marginRight: spacing[1],
    },
    list: {
      marginHorizontal: spacing[4],
      marginTop: 0,
    },
    fade: {
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: 1,
      elevation: 3,
    },
    ctaButton: {
      zIndex: 2,
      elevation: 4,
    },
  });
