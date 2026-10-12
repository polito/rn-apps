import { CourseOverview } from '../../../core/types/api';

export const formatAcademicYear = (year?: string | number) => {
  if (year === undefined || year === null || year === '') return '';
  const value = `${year}`;
  if (value.includes('/')) return value;
  const endYear = Number(value);
  if (Number.isNaN(endYear)) return value;
  return `${endYear - 1}/${value.slice(-2)}`;
};

export const isCourseDetailed = (course: CourseOverview) => {
  if (course.id !== null) return true;
  if (course.previousEditions.some(edition => edition.id !== null)) return true;
  return false;
};
