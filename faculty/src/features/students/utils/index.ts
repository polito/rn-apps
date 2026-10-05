/**
 * Formats an enrolment year the same way as the students app.
 * `firstEnrollmentYear` is the second year of the cohort (2026 → "2025/2026").
 */
export const getStudentEnrollmentYear = (
  firstEnrollmentYear?: number | string | null,
) => {
  if (firstEnrollmentYear == null || firstEnrollmentYear === '') return '...';
  const year = Number(firstEnrollmentYear);
  if (!Number.isFinite(year)) return '...';
  return `${year - 1}/${year}`;
};

/** End year of a "2024/2025" period, stored like `firstEnrollmentYear`. */
export const enrollmentYearFromPeriod = (period?: string | null) => {
  const endYear = period?.split('/')[1]?.trim();
  return endYear && Number.isFinite(Number(endYear)) ? endYear : '';
};
