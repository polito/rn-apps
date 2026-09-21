import {
  Course,
  CourseModuleOverview,
  CourseOverview,
} from '@polito/student-api-client';

export function buildCourseDetail(
  source: CourseOverview | CourseModuleOverview,
  overrides: Partial<Course> = {},
) {
  return {
    id: source.id,
    name: source.name,
    shortcode: source.shortcode,
    teachingPeriod: source.teachingPeriod,
    teacherId: source.teacherId,
    teacherName: source.teacherName,
    isOverBooking: source.isOverBooking,
    enrollmentRole: source.enrollmentRole,
    year: source.year,
    cfu: (source as CourseOverview).cfu ?? 0,
    links: [],
    moodleCourses: [],
    vcPreviousYears: [],
    vcOtherCourses: [],
    notifications: { notices: false, files: false, lectures: false },
    staff: [],
    ...overrides,
  };
}
