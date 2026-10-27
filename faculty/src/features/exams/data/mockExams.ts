import { Exam, ExamStudent } from '../types/exams';

const firstNames = [
  'Luca',
  'Giulia',
  'Alessia',
  'Marco',
  'Sofia',
  'Federico',
  'Chiara',
  'Matteo',
  'Elena',
  'Antonio',
  'Veronica',
  'Gianluca',
];

const lastNames = [
  'Bianchi',
  'Carta',
  'Rossi',
  'Moretti',
  'Gallo',
  'Esposito',
  'Fontana',
  'Greco',
  'Rinaldi',
  'Ferraro',
  'Giusti',
  'Verdiana',
];

const buildStudents = (count: number, offset: number): ExamStudent[] =>
  Array.from({ length: count }, (_, index) => {
    const seed = index + offset;
    return {
      id: `s${314534 + seed}`,
      firstName: firstNames[seed % firstNames.length],
      lastName:
        lastNames[Math.floor(seed / firstNames.length) % lastNames.length],
      courseCode: seed % 3 === 0 ? 'ING-INF' : 'ING-ELN',
      hasSpecialNeeds: seed % 9 === 2,
      isGraduating: seed % 40 === 0,
      hasAttendanceDebt: seed % 8 === 1,
      isFirstAttendance: seed % 8 !== 1,
      hasExtraTime: seed % 9 === 2 || seed % 13 === 1,
    };
  });

export const mockCourseStudents: Record<number, ExamStudent[]> = {
  1: buildStudents(120, 0),
  2: buildStudents(95, 7),
  3: buildStudents(140, 21),
  4: buildStudents(140, 21),
};

const atDayOffset = (days: number, hours: number, minutes = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const bookedIds = (courseId: number, count: number) =>
  mockCourseStudents[courseId].slice(0, count).map(student => student.id);

export const mockExams: Exam[] = [
  {
    id: 1,
    courseId: 1,
    courseName: 'Progettazione elettronica digitale (AA-DZ)',
    courseColor: '#9333EA',
    courseIcon: 'faFlaskVial',
    teachingPeriod: 1,
    type: 'Written exam with open or closed answers via PC',
    examStartsAt: atDayOffset(0, 13),
    examEndsAt: atDayOffset(0, 16),
    bookingEndsAt: atDayOffset(-3, 23, 59),
    bookingStatus: 'bookable',
    places: [
      { id: 'R5', name: 'Room 5' },
      { id: 'R3', name: 'Room 3' },
      { id: 'R1', name: 'Room 1' },
    ],
    bookedStudentIds: bookedIds(1, 80),
    absentStudentIds: [],
  },
  {
    id: 2,
    courseId: 2,
    courseName: 'Digital Electronics Design',
    courseColor: '#EA580C',
    courseIcon: 'faFlaskVial',
    teachingPeriod: 1,
    type: 'Oral exam',
    examStartsAt: atDayOffset(8, 14),
    examEndsAt: atDayOffset(8, 17),
    bookingEndsAt: atDayOffset(4, 23, 59),
    bookingStatus: 'bookable',
    places: [{ id: 'LAB1', name: 'Lab 1' }],
    bookedStudentIds: bookedIds(2, 42),
    absentStudentIds: [],
  },
  {
    id: 3,
    courseId: 3,
    courseName: 'Electromagnetism and Circuit theory',
    courseColor: '#DB2777',
    courseIcon: 'faFlaskVial',
    teachingPeriod: 1,
    type: 'Written exam',
    examStartsAt: atDayOffset(30, 8, 30),
    examEndsAt: atDayOffset(30, 11, 30),
    bookingEndsAt: atDayOffset(25, 23, 59),
    bookingStatus: 'bookable',
    places: [{ id: 'R2T', name: 'Room 2T' }],
    bookedStudentIds: bookedIds(3, 110),
    absentStudentIds: [],
  },
  {
    id: 4,
    courseId: 4,
    courseName: 'Quantum Mechanics and Applications',
    courseColor: '#2563EB',
    courseIcon: 'faFlaskVial',
    teachingPeriod: 1,
    type: 'Written exam',
    examStartsAt: atDayOffset(30, 11, 30),
    examEndsAt: atDayOffset(30, 14, 30),
    bookingEndsAt: atDayOffset(25, 23, 59),
    bookingStatus: 'closed',
    places: [{ id: 'R2T', name: 'Room 2T' }],
    bookedStudentIds: bookedIds(4, 64),
    absentStudentIds: [],
  },
];
