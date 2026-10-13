import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  InteractionManager,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  faArrowUpRightFromSquare,
  faEllipsisVertical,
  faSearch,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { MENU_ACTIONS } from '@polito/lib/features/courses';
import {
  Checkbox,
  CtaButton,
  FileListItem,
  GlobalStyles,
  IconButton,
  OverviewList,
  Row,
  StatefulMenuView,
  TextButton,
  Theme,
  TranslucentTextField,
  useHideTabs,
  useSafeAreaSpacing,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { NativeActionEvent } from '@react-native-menu/menu';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCourses } from '../../../core/contexts/CoursesContext';
import { FileStackParamList } from '../navigation/FileNavigator';
import { CourseFileEntry as CourseFileDataEntry } from '../types/CourseFileEntry';
import { mapFileEntry } from '../utils/mapFileEntry';
import { MoveFilesModal } from './MoveFilesScreen';

type Props = NativeStackScreenProps<
  FileStackParamList,
  'CourseFileMultiSelectScreen'
>;

export const CourseFileMultiSelectScreen = ({ route, navigation }: Props) => {
  const { courseId, initialSelectedIds } = route.params;
  const { t } = useTranslation();
  const {
    fakeCourses,
    selectedCourse,
    removeFileFromCourse,
    addDirectoryToCourse,
    updateCourseFile,
  } = useCourses();
  const theme = useTheme();
  const { fontSizes, palettes } = theme;
  const styles = useStylesheet(createStyles);
  const { paddingHorizontal } = useSafeAreaSpacing();

  useHideTabs();

  const course = useMemo(
    () =>
      selectedCourse?.id === courseId
        ? selectedCourse
        : fakeCourses.find(c => c.id === courseId),
    [selectedCourse, fakeCourses, courseId],
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
        <StatefulMenuView
          actions={headerMenuActions}
          onPressAction={onHeaderMenuAction}
        >
          <IconButton
            icon={faEllipsisVertical}
            color={palettes.primary[400]}
            size={fontSizes.lg}
            accessibilityLabel={t('common.moreOptions', {
              defaultValue: 'More options',
            })}
          />
        </StatefulMenuView>
      ),
    });
  }, [
    navigation,
    headerMenuActions,
    onHeaderMenuAction,
    palettes.primary,
    fontSizes.lg,
    t,
  ]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {Platform.OS === 'ios' ? (
        <Row justify="space-between" align="center" ph={5} pv={2}>
          <TextButton onPress={() => navigation.goBack()}>
            {t('common.done', { defaultValue: 'Done' })}
          </TextButton>
          <TextButton onPress={handleToggleSelectAll}>
            {allFilesSelected
              ? t('common.deselectAll', { defaultValue: 'Deselect all' })
              : t('common.selectAll', { defaultValue: 'Select all' })}
          </TextButton>
        </Row>
      ) : null}

      <View style={[styles.searchBarWrap, paddingHorizontal]}>
        <Row align="center" style={styles.searchBar}>
          <TranslucentTextField
            autoCorrect={false}
            leadingIcon={faSearch}
            value={searchFilter}
            onChangeText={setSearchFilter}
            style={[GlobalStyles.grow, styles.textField]}
            containerStyle={styles.searchField}
            label={t('courseDirectoryScreen.search', {
              defaultValue: 'Search',
            })}
            editable
            isClearable={!!searchFilter}
            onClear={() => setSearchFilter('')}
          />
        </Row>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.list}
          contentContainerStyle={[paddingHorizontal, styles.listContent]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <OverviewList
            dividers
            indented
            style={styles.overviewList}
            emptyStateText={t('courseFilesTab.empty', {
              defaultValue: 'No files yet',
            })}
          >
            {listData.map(entry => (
              <FileListItem
                key={entry.file.id}
                title={
                  entry.file.name ||
                  t('common.unnamedFile', { defaultValue: 'Unnamed file' })
                }
                mimeType={entry.file.mimeType}
                onPress={() => handleToggleFile(entry)}
                trailingItem={
                  <Checkbox
                    isChecked={selectedFileIds.has(entry.file.id)}
                    onPress={() => handleToggleFile(entry)}
                    textStyle={styles.checkboxText}
                    containerStyle={styles.checkboxContainer}
                  />
                }
              />
            ))}
          </OverviewList>
        </ScrollView>

        <Row
          justify="center"
          align="stretch"
          gap={2}
          ph={5}
          pv={2}
          style={styles.ctaRow}
        >
          <CtaButton
            title={t('courseFilesTab.move', { defaultValue: 'Move' })}
            action={handleMovePress}
            icon={faArrowUpRightFromSquare}
            variant="outlined"
            disabled={isMoveDisabled}
            absolute={false}
            containerStyle={styles.ctaButtonContainer}
          />
          <CtaButton
            title={t('courseFilesTab.delete', { defaultValue: 'Delete' })}
            action={handleDeletePress}
            icon={faTrash}
            destructive
            disabled={isDeleteDisabled}
            absolute={false}
            containerStyle={styles.ctaButtonContainer}
          />
        </Row>
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

const createStyles = ({ colors, spacing, shapes }: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    searchBarWrap: {
      overflow: 'hidden',
      paddingTop: spacing[4],
    },
    searchBar: {
      marginHorizontal: spacing[4],
    },
    searchField: {
      marginHorizontal: 0,
      marginTop: spacing[2],
    },
    textField: {
      borderRadius: shapes.lg,
    },
    keyboardAvoiding: {
      flex: 1,
      minHeight: 0,
      gap: spacing[2],
    },
    list: {
      flex: 1,
      minHeight: 0,
    },
    listContent: {
      paddingTop: spacing[2],
    },
    overviewList: {
      marginHorizontal: spacing[4],
      marginTop: 0,
    },
    checkboxText: {
      marginHorizontal: 0,
    },
    checkboxContainer: {
      marginHorizontal: 0,
      marginVertical: spacing[2],
    },
    ctaRow: {
      backgroundColor: colors.background,
    },
    ctaButtonContainer: {
      flex: 1,
      padding: 0,
    },
  });
