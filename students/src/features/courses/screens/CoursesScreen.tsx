import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView } from 'react-native';

import {
  BottomBarSpacer,
  OverviewList,
  RefreshControl,
  Section,
  SectionHeader,
  useTheme,
} from '@polito/lib/ui';

import { useAccessibility } from '../../../core/hooks/useAccessibilty';
import { useGetCourses } from '../../../core/queries/courseHooks';
import { CourseOverview } from '../../../core/types/api';
import { CourseListItem } from '../components/CourseListItem';

export const CoursesScreen = () => {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const coursesQuery = useGetCourses();
  const { accessibilityListLabel } = useAccessibility();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingVertical: spacing[5],
      }}
      refreshControl={<RefreshControl queries={[coursesQuery]} manual />}
    >
      <SafeAreaView>
        {coursesQuery.data &&
          (coursesQuery.data.length > 0 ? (
            Object.entries(
              coursesQuery.data.reduce(
                (byPeriod, course) => {
                  (byPeriod[course.teachingPeriod] =
                    byPeriod[course.teachingPeriod] ?? []).push(course);
                  return byPeriod;
                },
                {} as Record<string, CourseOverview[]>,
              ) as Record<string, CourseOverview[]>,
            ).map(([period, courses]) => (
              <Section key={period}>
                <SectionHeader
                  title={
                    period !== 'undefined'
                      ? `${t('common.period')} ${period}`
                      : t('coursesScreen.otherCoursesSectionTitle')
                  }
                  accessibilityLabel={`${
                    period !== 'undefined'
                      ? `${t('common.period')} ${period}`
                      : t('coursesScreen.otherCoursesSectionTitle')
                  }. ${t('coursesScreen.total', { total: courses.length })}`}
                />
                <OverviewList indented>
                  {courses.map((course, index) => (
                    <CourseListItem
                      key={course.shortcode + '' + course.id}
                      course={course}
                      accessible={true}
                      accessibilityLabel={accessibilityListLabel(
                        index,
                        courses.length,
                      )}
                    />
                  ))}
                </OverviewList>
              </Section>
            ))
          ) : (
            <OverviewList emptyStateText={t('coursesScreen.emptyState')} />
          ))}
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};
