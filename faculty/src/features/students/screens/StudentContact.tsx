import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import {
  faBook,
  faCalendarCheck,
  faChevronLeft,
  faChevronRight,
  faEnvelope,
  faFlag,
  faMagnifyingGlass,
  faPersonHalfDress,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  IndentedDivider,
  Text,
  Theme,
  useBottomBarAwareStyles,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../../core/contexts/CoursesContext';
import type { StudentsStackParamList } from '../types/navigation';

const formatExamDate = (dateValue?: string) => {
  if (!dateValue) return '—';

  const trimmed = dateValue.trim();
  if (!trimmed) return '—';

  const slashParts = trimmed.split('/');
  if (slashParts.length === 3) {
    const [first, second, third] = slashParts;
    if (first.length === 4) {
      return `${second.padStart(2, '0')}/${first.padStart(2, '0')}/${third}`;
    }
    return `${first.padStart(2, '0')}/${second.padStart(2, '0')}/${third}`;
  }

  const dashParts = trimmed.split('-');
  if (dashParts.length === 3) {
    const [year, month, day] = dashParts;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }

  const parsedDate = new Date(trimmed);
  if (!Number.isNaN(parsedDate.getTime())) {
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const year = parsedDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return trimmed;
};

const BooksIcon = ({
  color,
  width = 20,
  height = 20,
}: {
  color: string;
  width?: number;
  height?: number;
}) => (
  <Svg width={width} height={height} viewBox="0 0 22 21" fill="none">
    <Path
      d="M12.7734 0.820312L15.1953 0.15625C15.8594 0 16.5625 0.390625 16.7188 1.05469L17.2266 2.89062L12.3828 4.17969L11.9141 2.34375C11.7188 1.67969 12.1094 1.01562 12.7734 0.820312ZM17.6953 4.6875L20.2734 14.3359L15.4688 15.625L12.8906 5.97656L17.6953 4.6875ZM16.4453 19.2578L15.9375 17.4609L20.7812 16.1328L21.25 17.9688C21.4453 18.6328 21.0547 19.2969 20.3906 19.4922L17.9688 20.1562C17.3047 20.3125 16.6016 19.9219 16.4453 19.2578ZM0 1.40625C0 0.703125 0.585938 0.15625 1.25 0.15625H3.75C4.45312 0.15625 5 0.703125 5 1.40625V3.28125H0V1.40625ZM0 5.15625H5V15.1562H0V5.15625ZM0 17.0312H5V18.9062C5 19.6094 4.45312 20.1562 3.75 20.1562H1.25C0.585938 20.1562 0 19.6094 0 18.9062V17.0312ZM6.875 5.15625C6.875 4.45312 7.46094 3.90625 8.125 3.90625H10C10.7031 3.90625 11.25 4.45312 11.25 5.15625V18.9062C11.25 19.6094 10.7031 20.1562 10 20.1562H8.125C7.46094 20.1562 6.875 19.6094 6.875 18.9062V5.15625Z"
      fill={color}
    />
  </Svg>
);

export const StudentContact = () => {
  const { palettes, dark } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<StudentsStackParamList>>();
  const insets = useSafeAreaInsets();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const { selectedStudent, selectedCourse } = useCourses();
  const { t } = useTranslation();

  if (!selectedStudent) return null;

  const courseCode = selectedCourse
    ? `${selectedCourse.code} - ${selectedCourse.cfu} CFU`
    : '—';
  const studentEmail = `${selectedStudent.id}@studenti.polito.it`;
  const latestExamDate = formatExamDate(selectedStudent.passedExamsDate[0]);
  const subscriptionYear = selectedStudent.year
    ? `${selectedStudent.year}/${String(Number(selectedStudent.year) + 1)}`
    : '—';

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.topBar,
          dark && styles.topBarDark,
          { height: insets.top + 44, paddingTop: insets.top },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={22}
            color={palettes.primary[500]}
          />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, dark && styles.topBarTitleDark]}>
          {t('other.student', { defaultValue: 'Student' })}
        </Text>
        <View style={styles.topBarRightSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[bottomBarAwareStyles, styles.contentContainer]}
        showsVerticalScrollIndicator={false}
      >
        {/* Name + ID */}
        <View style={styles.titleSection}>
          <Text style={[styles.studentName, dark && styles.studentNameDark]}>
            {selectedStudent.name} {selectedStudent.surname}
          </Text>
          <Text style={styles.studentId}>{selectedStudent.id}</Text>
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.photoContainer}>
            <FontAwesomeIcon
              icon={faCircleUser}
              size={80}
              color={dark ? palettes.gray[50] : palettes.primary[700]}
            />
          </View>
          <View style={styles.profileDetails}>
            <View style={styles.metricRow}>
              <Text
                style={[styles.metricLabel, dark && styles.metricLabelDark]}
              >
                {t('other.course', { defaultValue: 'Course' })}
              </Text>
              <Text style={styles.metricValue}>{courseCode}</Text>
            </View>
            <View style={styles.metricRow}>
              <Text
                style={[styles.metricLabel, dark && styles.metricLabelDark]}
              >
                {t('other.cds', { defaultValue: 'Cds' })}
              </Text>
              <Text style={styles.metricValue}>
                {selectedStudent.degreeCourse}
              </Text>
            </View>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text
              style={[styles.sectionTitle, dark && styles.sectionTitleDark]}
            >
              {t('other.info', { defaultValue: 'Info' })}
            </Text>
          </View>

          <View style={styles.infoCard}>
            {/* Special Needs */}
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => navigation.navigate('SpecialNeeds')}
            >
              <View style={styles.leadingIcon}>
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  size={20}
                  color={dark ? palettes.gray[50] : palettes.primary[700]}
                />
              </View>
              <View style={styles.listItemContent}>
                <Text
                  style={[
                    styles.listItemTitle,
                    dark && styles.listItemTitleDark,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {t('other.specialNeeds', { defaultValue: 'Special Needs' })}
                </Text>
                <Text style={styles.listItemSubtitle} numberOfLines={1}>
                  {t('other.specialNeedsSubtitle', {
                    defaultValue: 'List of all compensative measures',
                  })}
                </Text>
              </View>
              <FontAwesomeIcon
                icon={faChevronRight}
                size={16}
                color={palettes.gray[500]}
              />
            </TouchableOpacity>

            <IndentedDivider
              style={[styles.infoDivider, dark && styles.infoDividerDark]}
            />

            {/* Exams */}
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => navigation.navigate('StudentExams')}
            >
              <View style={styles.leadingIcon}>
                <BooksIcon
                  color={dark ? palettes.gray[50] : palettes.primary[700]}
                />
              </View>
              <View style={styles.listItemContent}>
                <Text
                  style={[
                    styles.listItemTitle,
                    dark && styles.listItemTitleDark,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {t('other.exams', { defaultValue: 'Exams' })}
                </Text>
                <Text style={styles.listItemSubtitle} numberOfLines={1}>
                  {t('other.examsSubtitle', {
                    defaultValue: "View the student's plan",
                  })}
                </Text>
              </View>
              <FontAwesomeIcon
                icon={faChevronRight}
                size={16}
                color={palettes.gray[500]}
              />
            </TouchableOpacity>

            <IndentedDivider
              style={[styles.infoDivider, dark && styles.infoDividerDark]}
            />

            {/* Email */}
            <View style={styles.listItem}>
              <View style={styles.leadingIcon}>
                <FontAwesomeIcon
                  icon={faEnvelope}
                  size={20}
                  color={dark ? palettes.gray[50] : palettes.primary[700]}
                />
              </View>
              <View style={styles.listItemContent}>
                <Text
                  style={[
                    styles.listItemTitle,
                    dark && styles.listItemTitleDark,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {t('other.email', { defaultValue: 'Email' })}
                </Text>
                <Text style={styles.listItemSubtitle} numberOfLines={1}>
                  {studentEmail}
                </Text>
              </View>
            </View>

            <IndentedDivider
              style={[styles.infoDivider, dark && styles.infoDividerDark]}
            />

            {/* Exam result */}
            <View style={styles.listItem}>
              <View style={styles.leadingIcon}>
                <FontAwesomeIcon
                  icon={faBook}
                  size={20}
                  color={dark ? palettes.gray[50] : palettes.primary[700]}
                />
              </View>
              <View style={styles.listItemContent}>
                <Text
                  style={[
                    styles.listItemTitle,
                    dark && styles.listItemTitleDark,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {t('other.examResult', { defaultValue: 'Exam result' })}
                </Text>
                <Text style={styles.listItemSubtitle} numberOfLines={1}>
                  {latestExamDate}
                </Text>
              </View>
              {selectedStudent.exam === 'yes' && (
                <View
                  style={[styles.gradeBadge, dark && styles.gradeBadgeDark]}
                >
                  <Text
                    style={[
                      styles.gradeBadgeText,
                      dark && styles.gradeBadgeTextDark,
                    ]}
                  >
                    30L
                  </Text>
                </View>
              )}
            </View>

            <IndentedDivider
              style={[styles.infoDivider, dark && styles.infoDividerDark]}
            />

            {/* Subscription */}
            <View style={styles.listItem}>
              <View style={styles.leadingIcon}>
                <FontAwesomeIcon
                  icon={faCalendarCheck}
                  size={20}
                  color={dark ? palettes.gray[50] : palettes.primary[700]}
                />
              </View>
              <View style={styles.listItemContent}>
                <Text
                  style={[
                    styles.listItemTitle,
                    dark && styles.listItemTitleDark,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {t('other.subscription', { defaultValue: 'Subscription' })}
                </Text>
                <Text style={styles.listItemSubtitle} numberOfLines={1}>
                  {subscriptionYear}
                </Text>
              </View>
            </View>

            <IndentedDivider
              style={[styles.infoDivider, dark && styles.infoDividerDark]}
            />

            {/* Citizenship */}
            <View style={styles.listItem}>
              <View style={styles.leadingIcon}>
                <FontAwesomeIcon
                  icon={faFlag}
                  size={20}
                  color={dark ? palettes.gray[50] : palettes.primary[700]}
                />
              </View>
              <View style={styles.listItemContent}>
                <Text
                  style={[
                    styles.listItemTitle,
                    dark && styles.listItemTitleDark,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {t('other.citizenship', { defaultValue: 'Citizenship' })}
                </Text>
                <Text style={styles.listItemSubtitle} numberOfLines={1}>
                  {selectedStudent.countryOfBirth || 'Italy'}
                </Text>
              </View>
            </View>

            <IndentedDivider
              style={[styles.infoDivider, dark && styles.infoDividerDark]}
            />

            {/* Gender */}
            <View style={styles.listItem}>
              <View style={styles.leadingIcon}>
                <FontAwesomeIcon
                  icon={faPersonHalfDress}
                  size={20}
                  color={dark ? palettes.gray[50] : palettes.primary[700]}
                />
              </View>
              <View style={styles.listItemContent}>
                <Text
                  style={[
                    styles.listItemTitle,
                    dark && styles.listItemTitleDark,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {t('other.gender', { defaultValue: 'Gender' })}
                </Text>
                <Text style={styles.listItemSubtitle} numberOfLines={1}>
                  {selectedStudent.gender || '—'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = ({
  colors,
  spacing,
  palettes,
  fontSizes,
  fontWeights,
  fontFamilies,
  shapes,
}: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[1],
      paddingBottom: spacing[5],
    },
    topBar: {
      height: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.background,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palettes.gray[300],
      marginBottom: spacing[3],
    },
    topBarDark: {
      borderBottomColor: palettes.gray[500],
    },
    backButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingLeft: spacing[4],
    },
    topBarTitle: {
      fontFamily: 'Montserrat',
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: '500',
      lineHeight: 24,
      color: palettes.primary[700],
      textAlign: 'center',
    },
    topBarTitleDark: {
      color: palettes.gray[50],
    },
    topBarRightSpacer: {
      width: 44,
      height: 44,
    },
    titleSection: {
      marginBottom: spacing[4],
    },
    studentName: {
      fontFamily: 'Montserrat',
      fontSize: 20,
      fontStyle: 'normal',
      fontWeight: '600',
      lineHeight: 25,
      color: palettes.primary[700],
    },
    studentNameDark: {
      color: palettes.gray[50],
    },
    studentId: {
      fontFamily: 'Montserrat',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: '700',
      lineHeight: 17.5,
      color: palettes.gray[600],
      textTransform: 'uppercase',
    },
    profileCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: spacing[3],
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[4],
      marginTop: spacing[1.5],
      marginBottom: spacing[5],
    },
    photoContainer: {
      width: 123,
      height: 123,
      borderRadius: 61.5,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileDetails: {
      flex: 1,
      gap: spacing[2],
    },
    metricRow: {
      gap: 2,
    },
    metricLabel: {
      fontFamily: 'Montserrat',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: '400',
      color: palettes.primary[700],
      lineHeight: 21,
    },
    metricLabelDark: {
      color: palettes.gray[50],
    },
    metricValue: {
      fontFamily: 'Montserrat',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: '700',
      color: palettes.info[700],
      textTransform: 'uppercase',
      lineHeight: 21,
    },
    section: {
      gap: spacing[2],
    },
    sectionHeader: {
      gap: spacing[2],
      marginBottom: spacing[1],
    },
    sectionAccent: {
      width: 32,
      height: 4,
      backgroundColor: palettes.secondary[600],
    },
    sectionTitle: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      color: palettes.primary[700],
      lineHeight: fontSizes.md * 1.25,
    },
    sectionTitleDark: {
      color: palettes.gray[50],
    },
    infoCard: {
      backgroundColor: colors.surface,
      borderRadius: shapes.md,
      overflow: 'hidden',
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 60,
      paddingRight: spacing[3],
    },
    leadingIcon: {
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: spacing[4],
    },
    listItemContent: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: spacing[4],
      height: 60,
    },
    listItemTitle: {
      overflow: 'hidden',
      fontFamily: 'Montserrat',
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: '500',
      color: palettes.text[800],
      lineHeight: 24,
    },
    listItemTitleDark: {
      color: palettes.gray[50],
    },
    listItemSubtitle: {
      overflow: 'hidden',
      fontFamily: 'Montserrat',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: '400',
      color: palettes.gray[500],
      lineHeight: 21,
    },
    infoDivider: {
      alignSelf: 'stretch',
      marginLeft: spacing[4],
      minHeight: 1,
    },
    infoDividerDark: {
      backgroundColor: palettes.gray[500],
    },
    gradeBadge: {
      backgroundColor: colors.background,
      borderRadius: 8,
      paddingHorizontal: spacing[2.5],
      paddingVertical: spacing[1.5],
      marginRight: spacing[1],
    },
    gradeBadgeDark: {
      backgroundColor: palettes.gray[500],
    },
    gradeBadgeText: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      color: palettes.gray[700],
      textAlign: 'center',
    },
    gradeBadgeTextDark: {
      color: palettes.gray[800],
    },
  });
