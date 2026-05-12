export const studentsErrorCodes = {
  COURSE_NOT_SELECTED: 'COURSE_NOT_SELECTED',
  PARENT_NAVIGATOR_NOT_FOUND: 'PARENT_NAVIGATOR_NOT_FOUND',
} as const;

export type StudentsErrorCode =
  (typeof studentsErrorCodes)[keyof typeof studentsErrorCodes];

export class StudentsFeatureError extends Error {
  readonly code: StudentsErrorCode;

  constructor(message: string, code: StudentsErrorCode) {
    super(message);
    this.name = 'StudentsFeatureError';
    this.code = code;
  }
}
