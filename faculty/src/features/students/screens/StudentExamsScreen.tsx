import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
import { AndroidTopBar } from '../components/AndroidTopBar';
import { IosTopBar, IosTopBarTextAction } from '../components/IosTopBar';
import { SCREEN_HORIZONTAL_PADDING } from '../constants';
import { StudentsStackParamList } from '../types/navigation';
import { formatExamDate } from '../utils';

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

export const StudentExamsScreen = () => {
  const { palettes, dark, colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<StudentsStackParamList>>();
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
      date: formatExamDate(selectedStudent.passedExamsDate?.[index], {
        shortYear: true,
        placeholder: '-',
      }),
      lessonSubtitle,
    };
  });

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      {Platform.OS === 'ios' ? (
        <IosTopBar
          backgroundColor={colors.surface}
          grabberColor={dark ? palettes.gray[500] : palettes.gray[400]}
          dividerColor={dark ? palettes.gray[500] : palettes.gray[300]}
          left={
            <IosTopBarTextAction
              label={t('common.close', { defaultValue: 'Close' })}
              onPress={() => navigation.goBack()}
              color={palettes.gray[500]}
              align="left"
            />
          }
          center={
            <Text style={styles.iosHeaderTitle}>
              {t('other.exams', { defaultValue: 'Exams' })}
            </Text>
          }
        />
      ) : (
        <AndroidTopBar
          onBack={() => navigation.goBack()}
          title={t('other.exams', { defaultValue: 'Exams' })}
        />
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
              <View key={`${exam.name}-${index}`}>
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
      paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
      paddingTop: spacing[2],
      gap: spacing[4],
    },
    scrollContentIos: {
      flexGrow: 1,
      padding: spacing[5],
      gap: spacing[4],
      paddingBottom: spacing[2],
    },
    iosHeaderTitle: {
      textAlign: 'center',
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      lineHeight: 22,
      letterSpacing: -0.43,
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
