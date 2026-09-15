import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ListItem, OverviewList } from '@polito/lib/ui';
import { OfferingCourseOverview } from '@polito/student-api-client';

import { useDegreeContext } from '../contexts/DegreeContext';
import { CourseTrailingItem } from './CourseTrailingItem';

interface Props {
  courses: OfferingCourseOverview[];
  disabled?: boolean;
}
export const GroupCoursesExpanded = ({ courses, disabled }: Props) => {
  const { year } = useDegreeContext();
  const { t } = useTranslation();

  return (
    <View
      accessibilityRole="list"
      accessibilityLabel={t('offeringScreen.coursesList', {
        count: courses.length,
      })}
    >
      <OverviewList rounded={true} style={{ elevation: 0 }}>
        {courses.map(course => {
          return (
            <ListItem
              title={course.name}
              titleProps={{ numberOfLines: undefined }}
              key={course.name}
              linkTo={{
                screen: 'DegreeCourse',
                params: {
                  courseShortcode: course.shortcode,
                  teachingYear: year,
                },
              }}
              trailingItem={<CourseTrailingItem cfu={course.cfu} />}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityLabel={`${course.name}, ${course.cfu} ${t('common.cfu')}`}
              accessibilityHint={t('offeringScreen.tapToViewCourse')}
              accessibilityState={{ disabled: !!disabled }}
            />
          );
        })}
      </OverviewList>
    </View>
  );
};
