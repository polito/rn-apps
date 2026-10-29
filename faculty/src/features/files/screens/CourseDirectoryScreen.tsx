import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { faFolder } from '@fortawesome/free-regular-svg-icons';
import {
  faChevronDown,
  faChevronUp,
  faEllipsis,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { MENU_ACTIONS } from '@polito/lib/features/courses';
import {
  BottomBarSpacer,
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
  useSafeAreaSpacing,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { MenuAction, NativeActionEvent } from '@react-native-menu/menu';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../../core/contexts/CoursesContext';
import { useCourseFilesData } from '../hooks/useCourseFilesData';
import { useFileManagement } from '../hooks/useFileManagement';
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
  const { spacing, palettes, fontSizes } = useTheme();
  const [isSortOpen, setSortOpen] = useState(false);
  const { files, directories } = useCourseFilesData(selectedCourse);

  const {
    search,
    setSearch,
    sortOptions: allSortOptions,
    onPressSortOption,
    sortedDirectories,
  } = useFileManagement({
    files,
    directories,
    initialViewMode: 'folders',
    storageKey: String(selectedCourse?.id ?? 'global'),
  });

  const menuActions: MenuAction[] = useMemo(
    () => [
      {
        id: MENU_ACTIONS.SELECT,
        title: t('courseFilesTab.select', { defaultValue: 'Select' }),
      },
      {
        id: 'viewFiles',
        title: t('courseFilesTab.viewFiles', { defaultValue: 'View Files' }),
      },
    ],
    [t],
  );

  // Folders can only be sorted by name
  const sortActions = useMemo(
    () =>
      allSortOptions.filter(
        action => action.id === 'nameAsc' || action.id === 'nameDesc',
      ),
    [allSortOptions],
  );

  const onPressSortAction = useCallback(
    ({ nativeEvent: { event } }: NativeActionEvent) => onPressSortOption(event),
    [onPressSortOption],
  );

  const onPressMenuAction = useCallback(
    ({ nativeEvent: { event } }: NativeActionEvent) => {
      if (selectedCourse?.id == null) return;
      if (event === MENU_ACTIONS.SELECT) {
        navigation.navigate('CourseFileMultiSelectScreen', {
          courseId: selectedCourse.id,
        });
      } else if (event === 'viewFiles') {
        navigation.navigate('CourseFilesScreen', {
          courseId: selectedCourse.id,
        });
      }
    },
    [navigation, selectedCourse?.id],
  );

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
          <StatefulMenuView
            actions={menuActions}
            onPressAction={onPressMenuAction}
          >
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
          </StatefulMenuView>
        </Row>

        <OverviewList
          dividers
          indented
          style={styles.list}
          emptyStateText={t('courseFilesTab.empty', {
            defaultValue: 'No files yet',
          })}
        >
          {folderEntries.map(item => (
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
          ))}
        </OverviewList>
        <BottomBarSpacer />
      </ScrollView>
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
  });
