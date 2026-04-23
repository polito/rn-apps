import { useMemo } from 'react';

/** Compute on-device cache location for course files. */
export const useCourseFilesCachePath = (courseId?: number) => {
  return useMemo(() => {
    if (!courseId) return '';
    return `courses/${courseId}/files`;
  }, [courseId]);
};
