import { OfferingCourseOverview } from '@polito/api-client/models/OfferingCourseOverview';
import { ListItem } from '@polito/lib';
import { OverviewList } from '@polito/lib';

import { useDegreeContext } from '../contexts/DegreeContext';
import { CourseTrailingItem } from './CourseTrailingItem';

interface Props {
  courses: OfferingCourseOverview[];
  disabled?: boolean;
}
export const GroupCoursesExpanded = ({ courses, disabled }: Props) => {
  const { year } = useDegreeContext();

  return (
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
          />
        );
      })}
    </OverviewList>
  );
};
