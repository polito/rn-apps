import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  FlatList,
  InteractionManager,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  faArrowUpRightFromSquare,
  faEllipsisVertical,
  faSquareCheck,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { MENU_ACTIONS } from '@polito/lib/features/courses';
import {
  Checkbox,
  CtaButton,
  Icon,
  IndentedDivider,
  ManagedFileListItem,
  OverviewList,
  SearchBar,
  TextButton,
  Theme,
  useHideTabs,
  useSafeAreaSpacing,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { MenuView, NativeActionEvent } from '@react-native-menu/menu';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCourses } from '../../../core/contexts/CoursesContext';
import { FileStackParamList } from '../navigation/FileNavigator';
import { CourseFileEntry as CourseFileDataEntry } from '../types/CourseFileEntry';
import { FileListEntry } from '../types/FileListEntry';
import { mapFileEntry } from '../utils/mapFileEntry';
import { MoveFilesModal } from './MoveFilesScreen';

type Props = NativeStackScreenProps<
  FileStackParamList,
  'CourseFileMultiSelectScreen'
>;

export const CourseFileMultiSelectScreen = ({ route, navigation }: Props) => {
  const { courseId, initialSelectedIds } = route.params;
  const { t } = useTranslation();
  const { paddingHorizontal } = useSafeAreaSpacing();
  const {
    fakeCourses,
    removeFileFromCourse,
    addDirectoryToCourse,
    updateCourseFile,
  } = useCourses();
  const theme = useTheme();
  const { fontSizes, palettes } = theme;
  const styles = useStylesheet(createStyles);

  useHideTabs();

  const course = useMemo(
    () => fakeCourses.find(c => c.id === courseId),
    [fakeCourses, courseId],
  );

  const flatFiles: CourseFileDataEntry[] = useMemo(() => {
    if (!course) return [];
    return course.directories.flatMap(dir =>
      dir.files.map(file => ({
        file: mapFileEntry({
          ...file,
          mimeType:
            file.mimeType === 'pdf' || file.mimeType === 'application/pdf'
              ? 'application/pdf'
              : file.mimeType.includes('/')
                ? file.mimeType
                : 'application/octet-stream',
        }),
        status: 'idle',
      })),
    );
  }, [course]);

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [isMoveModalVisible, setIsMoveModalVisible] = useState(false);
  const hasAppliedInitialSelection = useRef(false);

  useEffect(() => {
    if (
      hasAppliedInitialSelection.current ||
      !initialSelectedIds?.length ||
      flatFiles.length === 0
    )
      return;
    const validIds = initialSelectedIds.filter(id =>
      flatFiles.some(entry => entry.file.id === id),
    );
    if (validIds.length > 0) {
      setSelectedFileIds(prev => new Set([...prev, ...validIds]));
      hasAppliedInitialSelection.current = true;
    }
  }, [flatFiles, initialSelectedIds]);

  const listData = useMemo(() => {
    if (!searchFilter.trim()) return flatFiles;
    const q = searchFilter.trim().toLowerCase();
    return flatFiles.filter(entry => entry.file.name.toLowerCase().includes(q));
  }, [flatFiles, searchFilter]);

  const allFilesSelected =
    flatFiles.length > 0 &&
    flatFiles.every(entry => selectedFileIds.has(entry.file.id));

  const handleToggleFile = useCallback((entry: CourseFileDataEntry) => {
    setSelectedFileIds(prev => {
      const next = new Set(prev);
      if (next.has(entry.file.id)) next.delete(entry.file.id);
      else next.add(entry.file.id);
      return next;
    });
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    setSelectedFileIds(prev => {
      if (flatFiles.length > 0 && prev.size === flatFiles.length) {
        return new Set();
      }
      return new Set(flatFiles.map(entry => entry.file.id));
    });
  }, [flatFiles]);

  const totalSelectedCount = useMemo(
    () => flatFiles.filter(entry => selectedFileIds.has(entry.file.id)).length,
    [flatFiles, selectedFileIds],
  );

  const isMoveDisabled = totalSelectedCount === 0;
  const isDeleteDisabled = totalSelectedCount === 0;

  const handleMovePress = useCallback(() => {
    if (totalSelectedCount === 0) return;
    InteractionManager.runAfterInteractions(() => setIsMoveModalVisible(true));
  }, [totalSelectedCount]);

  const handleMoveConfirm = useCallback(
    (targetDirectoryId: number) => {
      const selectedFiles = flatFiles.filter(entry =>
        selectedFileIds.has(entry.file.id),
      );
      selectedFiles.forEach(entry => {
        const fileId = Number(entry.file.id);
        if (Number.isNaN(fileId)) {
          return;
        }
        updateCourseFile(
          courseId,
          fileId,
          {
            id: fileId,
            name: entry.file.name,
            date: entry.file.date ?? '',
            size: entry.file.size ?? 0,
            mimeType: entry.file.mimeType ?? 'application/octet-stream',
            dirId: targetDirectoryId,
          },
          targetDirectoryId,
        );
      });
      setIsMoveModalVisible(false);
      navigation.goBack();
    },
    [courseId, flatFiles, navigation, selectedFileIds, updateCourseFile],
  );

  const handleAddFolder = useCallback(
    (name: string) => {
      if (!course) return undefined;
      const lastDirectoryId = course.directories.length
        ? Math.max(...course.directories.map(dir => dir.id))
        : 0;
      const nextDirectoryId = lastDirectoryId + 1;
      addDirectoryToCourse(courseId, {
        id: nextDirectoryId,
        name,
        files: [],
      });
      return nextDirectoryId;
    },
    [addDirectoryToCourse, course, courseId],
  );

  const handleDeletePress = useCallback(() => {
    const toRemove = flatFiles.filter(entry =>
      selectedFileIds.has(entry.file.id),
    );
    if (toRemove.length === 0) return;

    const message = t('courseFilesTab.removeFileConfirmation_other', {
      defaultValue: 'Are you sure want to delete the selected files?',
    });

    const showRemoveAlert = () =>
      Alert.alert(
        t('common.confirm', { defaultValue: 'Confirm' }),
        message,
        [
          {
            text: t('common.no', { defaultValue: 'No' }),
            style: 'cancel',
          },
          {
            text: t('common.yes', { defaultValue: 'Yes' }),
            isPreferred: true,
            onPress: () => {
              toRemove.forEach(f => {
                removeFileFromCourse(courseId, Number(f.file.id));
              });
              navigation.goBack();
            },
          },
        ],
        { cancelable: true },
      );
    showRemoveAlert();
  }, [
    flatFiles,
    selectedFileIds,
    removeFileFromCourse,
    courseId,
    navigation,
    t,
  ]);

  const headerMenuActions = useMemo(
    () => [
      {
        id: MENU_ACTIONS.SELECT_ALL,
        title: allFilesSelected
          ? t('common.deselectAll', { defaultValue: 'Deselect all' })
          : t('common.selectAll', { defaultValue: 'Select all' }),
      },
    ],
    [allFilesSelected, t],
  );

  const onHeaderMenuAction = useCallback(
    ({ nativeEvent: { event } }: NativeActionEvent) => {
      if (event === MENU_ACTIONS.SELECT_ALL) {
        handleToggleSelectAll();
      }
    },
    [handleToggleSelectAll],
  );

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    navigation.setOptions({
      headerRight: () => (
        <MenuView
          actions={headerMenuActions}
          onPressAction={onHeaderMenuAction}
        >
          <View style={styles.ellipsisTrigger}>
            <Icon
              icon={faEllipsisVertical}
              color={palettes.primary[400]}
              size={fontSizes.lg}
            />
          </View>
        </MenuView>
      ),
    });
  }, [
    navigation,
    headerMenuActions,
    onHeaderMenuAction,
    palettes.primary,
    fontSizes.lg,
    styles.ellipsisTrigger,
  ]);

  const checkboxIconColor = palettes.gray[500];

  const fileEntries: FileListEntry[] = useMemo(
    () =>
      listData.map(entry => ({
        id: entry.file.id,
        name:
          entry.file.name ||
          t('common.unnamedFile', { defaultValue: 'Unnamed file' }),
        status: 'downloaded',
        accessibilityRole: 'checkbox' as const,
        accessibilityState: { checked: selectedFileIds.has(entry.file.id) },
        accessibilityLabel:
          entry.file.name ||
          t('common.unnamedFile', { defaultValue: 'Unnamed file' }),
        onPress: () => handleToggleFile(entry),
        trailing: (
          <Checkbox
            isChecked={selectedFileIds.has(entry.file.id)}
            onPress={() => handleToggleFile(entry)}
            textStyle={styles.checkboxTrailingText}
            containerStyle={styles.checkboxTrailingContainer}
            checkboxStyle={styles.checkboxTrailingIcon}
            icon={faSquareCheck}
            iconColor={checkboxIconColor}
            dimension="small"
          />
        ),
      })),
    [
      listData,
      selectedFileIds,
      handleToggleFile,
      t,
      styles.checkboxTrailingText,
      styles.checkboxTrailingContainer,
      styles.checkboxTrailingIcon,
      checkboxIconColor,
    ],
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {Platform.OS === 'ios' ? (
        <View style={styles.header}>
          <TextButton onPress={() => navigation.goBack()}>
            {t('common.done', { defaultValue: 'Done' })}
          </TextButton>
          <TextButton onPress={handleToggleSelectAll}>
            {allFilesSelected
              ? t('common.deselectAll', { defaultValue: 'Deselect all' })
              : t('common.selectAll', { defaultValue: 'Select all' })}
          </TextButton>
        </View>
      ) : null}

      <View style={styles.searchBarWrap}>
        <SearchBar
          value={searchFilter}
          onChangeText={setSearchFilter}
          label={t('courseDirectoryScreen.search', { defaultValue: 'Search' })}
        />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.listOuter}>
          <FlatList
            data={fileEntries}
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

        <View style={styles.ctaRowWrapper}>
          <View style={styles.ctaRow}>
            <View style={styles.ctaPairButtonContainer}>
              <CtaButton
                title={t('courseFilesTab.move', { defaultValue: 'Move' })}
                action={handleMovePress}
                icon={faArrowUpRightFromSquare}
                variant="outlined"
                disabled={isMoveDisabled}
                absolute={false}
                containerStyle={styles.ctaButtonContainer}
                style={styles.ctaPairButton}
              />
            </View>
            <View style={styles.ctaPairButtonContainer}>
              <CtaButton
                title={t('courseFilesTab.delete', { defaultValue: 'Delete' })}
                action={handleDeletePress}
                icon={faTrash}
                destructive
                disabled={isDeleteDisabled}
                absolute={false}
                containerStyle={styles.ctaButtonContainer}
                style={styles.ctaPairButton}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      <MoveFilesModal
        visible={isMoveModalVisible}
        directories={course?.directories ?? []}
        onClose={() => setIsMoveModalVisible(false)}
        onConfirm={handleMoveConfirm}
        onAddFolder={handleAddFolder}
      />
    </SafeAreaView>
  );
};

const createStyles = ({ colors, spacing }: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[2],
    },
    ellipsisTrigger: {
      padding: spacing[3],
      marginHorizontal: -spacing[3],
    },
    searchBarWrap: {
      overflow: 'hidden',
      paddingHorizontal: spacing[4] + spacing[0.5],
      paddingTop: spacing[6],
    },
    keyboardAvoiding: {
      flex: 1,
      minHeight: 0,
      gap: spacing[2],
      paddingTop: spacing[2],
    },
    listOuter: {
      flex: 1,
      minHeight: 0,
    },
    ctaRowWrapper: {
      overflow: 'hidden',
      backgroundColor: colors.background,
    },
    ctaRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'stretch',
      paddingHorizontal: spacing[4] + spacing[0.5],
      paddingVertical: spacing[4] + spacing[0.5],
      gap: spacing[2],
    },
    ctaPairButtonContainer: {
      flexGrow: 1,
      flexShrink: 0,
      flexBasis: 0,
      minWidth: 0,
      padding: 0,
      alignSelf: 'stretch',
    },
    ctaButtonContainer: {
      padding: 0,
      width: '100%',
    },
    ctaPairButton: {
      width: '100%',
    },
    checkboxTrailingText: {
      marginHorizontal: 0,
    },
    checkboxTrailingContainer: {
      marginHorizontal: 0,
      marginVertical: 0,
      width: 24,
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginRight: -6,
    },
    checkboxTrailingIcon: {
      width: 16,
      height: 16,
      flexShrink: 0,
    },
  });
