import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  InteractionManager,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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
  Icon,
  Text,
  TextButton,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { MenuView, NativeActionEvent } from '@react-native-menu/menu';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Checkbox } from '../../../core/components/Checkbox';
import { SearchBar } from '../../../core/components/SearchBar';
import { useCourses } from '../../../core/contexts/CoursesContext';
import { FileStackParamList } from '../../../core/types/navigation';
import {
  CourseFileEntry,
  CourseFilesList,
} from '../components/CourseFilesList';
import { MoveFilesScreen } from './MoveFilesScreen';

type CourseFileRow = {
  id: string;
  name: string;
  date: string;
  size: number;
  mimeType: string;
};

type Props = NativeStackScreenProps<
  FileStackParamList,
  'CourseFileMultiSelectScreen'
>;

export const CourseFileMultiSelectScreen = ({ route, navigation }: Props) => {
  const { courseId, initialSelectedIds } = route.params;
  const { t } = useTranslation();
  const {
    fakeCourses,
    removeFileFromCourse,
    addDirectoryToCourse,
    updateCourseFile,
  } = useCourses();
  const theme = useTheme();
  const { fontSizes, palettes, colors, spacing, dark } = theme;
  const moveButtonColors = useMemo(
    () => ({
      border: theme.dark
        ? theme.palettes.primary[400]
        : theme.palettes.primary[500],
      background: theme.dark
        ? 'rgba(0, 109, 185, 0.22)'
        : `${theme.palettes.lightBlue[50]}80`,
      text: theme.dark
        ? theme.palettes.primary[200]
        : theme.palettes.primary[500],
    }),
    [theme],
  );

  const ctaButtonBaseStyle = useMemo(
    () => ({
      flexDirection: 'row' as const,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      alignSelf: 'stretch' as const,
      gap: spacing[2],
      paddingVertical: spacing[3],
      paddingHorizontal: 21,
      borderRadius: theme.shapes.lg,
      borderWidth: 1,
    }),
    [spacing, theme.shapes.lg],
  );

  const styles = useStylesheet(createStyles);

  const course = useMemo(
    () => fakeCourses.find(c => c.id === courseId),
    [fakeCourses, courseId],
  );

  const flatFiles: CourseFileRow[] = useMemo(() => {
    if (!course) return [];
    return course.directories.flatMap(dir =>
      dir.files.map(f => ({
        id: String(f.id),
        name: f.name,
        date: f.date,
        size: f.size,
        mimeType:
          f.mimeType === 'pdf' || f.mimeType === 'application/pdf'
            ? 'application/pdf'
            : f.mimeType.includes('/')
              ? f.mimeType
              : 'application/octet-stream',
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
      flatFiles.some(f => f.id === id),
    );
    if (validIds.length > 0) {
      setSelectedFileIds(prev => new Set([...prev, ...validIds]));
      hasAppliedInitialSelection.current = true;
    }
  }, [flatFiles, initialSelectedIds]);

  const listData = useMemo(() => {
    if (!searchFilter.trim()) return flatFiles;
    const q = searchFilter.trim().toLowerCase();
    return flatFiles.filter(f => f.name.toLowerCase().includes(q));
  }, [flatFiles, searchFilter]);

  const allFilesSelected =
    flatFiles.length > 0 && flatFiles.every(f => selectedFileIds.has(f.id));

  const handleToggleFile = useCallback((file: CourseFileRow) => {
    setSelectedFileIds(prev => {
      const next = new Set(prev);
      if (next.has(file.id)) next.delete(file.id);
      else next.add(file.id);
      return next;
    });
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    setSelectedFileIds(prev => {
      if (flatFiles.length > 0 && prev.size === flatFiles.length) {
        return new Set();
      }
      return new Set(flatFiles.map(f => f.id));
    });
  }, [flatFiles]);

  const totalSelectedCount = useMemo(
    () => flatFiles.filter(f => selectedFileIds.has(f.id)).length,
    [flatFiles, selectedFileIds],
  );

  const isMoveDisabled = totalSelectedCount === 0;
  const isDeleteDisabled = totalSelectedCount === 0;

  const moveButtonStyle = useMemo(() => {
    if (isMoveDisabled) {
      return {
        ...ctaButtonBaseStyle,
        borderColor: colors.secondaryText,
        backgroundColor: colors.secondaryText,
      };
    }
    return {
      ...ctaButtonBaseStyle,
      borderColor: moveButtonColors.border,
      backgroundColor: moveButtonColors.background,
    };
  }, [
    isMoveDisabled,
    colors.secondaryText,
    moveButtonColors,
    ctaButtonBaseStyle,
  ]);

  const ctaPairLabelStyle = useMemo(
    () => ({
      textAlign: 'center' as const,
      fontFamily: theme.fontFamilies.body,
      fontSize: theme.fontSizes.sm,
      fontStyle: 'normal' as const,
      fontWeight: theme.fontWeights.semibold,
      lineHeight: 21,
    }),
    [theme.fontFamilies.body, theme.fontSizes.sm, theme.fontWeights.semibold],
  );

  const moveButtonTextStyle = useMemo(
    () => ({
      ...ctaPairLabelStyle,
      color: isMoveDisabled ? colors.disableTitle : moveButtonColors.text,
    }),
    [
      ctaPairLabelStyle,
      colors.disableTitle,
      isMoveDisabled,
      moveButtonColors.text,
    ],
  );

  const deleteButtonStyle = useMemo(() => {
    if (isDeleteDisabled) {
      return {
        ...ctaButtonBaseStyle,
        borderColor: colors.secondaryText,
        backgroundColor: colors.secondaryText,
      };
    }
    return {
      ...ctaButtonBaseStyle,
      borderColor: palettes.danger[600],
      backgroundColor: palettes.danger[600],
    };
  }, [
    isDeleteDisabled,
    colors.secondaryText,
    palettes.danger,
    ctaButtonBaseStyle,
  ]);

  const deleteButtonTextStyle = useMemo(
    () => ({
      ...ctaPairLabelStyle,
      color: isDeleteDisabled ? colors.disableTitle : colors.white,
    }),
    [ctaPairLabelStyle, colors.disableTitle, colors.white, isDeleteDisabled],
  );

  const handleMovePress = useCallback(() => {
    if (totalSelectedCount === 0) return;
    InteractionManager.runAfterInteractions(() => setIsMoveModalVisible(true));
  }, [totalSelectedCount]);

  const handleMoveConfirm = useCallback(
    (targetDirectoryId: number) => {
      const selectedFiles = flatFiles.filter(file =>
        selectedFileIds.has(file.id),
      );
      selectedFiles.forEach(file => {
        const fileId = Number(file.id);
        if (Number.isNaN(fileId)) {
          return;
        }
        updateCourseFile(
          courseId,
          fileId,
          {
            id: fileId,
            name: file.name,
            date: file.date,
            size: file.size,
            mimeType: file.mimeType,
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
    const toRemove = flatFiles.filter(f => selectedFileIds.has(f.id));
    if (toRemove.length === 0) return;

    const fileCount = toRemove.length;
    const message =
      fileCount === 1
        ? t('courseFilesTab.removeFileConfirmation', {
            defaultValue: 'Are you sure you want to delete the selected files?',
          })
        : t('courseFilesTab.removeFilesConfirmation', {
            count: fileCount,
            defaultValue: `Remove ${fileCount} files?`,
          });

    const showRemoveAlert = () =>
      Alert.alert(
        t('courseFilesTab.removeFilesTitle', {
          defaultValue: 'Confirm',
        }),
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
                removeFileFromCourse(courseId, Number(f.id));
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

  const fileEntries: CourseFileEntry[] = useMemo(
    () =>
      listData.map(file => ({
        id: file.id,
        name: file.name || t('common.unnamedFile'),
        status: 'downloaded',
        onPress: () => handleToggleFile(file),
        trailing: (
          <Checkbox
            isChecked={selectedFileIds.has(file.id)}
            onPress={() => handleToggleFile(file)}
            textStyle={styles.checkboxTrailingText}
            containerStyle={styles.checkboxTrailingContainer}
            checkboxStyle={styles.checkboxTrailingIcon}
            icon={faSquareCheck}
            iconColor={checkboxIconColor}
            iconSize={16}
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
        <View
          style={[
            styles.iosHeaderContainer,
            { backgroundColor: dark ? colors.surface : colors.white },
          ]}
        >
          <View
            style={[
              styles.iosGrabber,
              {
                backgroundColor: dark
                  ? palettes.gray[500]
                  : 'rgba(60, 60, 67, 0.30)',
              },
            ]}
          />
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.doneButton}
            >
              <Text
                style={[styles.doneButtonText, { color: palettes.gray[500] }]}
              >
                {t('common.done', { defaultValue: 'Done' })}
              </Text>
            </TouchableOpacity>
            <View style={styles.headerRight}>
              <TextButton onPress={handleToggleSelectAll}>
                <Text
                  style={[
                    styles.doneButtonText,
                    { color: palettes.primary[400] },
                  ]}
                >
                  {allFilesSelected
                    ? t('common.deselectAll', { defaultValue: 'Deselect all' })
                    : t('common.selectAll', { defaultValue: 'Select all' })}
                </Text>
              </TextButton>
            </View>
          </View>
          <View
            style={[
              styles.iosHeaderDivider,
              { backgroundColor: dark ? palettes.gray[600] : colors.divider },
            ]}
          />
        </View>
      ) : null}

      <View style={styles.searchBarWrap}>
        <SearchBar
          value={searchFilter}
          onChangeText={setSearchFilter}
          onClear={() => setSearchFilter('')}
          placeholder={t('courseDirectoryScreen.search', {
            defaultValue: 'Search',
          })}
        />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.listOuter}>
          <ScrollView
            style={styles.listScroll}
            contentContainerStyle={styles.listScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <CourseFilesList files={fileEntries} />
          </ScrollView>
        </View>

        <View style={styles.ctaRowWrapper}>
          <View style={styles.ctaRow}>
            <View style={styles.ctaPairButtonContainer}>
              <TouchableOpacity
                onPress={handleMovePress}
                disabled={isMoveDisabled}
                accessibilityRole="button"
                accessibilityLabel={t('courseFilesTab.move', {
                  defaultValue: 'Move',
                })}
                style={moveButtonStyle}
              >
                <View style={styles.moveButtonContent}>
                  <Icon
                    icon={faArrowUpRightFromSquare}
                    size={fontSizes.md}
                    color={moveButtonTextStyle.color}
                    style={styles.moveButtonIcon}
                  />
                  <Text style={moveButtonTextStyle}>
                    {t('courseFilesTab.move', { defaultValue: 'Move' })}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.ctaPairButtonContainer}>
              <TouchableOpacity
                onPress={handleDeletePress}
                disabled={isDeleteDisabled}
                accessibilityRole="button"
                accessibilityLabel={t('courseFilesTab.delete', {
                  defaultValue: 'Delete',
                })}
                style={deleteButtonStyle}
              >
                <View style={styles.moveButtonContent}>
                  <Icon
                    icon={faTrash}
                    size={fontSizes.md}
                    color={deleteButtonTextStyle.color}
                    style={styles.moveButtonIcon}
                  />
                  <Text style={deleteButtonTextStyle}>
                    {t('courseFilesTab.delete', { defaultValue: 'Delete' })}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      <MoveFilesScreen
        visible={isMoveModalVisible}
        directories={course?.directories ?? []}
        onClose={() => setIsMoveModalVisible(false)}
        onConfirm={handleMoveConfirm}
        onAddFolder={handleAddFolder}
      />
    </SafeAreaView>
  );
};

const createStyles = ({ colors, spacing, fontFamilies, fontWeights }: Theme) =>
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
      paddingTop: spacing[0.5],
      paddingBottom: spacing[2],
    },
    iosHeaderContainer: {
      alignSelf: 'stretch',
    },
    iosGrabber: {
      alignSelf: 'center',
      width: 36,
      height: 5,
      borderRadius: 999,
      marginTop: spacing[1.5],
    },
    iosHeaderDivider: {
      height: StyleSheet.hairlineWidth,
      width: '100%',
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[2],
    },
    doneButton: {
      paddingVertical: spacing[1],
    },
    doneButtonText: {
      fontFamily: fontFamilies.body,
      fontSize: 17,
      fontWeight: fontWeights.normal,
      lineHeight: 22,
      letterSpacing: -0.43,
    },
    ellipsisTrigger: {
      padding: spacing[3],
      marginHorizontal: -spacing[3],
    },
    searchBarWrap: {
      overflow: 'hidden',
      paddingHorizontal: 18,
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
      marginHorizontal: 18,
    },
    listScroll: {
      flex: 1,
    },
    listScrollContent: {
      flexGrow: 1,
    },
    ctaRowWrapper: {
      overflow: 'hidden',
      backgroundColor: colors.background,
    },
    ctaRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'stretch',
      paddingHorizontal: 18,
      paddingVertical: 18,
      gap: 8,
    },
    ctaPairButtonContainer: {
      flexGrow: 1,
      flexShrink: 0,
      flexBasis: 0,
      minWidth: 0,
      padding: 0,
      alignSelf: 'stretch',
    },
    moveButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    moveButtonIcon: {
      marginRight: spacing[2],
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
