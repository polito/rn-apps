import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
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

import { useCourses } from '../../../core/contexts/CoursesContext';

type LessonCatalogEntry = { title: string; code: string; cfu: number };

const normalizeTitle = (s: string) => s.trim().toLowerCase();

const lessonMetaForPassedExam = (
  examName: string,
  index: number,
  student: {
    passedExamsLessonCode?: string[];
    passedExamsLessonCfu?: number[];
  },
  coursesByTitle: Map<string, { code: string; cfu: number }>,
  catalogCourses: LessonCatalogEntry[],
  selectedCourse: LessonCatalogEntry | null,
): { code: string; cfu: number } | null => {
  const codes = student.passedExamsLessonCode;
  const cfus = student.passedExamsLessonCfu;
  if (codes?.[index] != null && cfus?.[index] != null) {
    return { code: codes[index]!, cfu: cfus[index]! };
  }

  const matchCourse = (
    c: LessonCatalogEntry,
  ): { code: string; cfu: number } | null => {
    const key = normalizeTitle(examName);
    const t = normalizeTitle(c.title);
    if (key === t || key.startsWith(`${t} `)) {
      return { code: c.code, cfu: c.cfu };
    }
    return null;
  };

  if (selectedCourse) {
    const m = matchCourse(selectedCourse);
    if (m) return m;
  }

  const exact = coursesByTitle.get(normalizeTitle(examName));
  if (exact) return exact;

  for (const c of catalogCourses) {
    const m = matchCourse(c);
    if (m) return m;
  }

  return null;
};

const shortYear = (y: string | number): string => String(y).slice(-2);

const formatExamDate = (dateValue?: string): string => {
  if (!dateValue) return '-';
  const trimmed = dateValue.trim();
  if (!trimmed) return '-';

  const slashParts = trimmed.split('/');
  if (slashParts.length === 3) {
    const [first, second, third] = slashParts;
    if (first.length === 4) {
      return `${second.padStart(2, '0')}/${shortYear(first)}/${third}`;
    }
    return `${first.padStart(2, '0')}/${second.padStart(2, '0')}/${shortYear(third)}`;
  }

  const dashParts = trimmed.split('-');
  if (dashParts.length === 3) {
    const [year, month, day] = dashParts;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${shortYear(year)}`;
  }

  const parsedDate = new Date(trimmed);
  if (!Number.isNaN(parsedDate.getTime())) {
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const year = parsedDate.getFullYear();
    return `${day}/${month}/${shortYear(year)}`;
  }

  return trimmed;
};

export const StudentExamsScreen = () => {
  const { palettes, dark } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const { selectedStudent, fakeCourses, managedCourses, selectedCourse } =
    useCourses();
  const { t } = useTranslation();

  const catalogCourses = useMemo(() => {
    const byId = new Map<number, LessonCatalogEntry>();
    for (const c of [...managedCourses, ...fakeCourses]) {
      if (!byId.has(c.id)) {
        byId.set(c.id, { title: c.title, code: c.code, cfu: c.cfu });
      }
    }
    return [...byId.values()];
  }, [managedCourses, fakeCourses]);

  const coursesByTitle = useMemo(() => {
    const map = new Map<string, { code: string; cfu: number }>();
    for (const c of catalogCourses) {
      const k = normalizeTitle(c.title);
      if (!map.has(k)) map.set(k, { code: c.code, cfu: c.cfu });
    }
    return map;
  }, [catalogCourses]);

  if (!selectedStudent) return null;

  const selectedLessonCourse: LessonCatalogEntry | null = selectedCourse
    ? {
        title: selectedCourse.title,
        code: selectedCourse.code,
        cfu: selectedCourse.cfu,
      }
    : null;

  const exams = (selectedStudent.passedExams ?? []).map((name, index) => {
    const meta = lessonMetaForPassedExam(
      name,
      index,
      selectedStudent,
      coursesByTitle,
      catalogCourses,
      selectedLessonCourse,
    );
    const lessonSubtitle =
      meta != null
        ? `${meta.code} - ${meta.cfu} ${t('common.cfu', { defaultValue: 'CFU' })}`
        : null;
    return {
      name,
      date: formatExamDate(selectedStudent.passedExamsDate?.[index]),
      lessonSubtitle,
    };
  });

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      {Platform.OS === 'ios' ? (
        <View style={styles.iosHeaderContainer}>
          <View style={[styles.iosGrabber, dark && styles.iosGrabberDark]} />
          <View style={[styles.iosHeader, dark && styles.iosHeaderDark]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.closeButton}
              accessibilityRole="button"
            >
              <Text
                style={[styles.closeButtonText, { color: palettes.gray[500] }]}
              >
                {t('common.close', { defaultValue: 'Close' })}
              </Text>
            </TouchableOpacity>
            <View style={styles.iosHeaderTitleWrap} pointerEvents="none">
              <Text
                style={[
                  styles.iosHeaderTitle,
                  { color: palettes.primary[700] },
                ]}
              >
                {t('other.exams', { defaultValue: 'Exams' })}
              </Text>
            </View>
          </View>
        </View>
      ) : (
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
              size={18}
              color={palettes.primary[500]}
            />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>
            {t('other.exams', { defaultValue: 'Exams' })}
          </Text>
          <View style={styles.topBarRightSpacer} />
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          Platform.OS === 'ios'
            ? styles.scrollContentIos
            : styles.contentContainer,
          bottomBarAwareStyles,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {exams.length > 0 && (
          <View style={styles.card}>
            {exams.map((exam, index) => (
              <View key={index}>
                <View style={styles.listItem}>
                  <View style={styles.listItemContent}>
                    <Text
                      style={[
                        styles.listItemTitle,
                        dark && styles.listItemTitleDark,
                      ]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {exam.name}
                    </Text>
                    {exam.lessonSubtitle != null ? (
                      <Text style={styles.lessonMeta} numberOfLines={1}>
                        {exam.lessonSubtitle}
                      </Text>
                    ) : null}
                  </View>
                  <Text style={[styles.examDate, dark && styles.examDateDark]}>
                    {exam.date}
                  </Text>
                </View>
                {index < exams.length - 1 && (
                  <IndentedDivider
                    style={[styles.divider, dark && styles.dividerDark]}
                  />
                )}
              </View>
            ))}
          </View>
        )}

        {exams.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {t('other.noExams', { defaultValue: 'No exams available' })}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
      paddingTop: spacing[2],
      gap: spacing[4],
    },
    scrollContentIos: {
      flexGrow: 1,
      padding: spacing[5],
      gap: 22,
      paddingBottom: spacing[2],
    },
    iosHeader: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[0.5],
      minHeight: 44,
      backgroundColor: colors.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palettes.gray[300],
    },
    iosHeaderDark: {
      borderBottomColor: palettes.gray[500],
    },
    iosHeaderContainer: {
      backgroundColor: colors.surface,
    },
    iosGrabber: {
      width: 36,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: palettes.gray[600],
      alignSelf: 'center',
      marginTop: spacing[1.5],
    },
    iosGrabberDark: {
      backgroundColor: palettes.gray[500],
    },
    iosHeaderTitleWrap: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing[16],
    },
    closeButton: {
      zIndex: 1,
      flexShrink: 0,
      paddingVertical: spacing[1],
    },
    closeButtonText: {
      fontFamily: fontFamilies.body,
      fontSize: 17,
      fontWeight: fontWeights.normal,
      lineHeight: 22,
      letterSpacing: -0.43,
    },
    iosHeaderTitle: {
      textAlign: 'center',
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      lineHeight: 22,
      letterSpacing: -0.43,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing[1],
      backgroundColor: palettes.gray[100],
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palettes.gray[300],
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
      fontFamily: fontFamilies.body,
      fontSize: 17,
      fontWeight: '600',
      lineHeight: 22,
      color: palettes.primary[700],
      textAlign: 'center',
    },
    topBarRightSpacer: {
      width: 44,
      height: 44,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: shapes.lg,
      overflow: 'hidden',
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing[2.5],
      paddingRight: spacing[3],
    },
    listItemContent: {
      flex: 1,
      paddingLeft: spacing[4],
      gap: spacing[0.5],
      paddingRight: spacing[2],
    },
    listItemTitle: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      color: palettes.text[800],
      lineHeight: fontSizes.md * 1.35,
    },
    listItemTitleDark: {
      color: palettes.gray[50],
    },
    examDate: {
      flexShrink: 0,
      alignSelf: 'center',
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      color: palettes.text[800],
      textAlign: 'right',
    },
    examDateDark: {
      color: palettes.gray[50],
    },
    lessonMeta: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      color: palettes.gray[500],
      lineHeight: fontSizes.sm * 1.35,
    },
    divider: {
      alignSelf: 'stretch',
      marginLeft: spacing[4],
      minHeight: 1,
    },
    dividerDark: {
      backgroundColor: palettes.gray[500],
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing[8],
    },
    emptyStateText: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.normal,
      color: palettes.gray[500],
    },
  });
