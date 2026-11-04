import { Lecture as ApiLecture } from '@polito/student-api-client';

import { CourseOverview } from '../../../core/types/api';
import { Lecture } from '../types/Lecture';

/**
 * Finds the course (or course module) identified by `courseId` in the
 * student's course list, returning its unique shortcode and display name.
 */
const findCourseInfo = (courseId: number, courses: CourseOverview[]) => {
  for (const course of courses) {
    const modules = course.modules ?? [];
    const moduleIndex = modules.findIndex(module => module.id === courseId);
    if (moduleIndex >= 0) {
      return {
        uniqueShortcode: `${course.uniqueShortcode}${moduleIndex + 1}`,
        name: modules[moduleIndex].name,
      };
    }
  }

  const course = courses.find(c => c.id === courseId);
  return {
    uniqueShortcode: course?.uniqueShortcode,
    name: course?.name,
  };
};

/**
 * Enriches a lecture with the information of the course it belongs to.
 *
 * The lectures endpoint localizes the course name according to the app
 * language (e.g. "Signal theory and Signal processing"), while the courses
 * endpoint returns the official one (e.g. "Teoria ed elaborazione dei
 * segnali"). The latter is preferred so that lectures are labeled exactly
 * like the corresponding course in the rest of the app.
 *
 * @param lecture The lecture returned by the API
 * @param courses The student's course list
 * @param courseId The id of the course (or module) to look up, if different
 * from the lecture's own `courseId`
 */
export const resolveLectureCourse = (
  lecture: ApiLecture,
  courses: CourseOverview[],
  courseId: number = lecture.courseId,
): Lecture => {
  const { uniqueShortcode, name } = findCourseInfo(courseId, courses);
  return {
    ...lecture,
    courseName: name || lecture.courseName,
    uniqueShortcode,
  };
};
