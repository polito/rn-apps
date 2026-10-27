export type ExamStudent = {
  id: string;
  firstName: string;
  lastName: string;
  courseCode: string;
  hasSpecialNeeds: boolean;
  isGraduating: boolean;
  hasAttendanceDebt: boolean;
  isFirstAttendance: boolean;
  hasExtraTime: boolean;
};

export type ExamStudentFilter =
  | 'all'
  | 'specialNeeds'
  | 'graduating'
  | 'attendanceDebt';

export type ExamBookingStatus = 'bookable' | 'closed';

export type ExamPlace = {
  id: string;
  name: string;
};

export type Exam = {
  id: number;
  courseId: number;
  courseName: string;
  courseColor: string;
  courseIcon: string;
  teachingPeriod: number;
  type: string;
  examStartsAt: Date;
  examEndsAt: Date;
  bookingEndsAt: Date;
  bookingStatus: ExamBookingStatus;
  places: ExamPlace[];
  bookedStudentIds: string[];
  absentStudentIds: string[];
};
