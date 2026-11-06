export type CoursePickersParamList = {
  CourseColorPicker: { courseId: number; uniqueShortcode: string };
  CourseIconPicker: { courseId: number; uniqueShortcode: string };
};

export type ColorWarningPreferences = {
  showColorWarning?: boolean;
};
