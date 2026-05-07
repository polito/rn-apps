import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { faEnvelope, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  CtaButton,
  CtaButtonContainer,
  IndentedDivider,
  ListItem,
  OverviewList,
  Text,
  Theme,
  useSafeAreaSpacing,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  ContextMenuItem,
  CourseFilesContextMenu,
} from '../../../core/components/CourseFilesContextMenu';
import { CourseFilesMenu } from '../../../core/components/CourseFilesMenu';
import { SearchBar } from '../../../core/components/SearchBar';
import { useCourses } from '../../../core/contexts/CoursesContext';
import {
  TeachingNavigatorID,
  TeachingStackParamList,
} from '../../../screens/Teaching/TeachingNavigator';
import { CURRENT_ACADEMIC_YEAR, SCREEN_HORIZONTAL_PADDING } from '../constants';
import { StudentsFeatureError, studentsErrorCodes } from '../errors';
import { StudentsStackParamList } from '../types/navigation';

export const CourseStudentsTab = () => {
  const { selectedCourse, setSelectedStudent } = useCourses();
  const { paddingHorizontal } = useSafeAreaSpacing();
  const bottomBarHeight = useBottomTabBarHeight();
  const safeHorizontal = paddingHorizontal as unknown as {
    paddingLeft: number;
    paddingRight: number;
  };
  const infoCardMarginLeft =
    SCREEN_HORIZONTAL_PADDING - safeHorizontal.paddingLeft;
  const infoCardMarginRight =
    SCREEN_HORIZONTAL_PADDING - safeHorizontal.paddingRight;
  const [searchText, setSearchText] = useState('');
  const styles = useStylesheet(createStyles);
  const ctaStyles = useStylesheet(createAddStudentCtaStyles);
  const { palettes, spacing, dark } = useTheme();
  const [isFilterMenuVisible, setFilterMenuVisible] = useState(false);
  const [isEllipsisMenuVisible, setEllipsisMenuVisible] = useState(false);
  const [filterAnchorPosition, setFilterAnchorPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 170, left: SCREEN_HORIZONTAL_PADDING });
  const [ellipsisAnchorPosition, setEllipsisAnchorPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 170, left: SCREEN_HORIZONTAL_PADDING });
  const [filterType, setFilterType] = useState<
    'all' | 'currentYear' | 'notExamined' | 'examined'
  >('all');
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<StudentsStackParamList>>();
  const filterButtonRef = useRef<View>(null);
  const ellipsisButtonRef = useRef<View>(null);

  const students = selectedCourse?.students;
  const query = searchText.toLowerCase();

  const filteredStudents = useMemo(
    () =>
      (students ?? []).filter(student => {
        const matchesSearch =
          student.id.toLowerCase().includes(query) ||
          student.name.toLowerCase().includes(query) ||
          student.surname.toLowerCase().includes(query);

        const passesFilter =
          filterType === 'all' ||
          (filterType === 'currentYear' &&
            student.year === CURRENT_ACADEMIC_YEAR) ||
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
    s => s.year === CURRENT_ACADEMIC_YEAR,
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

  const filterMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        label: t('other.noFilters', { defaultValue: 'No filter' }),
        checked: filterType === 'all',
        onPress: () => setFilterType('all'),
      },
      {
        label: t('other.currentY', { defaultValue: 'Current Year' }),
        checked: filterType === 'currentYear',
        onPress: () => setFilterType('currentYear'),
      },
      {
        label: t('other.examined', { defaultValue: 'Examined' }),
        checked: filterType === 'examined',
        onPress: () => setFilterType('examined'),
      },
      {
        label: t('other.notExaminated', { defaultValue: 'Not Examined' }),
        checked: filterType === 'notExamined',
        onPress: () => setFilterType('notExamined'),
      },
    ],
    [filterType, t],
  );

  const ellipsisMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        label: t('courseFilesTab.select', { defaultValue: 'Select' }),
        checked: true,
        onPress: () => {
          setEllipsisMenuVisible(false);
          navigation.navigate('SelectStudents', { initialSelectAll: false });
        },
      },
      {
        label: t('courseFilesTab.selectAll', { defaultValue: 'Select All' }),
        checked: false,
        onPress: () => {
          setEllipsisMenuVisible(false);
          navigation.navigate('SelectStudents', { initialSelectAll: true });
        },
      },
    ],
    [navigation, t],
  );

  if (!selectedCourse) return null;

  return (
    <>
      <View style={[styles.root, paddingHorizontal]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Info Card */}
          <View
            style={[
              styles.infoCard,
              dark && { backgroundColor: palettes.info[100] },
              {
                marginLeft: infoCardMarginLeft,
                marginRight: infoCardMarginRight,
              },
            ]}
          >
            <View style={styles.infoRowWithGap}>
              <Text style={styles.infoLabelBold}>
                {t('other.totalEnrolledStudents')}
              </Text>
              <Text style={styles.infoValueBold}>{totalEnrolled}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                {t('other.studentsAttendanceIssues')}
              </Text>
              <Text style={styles.infoValue}>0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                {t('other.studentsTakenExam')}
              </Text>
              <Text style={styles.infoValue}>{takenExam}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                {t('other.studentsExamDebts')}
              </Text>
              <Text style={styles.infoValue}>0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                {t('other.studentsEligible')}
              </Text>
              <Text style={styles.infoValue}>{eligible}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                {t('other.studentsFirstTime')}
              </Text>
              <Text style={styles.infoValue}>{firstTime}</Text>
            </View>
          </View>

          {/* Search bar */}
          <View
            style={{
              marginLeft: infoCardMarginLeft,
              marginRight: infoCardMarginRight,
            }}
          >
            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search students"
            />
          </View>

          {/* Filter row */}
          <View
            style={{
              marginLeft: infoCardMarginLeft,
              marginRight: infoCardMarginRight,
              marginBottom: -spacing[2.5],
            }}
          >
            <CourseFilesMenu
              sortLabel={filterLabel}
              onSortPress={() => {
                setEllipsisMenuVisible(false);
                const node = filterButtonRef.current;
                if (node?.measureInWindow) {
                  node.measureInWindow(
                    (x: number, y: number, w: number, h: number) => {
                      setFilterAnchorPosition({
                        top: y + h - 2,
                        left: SCREEN_HORIZONTAL_PADDING,
                      });
                      setFilterMenuVisible(true);
                    },
                  );
                } else {
                  setFilterMenuVisible(true);
                }
              }}
              onMorePress={() => {
                setFilterMenuVisible(false);
                const node = ellipsisButtonRef.current;
                if (node?.measureInWindow) {
                  node.measureInWindow(
                    (x: number, y: number, w: number, h: number) => {
                      setEllipsisAnchorPosition({
                        top: y + h - 2,
                        left: Math.max(SCREEN_HORIZONTAL_PADDING, x + w - 250),
                      });
                      setEllipsisMenuVisible(true);
                    },
                  );
                } else {
                  setEllipsisMenuVisible(true);
                }
              }}
              sortButtonRef={filterButtonRef}
              moreButtonRef={ellipsisButtonRef}
            />
          </View>

          {/* Student list */}
          <OverviewList
            indented
            rounded={Platform.OS === 'android' ? true : undefined}
            emptyStateText={t('other.noStudentsFound')}
            style={Platform.select({
              android: {
                marginLeft: infoCardMarginLeft,
                marginRight: infoCardMarginRight,
                elevation: 0,
              },
            })}
          >
            {filteredStudents.map((student, index) => (
              <View key={student.id}>
                <ListItem
                  onPress={() => {
                    setSelectedStudent(student);
                    // Look up the Teaching stack by id rather than counting
                    // `getParent()` hops, so route changes in the navigator
                    // tree don't silently land us on the wrong navigator.
                    const getParentById = navigation.getParent as unknown as (
                      id: typeof TeachingNavigatorID,
                    ) =>
                      | NativeStackNavigationProp<TeachingStackParamList>
                      | undefined;
                    const teachingNavigation =
                      getParentById(TeachingNavigatorID);

                    if (!teachingNavigation) {
                      console.warn(
                        new StudentsFeatureError(
                          `Could not find ancestor navigator with id "${TeachingNavigatorID}"; cannot navigate to StudentContact.`,
                          studentsErrorCodes.PARENT_NAVIGATOR_NOT_FOUND,
                        ),
                      );
                      return;
                    }

                    teachingNavigation.navigate('StudentContact');
                  }}
                  title={`${student.name} ${student.surname}`}
                  subtitle={student.id}
                  leadingItem={
                    <FontAwesomeIcon
                      icon={faCircleUser}
                      size={20}
                      color={dark ? palettes.gray[50] : palettes.primary[700]}
                    />
                  }
                  trailingItem={
                    <View onStartShouldSetResponder={() => true}>
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert('Info', t('other.renderingToMail'));
                        }}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        accessibilityRole="button"
                        accessibilityLabel={t('other.contactStudent', {
                          defaultValue: 'Contact student by email',
                        })}
                      >
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          size={16}
                          color={
                            dark ? palettes.gray[50] : palettes.primary[700]
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  }
                />
                {index < filteredStudents.length - 1 ? (
                  <IndentedDivider style={styles.studentDivider} />
                ) : null}
              </View>
            ))}
          </OverviewList>

          <View style={{ height: spacing[20] }} />
        </ScrollView>

        {/* Add Student CTA*/}
        <View
          style={{
            marginLeft: -safeHorizontal.paddingLeft,
            marginRight: -safeHorizontal.paddingRight,
          }}
        >
          <CtaButtonContainer
            absolute={false}
            style={[
              ctaStyles.ctaWrapper,
              {
                paddingBottom: bottomBarHeight + SCREEN_HORIZONTAL_PADDING,
              },
            ]}
          >
            <CtaButton
              title={t('other.addStudent')}
              icon={faPlus}
              action={() => navigation.navigate('AddStudents')}
              absolute={false}
              style={ctaStyles.ctaButton}
              containerStyle={ctaStyles.ctaButtonContainer}
            />
          </CtaButtonContainer>
        </View>
      </View>
      <CourseFilesContextMenu
        visible={isFilterMenuVisible}
        onClose={() => setFilterMenuVisible(false)}
        items={filterMenuItems}
        anchorPosition={filterAnchorPosition}
      />
      <CourseFilesContextMenu
        visible={isEllipsisMenuVisible}
        onClose={() => setEllipsisMenuVisible(false)}
        items={ellipsisMenuItems}
        anchorPosition={ellipsisAnchorPosition}
      />
    </>
  );
};

const createAddStudentCtaStyles = (_: Theme) =>
  StyleSheet.create({
    ctaWrapper: {
      paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
      paddingTop: 0,
      paddingBottom: 0,
    },
    ctaButtonContainer: {
      padding: 0,
    },
    ctaButton: {
      width: '100%',
    },
  });

const createStyles = ({
  spacing,
  palettes,
  fontSizes,
  fontWeights,
  fontFamilies,
}: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: spacing[4],
      paddingBottom: spacing[2],
    },
    // Info Card
    infoCard: {
      display: 'flex',
      padding: SCREEN_HORIZONTAL_PADDING,
      flexDirection: 'column',
      alignItems: 'flex-start',
      alignSelf: 'stretch',
      backgroundColor: palettes.info[100],
      borderWidth: 1,
      borderColor: palettes.primary[500],
      borderRadius: 12,
      marginBottom: spacing[3],
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 21,
      width: '100%',
    },
    infoRowWithGap: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 21,
      width: '100%',
      marginBottom: 8,
    },
    infoLabelBold: {
      flex: 1,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: palettes.gray[800],
      fontFamily: fontFamilies.body,
      fontStyle: 'normal',
      lineHeight: 21,
    },
    infoValueBold: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      color: palettes.gray[800],
      textAlign: 'right',
      fontFamily: fontFamilies.body,
    },
    infoLabel: {
      flex: 1,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      color: palettes.gray[600],
      fontFamily: fontFamilies.body,
    },
    infoValue: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      color: palettes.gray[800],
      textAlign: 'right',
      fontFamily: fontFamilies.body,
    },
    studentDivider: {
      marginLeft: SCREEN_HORIZONTAL_PADDING,
    },
  });
