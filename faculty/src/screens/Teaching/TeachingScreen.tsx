import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import {
  formatDateFromString,
  useOfflineDisabled,
  usePreferencesContext,
} from '@polito/lib/core';
import {
  BottomBarSpacer,
  Icon,
  ListItem,
  OverviewList,
  RefreshControl,
  Row,
  ScreenDateTime,
  Section,
  SectionHeader,
  Text,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import type { Theme } from '@polito/lib/ui';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DateTime } from 'luxon';

import { useCourses } from '../../core/contexts/CoursesContext';
import { useGetCourses } from '../../core/queries/courseHooks';
import { AppPreferences } from '../../core/types/preferences';
import { CourseIndicator } from './CourseIndicator';
import { CourseListItem } from './CourseListItem';
import { TeachingStackParamList, useTeachingScroll } from './TeachingNavigator';

const getUniqueShortcode = (course: {
  shortcode: string;
  modules?: unknown[] | null;
}) =>
  course.modules && course.modules.length > 0
    ? course.shortcode
    : `${course.shortcode}1`;

const examTime = (date: string) => {
  if (date === 'Oggi') return DateTime.now().startOf('day').toMillis();
  const parsed = DateTime.fromISO(date);
  return parsed.isValid ? parsed.toMillis() : Number.POSITIVE_INFINITY;
};

const isUpcomingExam = (date: string) => {
  if (date === 'Oggi') return true;
  const parsed = DateTime.fromISO(date);
  return (
    parsed.isValid && parsed.endOf('day').toMillis() > DateTime.now().toMillis()
  );
};

export const TeachingScreen = () => {
  const { t } = useTranslation();
  const coursesQuery = useGetCourses();
  const isOffline = useOfflineDisabled();
  const { courses: coursePreferences } =
    usePreferencesContext<AppPreferences>();
  const { fakeExams, setSelectedCourse, setSelectedExam } = useCourses();
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();
  const { colors } = useTheme();
  const styles = useStylesheet(createStyles);
  const headerHeight = useHeaderHeight();
  const { setIsScrolled } = useTeachingScroll();

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIsScrolled(e.nativeEvent.contentOffset.y > -headerHeight + 10);
  };

  const courses = useMemo(
    () =>
      (coursesQuery.data ?? []).filter(
        course => !coursePreferences[getUniqueShortcode(course)]?.isHidden,
      ),
    [coursesQuery.data, coursePreferences],
  );

  const hiddenCoursesCount = useMemo(() => {
    if (!coursesQuery.data) return undefined;
    let count = 0;
    coursesQuery.data.forEach(course => {
      const uniqueShortcode = getUniqueShortcode(course);
      if (coursePreferences[uniqueShortcode]?.isHidden) {
        count += 1 + (course.modules?.length ?? 0);
        return;
      }
      if (!course.modules?.length) return;
      const hiddenModules = course.modules.filter(
        (_, index) =>
          coursePreferences[`${course.shortcode}${index + 1}`]?.isHidden,
      ).length;
      count += hiddenModules;
      if (hiddenModules === course.modules.length) {
        count += 1;
      }
    });
    return count > 0 ? count : undefined;
  }, [coursesQuery.data, coursePreferences]);

  const exams = useMemo(() => {
    if (!coursesQuery.data) return [];

    const hiddenCourses = Object.keys(coursePreferences).filter(
      key => coursePreferences[key].isHidden,
    );

    return fakeExams
      .filter(exam => {
        const course = coursesQuery.data?.find(
          item => item.name === exam.subject,
        );
        const uniqueShortcode = course ? getUniqueShortcode(course) : '';
        return (
          !hiddenCourses.includes(uniqueShortcode) && isUpcomingExam(exam.date)
        );
      })
      .sort((a, b) => examTime(a.date) - examTime(b.date))
      .slice(0, 4);
  }, [coursePreferences, coursesQuery.data, fakeExams]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="never"
      contentInset={{ top: headerHeight }}
      scrollIndicatorInsets={{ top: headerHeight }}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl
          queries={[coursesQuery]}
          manual
          progressViewOffset={headerHeight}
        />
      }
    >
      <View style={styles.topSpacer} />

      <Section>
        <SectionHeader
          title={t('other.myCourses')}
          linkTo="MyCourses"
          linkToMoreCount={hiddenCoursesCount}
        />
        <OverviewList
          loading={coursesQuery.isLoading && !isOffline}
          indented
          emptyStateText={(() => {
            if (isOffline) return t('common.cacheMiss');
            return (coursesQuery.data?.length ?? 0) > 0
              ? t('teachingScreen.allCoursesHidden')
              : t('coursesScreen.emptyState');
          })()}
        >
          {courses.map(course => (
            <CourseListItem
              key={`${course.shortcode}${course.id}`}
              course={{
                id: course.id,
                title: course.name,
                code: course.shortcode,
                uniqueShortcode: getUniqueShortcode(course),
              }}
              disabled={course.id === null}
              onPress={() => {
                if (course.id === null) return;
                setSelectedCourse(null);
                navigation.navigate('Course', { id: course.id });
              }}
            />
          ))}
        </OverviewList>
      </Section>

      <Section>
        <SectionHeader
          title={t('other.appeals')}
          linkTo="ExamsCalls"
          linkToMoreCount={
            coursesQuery.data ? fakeExams.length - exams.length : undefined
          }
        />
        <OverviewList
          loading={!isOffline && coursesQuery.isLoading}
          indented
          emptyStateText={
            isOffline && coursesQuery.isLoading
              ? t('common.cacheMiss')
              : t('examsScreen.emptyState')
          }
        >
          {exams.map(exam => {
            const course = courses.find(item => item.name === exam.subject);
            return (
              <ListItem
                key={exam.id}
                title={exam.subject}
                leadingItem={
                  <CourseIndicator
                    uniqueShortcode={course ? getUniqueShortcode(course) : ''}
                  />
                }
                isAction
                subtitle={
                  <Row gap={2} pt={1} align="center">
                    <ScreenDateTime
                      inListItem
                      date={
                        exam.date === 'Oggi'
                          ? t('other.today')
                          : formatDateFromString(exam.date)
                      }
                    />
                    {exam.where ? (
                      <Row gap={1} flexShrink={1} align="center">
                        <Icon
                          icon={faLocationDot}
                          color={colors.secondaryText}
                        />
                        <Text
                          variant="secondaryText"
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={styles.locationText}
                        >
                          {exam.where}
                        </Text>
                      </Row>
                    ) : null}
                  </Row>
                }
                onPress={() => {
                  setSelectedExam(exam);
                  navigation.navigate('Exam', { id: exam.id });
                }}
              />
            );
          })}
        </OverviewList>
      </Section>

      <BottomBarSpacer />
    </ScrollView>
  );
};

const createStyles = (_theme: Theme) =>
  StyleSheet.create({
    topSpacer: {
      paddingTop: 20,
    },
    locationText: {
      flexShrink: 1,
    },
  });
