export const SCREEN_HORIZONTAL_PADDING = 18;

/**
 * Month index (0 = January) at which a new academic year begins. Italian
 * universities typically roll over on September 1, so anything in September or
 * later is considered to belong to the new academic year.
 *
 * Adjust here if the institution's calendar changes (e.g. an August cutoff).
 */
const ACADEMIC_YEAR_CUTOFF_MONTH = 8;

/**
 * Returns the start year of the academic year covering `now`, formatted as a
 * 4-digit string (e.g. `'2025'` for AY 2025/2026).
 *
 * Exposed for tests and for callers that need to recompute on demand; module
 * consumers should prefer the `CURRENT_ACADEMIC_YEAR` re-export below, which
 * is evaluated once at import time.
 */
export const getCurrentAcademicYear = (now: Date = new Date()): string => {
  const calendarYear = now.getFullYear();
  const startYear =
    now.getMonth() >= ACADEMIC_YEAR_CUTOFF_MONTH
      ? calendarYear
      : calendarYear - 1;
  return String(startYear);
};

export const CURRENT_ACADEMIC_YEAR = getCurrentAcademicYear();
