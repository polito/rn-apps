type FormatExamDateOptions = {
  /** When true, render the year as 2 digits (e.g. `25` instead of `2025`). */
  shortYear?: boolean;
  /** Returned when the input is missing/empty/unparseable-empty. */
  placeholder?: string;
};

/**
 * Normalize a backend-supplied exam date into `DD/MM/YYYY` (or `DD/MM/YY` when
 * `shortYear` is set). Accepts inputs in `YYYY-MM-DD`, `DD/MM/YYYY`,
 * `YYYY/MM/DD`, or anything `Date` can parse; falls back to the original
 * trimmed string when the format isn't recognized.
 */
export const formatExamDate = (
  dateValue?: string,
  options: FormatExamDateOptions = {},
): string => {
  const { shortYear = false, placeholder = '—' } = options;

  if (!dateValue) return placeholder;
  const trimmed = dateValue.trim();
  if (!trimmed) return placeholder;

  const formatYear = (year: string | number): string =>
    shortYear ? String(year).slice(-2) : String(year);

  const slashParts = trimmed.split('/');
  if (slashParts.length === 3) {
    const [first, second, third] = slashParts;
    if (first.length === 4) {
      return `${second.padStart(2, '0')}/${formatYear(first)}/${third}`;
    }
    return `${first.padStart(2, '0')}/${second.padStart(2, '0')}/${formatYear(third)}`;
  }

  const dashParts = trimmed.split('-');
  if (dashParts.length === 3) {
    const [year, month, day] = dashParts;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${formatYear(year)}`;
  }

  const parsedDate = new Date(trimmed);
  if (!Number.isNaN(parsedDate.getTime())) {
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const year = parsedDate.getFullYear();
    return `${day}/${month}/${formatYear(year)}`;
  }

  return trimmed;
};
