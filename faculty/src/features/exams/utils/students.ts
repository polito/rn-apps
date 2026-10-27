import { ExamStudent, ExamStudentFilter } from '../types/exams';

export const getStudentFullName = (student: ExamStudent) =>
  `${student.firstName} ${student.lastName}`;

export const toggleId = (ids: Set<string>, id: string) => {
  const next = new Set(ids);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  return next;
};

export const matchesStudentFilter = (
  student: ExamStudent,
  filter: ExamStudentFilter,
) => {
  switch (filter) {
    case 'specialNeeds':
      return student.hasSpecialNeeds;
    case 'graduating':
      return student.isGraduating;
    case 'attendanceDebt':
      return student.hasAttendanceDebt;
    default:
      return true;
  }
};

export const sortStudentsByName = (
  students: ExamStudent[],
  ascending: boolean,
) =>
  [...students].sort((a, b) => {
    const result = getStudentFullName(a).localeCompare(getStudentFullName(b));
    return ascending ? result : -result;
  });
