import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { faEnvelope, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
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
import { StudentsStackParamList } from '../types/navigation';

const AddStudentButton = ({
  title,
  onPress,
  bottomOffset,
}: {
  title: string;
  onPress: () => void;
  bottomOffset: number;
}) => {
  const { palettes, fontSizes } = useTheme();
  const styles = useStylesheet(createAddStudentCtaStyles);

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
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const CourseStudentsTab = () => {
  const { selectedCourse, setSelectedStudent } = useCourses();
  const { paddingHorizontal } = useSafeAreaSpacing();
  const bottomBarHeight = useBottomTabBarHeight();
  // We want the Info Card to be exactly 18px from screen left/right edges.
  // Root container already applies safe-area horizontal padding, so we counteract it via margins.
  const safeHorizontal = paddingHorizontal as unknown as {
    paddingLeft: number;
    paddingRight: number;
  };
  const infoCardMarginLeft = 18 - safeHorizontal.paddingLeft;
  const infoCardMarginRight = 18 - safeHorizontal.paddingRight;
  const [searchText, setSearchText] = useState('');
  const styles = useStylesheet(createStyles);
  const { palettes, spacing, dark } = useTheme();
  const [isFilterMenuVisible, setFilterMenuVisible] = useState(false);
  const [isEllipsisMenuVisible, setEllipsisMenuVisible] = useState(false);
  const [filterAnchorPosition, setFilterAnchorPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 170, left: 18 });
  const [ellipsisAnchorPosition, setEllipsisAnchorPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 170, left: 18 });
  const [filterType, setFilterType] = useState<
    'all' | 'currentYear' | 'notExamined' | 'examined'
  >('all');
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<StudentsStackParamList>>();
  const filterButtonRef = useRef<View>(null);
  const ellipsisButtonRef = useRef<View>(null);

  if (!selectedCourse) return null;
  const { students } = selectedCourse;
  const query = searchText.toLowerCase();

  const studentPassesFilter = (student: (typeof students)[0]) => {
    if (filterType === 'all') return true;
    if (filterType === 'currentYear') return student.year === '2025';
    if (filterType === 'notExamined') return student.exam === 'no';
    if (filterType === 'examined') return student.exam === 'yes';
    return true;
  };
  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.id.toLowerCase().includes(query) ||
      student.name.toLowerCase().includes(query) ||
      student.surname.toLowerCase().includes(query);
    return matchesSearch && studentPassesFilter(student);
  });

  const totalEnrolled = students.length;
  const takenExam = students.filter(s => s.exam === 'yes').length;
  const eligible = students.filter(s => s.exam === 'no').length;
  const firstTime = students.filter(s => s.year === '2025').length;

  const filterLabel = (() => {
    switch (filterType) {
      case 'currentYear':
        return t('other.currentY', { defaultValue: 'Current Year' });
      case 'examined':
        return t('other.Examinated', { defaultValue: 'Examined' });
      case 'notExamined':
        return t('other.notExaminated', { defaultValue: 'Not Examined' });
      case 'all':
      default:
        return t('other.noFilters', { defaultValue: 'No filter' });
    }
  })();
  const filterMenuItems: ContextMenuItem[] = [
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
      label: t('other.Examinated', { defaultValue: 'Examined' }),
      checked: filterType === 'examined',
      onPress: () => setFilterType('examined'),
    },
    {
      label: t('other.notExaminated', { defaultValue: 'Not Examined' }),
      checked: filterType === 'notExamined',
      onPress: () => setFilterType('notExamined'),
    },
  ];
  const ellipsisMenuItems: ContextMenuItem[] = [
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
  ];

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
              // Keep dark theme aligned with --info-info-100 token.
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
                        left: 18,
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
                        left: Math.max(18, x + w - 250),
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
          <OverviewList indented emptyStateText={t('other.noStudentsFound')}>
            {filteredStudents.map((student, index) => (
              <View key={student.id}>
                <ListItem
                  onPress={() => {
                    setSelectedStudent(student);
                    navigation.navigate('StudentContact');
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
                    <TouchableOpacity
                      onPress={e => {
                        e.stopPropagation();
                        Alert.alert('Info', t('other.renderingToMail'));
                      }}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        size={16}
                        color={dark ? palettes.gray[50] : palettes.primary[700]}
                      />
                    </TouchableOpacity>
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

        {/* Add Student CTA (keep it above bottom tab bar) */}
        <View
          style={{
            // Counteract the screen safe-area horizontal padding for the CTA itself,
            // to match the "file/folder" button behavior.
            marginLeft: -safeHorizontal.paddingLeft,
            marginRight: -safeHorizontal.paddingRight,
          }}
        >
          <AddStudentButton
            title={t('other.addStudent')}
            bottomOffset={bottomBarHeight}
            onPress={() => navigation.navigate('AddStudents')}
          />
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

const createAddStudentCtaStyles = ({
  spacing,
  shapes,
  fontFamilies,
  fontSizes,
  fontWeights,
}: Theme) =>
  StyleSheet.create({
    ctaWrapper: {
      paddingHorizontal: spacing[5],
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
      padding: 18,
      flexDirection: 'column',
      alignItems: 'flex-start',
      alignSelf: 'stretch',
      backgroundColor: palettes.primary[100],
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
    menuItem: {
      paddingVertical: spacing[2.5],
      paddingRight: spacing[4],
      fontSize: fontSizes.md,
    },
    studentDivider: {
      marginLeft: 18,
    },
  });
