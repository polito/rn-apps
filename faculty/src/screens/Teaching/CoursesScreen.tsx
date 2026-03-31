import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  IndentedDivider,
  OverviewList,
  Section,
  SectionHeader,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';

import { useCourses } from '../../core/contexts/CoursesContext';
import { CourseListItem } from './CourseListItem';

export const CoursesScreen = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { fakeCourses } = useCourses(); // Usa il hook per ottenere i dati

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      // contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.sectionsContainer}>
        {fakeCourses &&
          (fakeCourses.length > 0 ? (
            Object.entries(
              fakeCourses.reduce(
                (byYear, course) => {
                  (byYear[course.year] = byYear[course.year] ?? []).push(
                    course,
                  );
                  return byYear;
                },
                {} as Record<string, typeof fakeCourses>,
              ) as Record<string, typeof fakeCourses>,
            ).map(([year, courses]) => (
              <Section key={year}>
                <SectionHeader
                  title={
                    year !== 'undefined'
                      ? `${t('common.academicYearShort')} ${year}`
                      : t('coursesScreen.otherCoursesSectionTitle')
                  }
                  accessibilityLabel={`${
                    year !== 'undefined'
                      ? `${t('common.academicYearShort')} ${year}`
                      : t('coursesScreen.otherCoursesSectionTitle')
                  }. ${t('coursesScreen.total', { total: courses.length })}`}
                />
                <OverviewList style={styles.listContainer}>
                  {courses.map((course, index) => (
                    <React.Fragment key={course.code}>
                      <CourseListItem course={course} />
                      {index < courses.length - 1 && (
                        <IndentedDivider style={styles.divider} />
                      )}
                    </React.Fragment>
                  ))}
                </OverviewList>
              </Section>
            ))
          ) : (
            <OverviewList emptyStateText={t('coursesScreen.emptyState')} />
          ))}
      </View>
    </ScrollView>
  );
};

const createStyles = ({ palettes, spacing }: Theme) =>
  StyleSheet.create({
    scrollContainer: {
      paddingHorizontal: spacing[5],
    },
    sectionsContainer: {
      paddingVertical: spacing[5],
    },
    listContainer: {
      borderRadius: spacing[3],
      marginHorizontal: spacing[5],
      elevation: 0,
    },
    divider: {
      marginLeft: spacing[4],
      backgroundColor: palettes.gray[300],
    },
  });
