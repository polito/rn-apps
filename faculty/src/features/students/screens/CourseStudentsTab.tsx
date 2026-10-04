import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';

import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import {
  faChevronDown,
  faChevronUp,
  faEllipsis,
  faEnvelope,
  faPlus,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { useFeedbackContext } from '@polito/lib/core';
import { HighlightedText } from '@polito/lib/features/people';
import {
  BottomBarSpacer,
  Card,
  CtaButton,
  CtaButtonSpacer,
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
  useSafeBottomBarHeight,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { MenuAction, MenuView } from '@react-native-menu/menu';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../../core/contexts/CoursesContext';
import {
  TeachingNavigatorID,
  TeachingStackParamList,
} from '../../../screens/Teaching/TeachingNavigator';
import { ParentNavigatorNotFoundError } from '../errors/ParentNavigatorNotFoundError';
import type { StudentsStackParamList } from '../navigation/StudentsNavigator';
import { getCurrentAcademicYear } from '../utils';

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
          <LinearGradient id="studentsCtaFade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.background} stopOpacity="0" />
            <Stop offset="1" stopColor={colors.background} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill="url(#studentsCtaFade)"
        />
      </Svg>
    </View>
  );
};

export const CourseStudentsTab = () => {
  const { selectedCourse, setSelectedStudent } = useCourses();
  const { paddingHorizontal } = useSafeAreaSpacing();
  const { palettes, fontSizes, dark, spacing } = useTheme();
  const styles = useStylesheet(createStyles);
  const { setFeedback } = useFeedbackContext();
  const [searchText, setSearchText] = useState('');
  const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filterType, setFilterType] = useState<
    'all' | 'currentYear' | 'notExamined' | 'examined'
  >('all');
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<StudentsStackParamList>>();
  const students = selectedCourse?.students;
  const query = searchText.trim().toLowerCase();

  const filteredStudents = useMemo(
    () =>
      (students ?? []).filter(student => {
        const matchesSearch =
          !query ||
          student.id.toLowerCase().includes(query) ||
          student.name.toLowerCase().includes(query) ||
          student.surname.toLowerCase().includes(query);

        const passesFilter =
          filterType === 'all' ||
          (filterType === 'currentYear' &&
            student.year === getCurrentAcademicYear()) ||
          (filterType === 'notExamined' && student.exam === 'no') ||
          (filterType === 'examined' && student.exam === 'yes');

        return matchesSearch && passesFilter;
      }),
    [filterType, query, students],
  );

  const totalEnrolled = (students ?? []).length;
  const takenExam = (students ?? []).filter(s => s.exam === 'yes').length;
  const eligible = (students ?? []).filter(s => s.exam === 'no').length;
  const firstTime = (students ?? []).filter(
    s => s.year === getCurrentAcademicYear(),
  ).length;

  const filterLabel = useMemo(() => {
    switch (filterType) {
      case 'currentYear':
        return t('other.currentY', { defaultValue: 'Current Year' });
      case 'examined':
        return t('other.examined', { defaultValue: 'Examined' });
      case 'notExamined':
        return t('other.notExaminated', { defaultValue: 'Not Examined' });
      case 'all':
      default:
        return t('other.noFilters', { defaultValue: 'No filter' });
    }
  }, [filterType, t]);

  const filterActions: MenuAction[] = useMemo(
    () => [
      {
        id: 'all',
        title: t('other.noFilters', { defaultValue: 'No filter' }),
        state: filterType === 'all' ? 'on' : 'off',
      },
      {
        id: 'currentYear',
        title: t('other.currentY', { defaultValue: 'Current Year' }),
        state: filterType === 'currentYear' ? 'on' : 'off',
      },
      {
        id: 'examined',
        title: t('other.examined', { defaultValue: 'Examined' }),
        state: filterType === 'examined' ? 'on' : 'off',
      },
      {
        id: 'notExamined',
        title: t('other.notExaminated', { defaultValue: 'Not Examined' }),
        state: filterType === 'notExamined' ? 'on' : 'off',
      },
    ],
    [filterType, t],
  );

  const moreActions: MenuAction[] = useMemo(
    () => [
      {
        id: 'select',
        title: t('courseFilesTab.select', { defaultValue: 'Select' }),
      },
      {
        id: 'selectAll',
        title: t('courseFilesTab.selectAll', { defaultValue: 'Select All' }),
      },
    ],
    [t],
  );

  const openStudent = useCallback(
    (student: NonNullable<typeof students>[number]) => {
      setSelectedStudent(student);
      try {
        const getParentById = navigation.getParent as unknown as (
          id: typeof TeachingNavigatorID,
        ) => NativeStackNavigationProp<TeachingStackParamList> | undefined;
        const teachingNavigation = getParentById(TeachingNavigatorID);

        if (!teachingNavigation) {
          throw new ParentNavigatorNotFoundError(
            t('other.parentNavigatorNotFound', {
              defaultValue: 'Could not open the student profile.',
            }),
          );
        }

        teachingNavigation.navigate('StudentContact');
      } catch (e) {
        if (e instanceof ParentNavigatorNotFoundError) {
          setFeedback({ text: e.message, isError: true });
          return;
        }
        throw e;
      }
    },
    [navigation, setFeedback, setSelectedStudent, t],
  );

  if (!selectedCourse) return null;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[paddingHorizontal, styles.scrollContent]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Card spaced={false} style={styles.infoCard}>
          <Row justify="space-between" align="center" mb={2}>
            <Text weight="medium" style={styles.infoLabel}>
              {t('other.totalEnrolledStudents')}
            </Text>
            <Text weight="semibold">{totalEnrolled}</Text>
          </Row>
          <Row justify="space-between" align="center">
            <Text variant="secondaryText" style={styles.infoLabel}>
              {t('other.studentsAttendanceIssues')}
            </Text>
            <Text weight="semibold">0</Text>
          </Row>
          <Row justify="space-between" align="center">
            <Text variant="secondaryText" style={styles.infoLabel}>
              {t('other.studentsTakenExam')}
            </Text>
            <Text weight="semibold">{takenExam}</Text>
          </Row>
          <Row justify="space-between" align="center">
            <Text variant="secondaryText" style={styles.infoLabel}>
              {t('other.studentsExamDebts')}
            </Text>
            <Text weight="semibold">0</Text>
          </Row>
          <Row justify="space-between" align="center">
            <Text variant="secondaryText" style={styles.infoLabel}>
              {t('other.studentsEligible')}
            </Text>
            <Text weight="semibold">{eligible}</Text>
          </Row>
          <Row justify="space-between" align="center">
            <Text variant="secondaryText" style={styles.infoLabel}>
              {t('other.studentsFirstTime')}
            </Text>
            <Text weight="semibold">{firstTime}</Text>
          </Row>
        </Card>

        <View style={styles.searchBar}>
          <TranslucentTextField
            autoCorrect={false}
            leadingIcon={faSearch}
            value={searchText}
            onChangeText={setSearchText}
            style={GlobalStyles.grow}
            containerStyle={styles.searchField}
            label={t('other.searchForStudent')}
            editable
            isClearable={searchText.length > 0}
            onClear={() => setSearchText('')}
            onClearLabel={t('contactsScreen.clearSearch')}
          />
        </View>

        <Row
          mh={4}
          justify="space-between"
          align="center"
          style={styles.filterRow}
        >
          <StatefulMenuView
            actions={filterActions}
            onPressAction={({ nativeEvent }) => {
              const id = nativeEvent.event;
              if (
                id === 'all' ||
                id === 'currentYear' ||
                id === 'examined' ||
                id === 'notExamined'
              ) {
                setFilterType(id);
              }
            }}
            onCloseMenu={() => setFilterMenuOpen(false)}
            onOpenMenu={() => setFilterMenuOpen(true)}
          >
            <Row align="center" gap={1}>
              <Text weight="semibold" style={styles.filterLabel}>
                {filterLabel}
              </Text>
              <Icon
                icon={isFilterMenuOpen ? faChevronUp : faChevronDown}
                size={fontSizes.sm}
                color={palettes.primary[400]}
              />
            </Row>
          </StatefulMenuView>
          <MenuView
            actions={moreActions}
            onPressAction={({ nativeEvent }) => {
              if (nativeEvent.event === 'select') {
                navigation.navigate('SelectStudents', {
                  initialSelectAll: false,
                });
              }
              if (nativeEvent.event === 'selectAll') {
                navigation.navigate('SelectStudents', {
                  initialSelectAll: true,
                });
              }
            }}
          >
            <IconButton
              icon={faEllipsis}
              color={palettes.primary[400]}
              size={fontSizes.lg}
              iconPadding={spacing[1.5]}
              accessibilityLabel={t('common.moreOptions', {
                defaultValue: 'More options',
              })}
            />
          </MenuView>
        </Row>

        <OverviewList
          dividers
          indented
          emptyStateText={t('other.noStudentsFound')}
          style={styles.list}
        >
          {filteredStudents.map(student => (
            <ListItem
              key={student.id}
              onPress={() => openStudent(student)}
              title={
                <HighlightedText
                  text={`${student.name} ${student.surname}`}
                  highlight={searchText}
                />
              }
              subtitle={student.id}
              leadingItem={
                <Icon
                  icon={faCircleUser}
                  size={20}
                  color={dark ? palettes.gray[50] : palettes.primary[700]}
                />
              }
              trailingItem={
                <View onStartShouldSetResponder={() => true}>
                  <IconButton
                    icon={faEnvelope}
                    size={16}
                    noPadding
                    color={dark ? palettes.gray[50] : palettes.primary[700]}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityLabel={t('other.contactStudent', {
                      defaultValue: 'Contact student by email',
                    })}
                    onPress={() =>
                      navigation.navigate('EmailCompose', {
                        selectedIds: [student.id],
                      })
                    }
                  />
                </View>
              }
            />
          ))}
        </OverviewList>
        <CtaButtonSpacer />
        <BottomBarSpacer />
      </ScrollView>

      <CtaFade />

      <CtaButton
        absolute={true}
        containerStyle={styles.ctaButton}
        title={t('other.addStudent')}
        icon={faPlus}
        action={() => navigation.navigate('AddStudents')}
      />
    </View>
  );
};

const createStyles = ({ spacing, palettes, fontSizes, colors, dark }: Theme) =>
  StyleSheet.create({
    root: {
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
    filterRow: {
      marginTop: spacing[2],
      marginBottom: spacing[2],
    },
    searchField: {
      marginHorizontal: 0,
      marginTop: spacing[2],
    },
    filterLabel: {
      color: palettes.primary[400],
      fontSize: fontSizes.sm,
      marginLeft: spacing[3],
    },
    list: {
      marginHorizontal: spacing[4],
      marginTop: 0,
    },
    infoCard: {
      marginHorizontal: spacing[4],
      marginBottom: spacing[3],
      padding: spacing[5],
      backgroundColor: dark ? colors.surface : palettes.info[100],
      borderWidth: 1,
      borderColor: palettes.primary[dark ? 400 : 500],
      elevation: 0,
    },
    infoLabel: {
      flex: 1,
      fontSize: fontSizes.sm,
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
