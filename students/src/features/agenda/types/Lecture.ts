import { Lecture as ApiLecture } from '@polito/student-api-client';

/**
 * A lecture enriched with the information of the course it belongs to.
 * `courseName` holds the name from the course list rather than the localized
 * one returned by the lectures endpoint (see `resolveLectureCourse`).
 */
export interface Lecture extends ApiLecture {
  uniqueShortcode?: string;
}
