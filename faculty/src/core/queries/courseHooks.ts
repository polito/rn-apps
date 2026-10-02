import { pluckData } from '@polito/lib/core';
import { CoursesApi } from '@polito/student-api-client';
import { useQuery } from '@tanstack/react-query';

const COURSES_QUERY_KEY = ['courses'];

const useCoursesClient = (): CoursesApi => {
  return new CoursesApi();
};

export const useGetCourses = () => {
  const coursesClient = useCoursesClient();

  return useQuery({
    queryKey: COURSES_QUERY_KEY,
    queryFn: () => coursesClient.getCourses().then(pluckData),
  });
};

export const getCourseKey = (courseId: number) => ['course', courseId];

export const useGetCourse = (courseId: number | undefined) => {
  const coursesClient = useCoursesClient();

  return useQuery({
    queryKey: getCourseKey(courseId!),
    queryFn: () =>
      coursesClient
        .getCourse({ courseId: courseId! })
        .then(pluckData)
        .then(course => {
          const period = course.teachingPeriod?.split('-');
          if (period && period.length > 1 && period[0] === period[1]) {
            course.teachingPeriod = period[0];
          }
          return course;
        }),
    enabled: courseId !== undefined,
    staleTime: Infinity,
  });
};
