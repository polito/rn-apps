export const TEACHING_TYPES = [
  { code: 'TL', label: 'Tutoring Lab' },
  { code: 'EL', label: 'Lab Exercises' },
  { code: 'TT', label: 'Tutoring Talents' },
  { code: 'TU', label: 'Tutoring' },
  { code: 'VL', label: 'Videostreamed Lectures' },
  { code: 'MD', label: 'Preparation of educational material' },
  { code: 'EA', label: 'Class exercise' },
  { code: 'VG', label: 'Guided tours' },
  { code: 'SD', label: 'Didactic Seminar' },
  { code: 'ES', label: 'SDSS Exercises' },
  { code: 'VE', label: 'Videostreamed exercises' },
  { code: 'TC', label: 'Challenge tutoring' },
] as const;

export const getTeachingTypeLabel = (code: string): string => {
  return (
    TEACHING_TYPES.find(teachingType => teachingType.code === code)?.label ??
    code
  );
};

export const getTeachingTypeTitle = (code: string): string => {
  return `${code} - ${getTeachingTypeLabel(code)}`;
};
