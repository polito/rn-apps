import {
  Exam as ApiExam,
  Course,
  CourseNotices,
  ExamGrade,
  ExamStatusEnum,
  Lecture,
  Message,
  MessageType,
  NewsItem,
  NewsItemOverview,
  Person,
  ProvisionalGrade,
  ProvisionalGradeStateEnum,
  StudentCareer,
  Ticket,
  TicketOverview,
  TicketStatus,
} from '@polito/student-api-client';

export const TEST_STUDENT: StudentCareer = {
  status: 'active',
  degreeId: '81-6',
  degreeCode: 'LM-32',
  degreeLevel: 'Corso di Laurea Magistrale in',
  degreeName: 'INGEGNERIA INFORMATICA (COMPUTER ENGINEERING)',
  firstEnrollmentYear: 2021,
  lastEnrollmentYear: 2022,
  isCurrentlyEnrolled: true,
  averageGrade: 27.5,
  estimatedFinalGrade: 105,
  isFinalGradePurged: false,
  mastersAdmissionAverageGrade: null,
  totalOnTimeExamPoints: null,
  maxOnTimeExamPoints: 0,
  excludedCreditsNumber: null,
  totalCredits: 120,
  totalAttendedCredits: 90,
  totalAcquiredCredits: 60,
  enrollmentCredits: 120,
  enrollmentAttendedCredits: 90,
  enrollmentAcquiredCredits: 60,
};

// No spec example for /people/{personId}
export const TEST_TEACHER: Person = {
  id: 2893,
  firstName: 'Test',
  lastName: 'Teacher',
  picture: null,
  role: 'professor',
  email: 'teacher@polito.it',
  phoneNumbers: [],
  facilityShortName: 'DAUIN',
  profileUrl: '',
  courses: [],
};

export const WEB_APPS_II_DETAIL: Course = {
  id: 252121,
  name: 'Web Applications II',
  shortcode: '01TXSOV',
  teachingPeriod: '2-2',
  teacherId: 2235,
  teacherName: 'Giovanni Malnati',
  isOverBooking: false,
  enrollmentRole: 'student',
  year: '2025',
  cfu: 6,
  staff: [],
  links: [],
  moodleCourses: null,
  vcPreviousYears: [],
  vcOtherCourses: [],
  notifications: { notices: false, files: false, lectures: false },
};

export const PROGRAMMING_MODULE_A_DETAIL: Course = {
  id: 251008,
  name: 'Programming Module A',
  shortcode: '01NYHOV',
  teachingPeriod: '2-2',
  teacherId: 3001,
  teacherName: 'Mario Rossi',
  isOverBooking: false,
  enrollmentRole: 'student',
  year: '2025',
  cfu: 10,
  staff: [],
  links: [],
  moodleCourses: null,
  vcPreviousYears: [],
  vcOtherCourses: [],
  notifications: { notices: false, files: false, lectures: false },
};

export const TEST_MESSAGE: Message = {
  id: 1001,
  title: 'Welcome to Politecnico di Torino',
  message: null,
  type: MessageType.Personal,
  senderId: null,
  sentAt: new Date('2026-01-01T10:00:00Z'),
  isRead: false,
};

export const AVAILABLE_EXAM: ApiExam = {
  id: 887981,
  courseId: 262789,
  courseShortcode: '01NYHOV',
  courseName: 'System and device programming (AA-ZZ)',
  teacherId: 2893,
  type: 'Scritto',
  status: ExamStatusEnum.Available,
  bookingStartsAt: null,
  bookingEndsAt: new Date('2027-09-02T14:00:00Z'),
  examStartsAt: new Date('2027-09-08T14:00:00Z'),
  examEndsAt: new Date('2027-09-08T18:00:00Z'),
  bookedCount: 42,
  availableCount: 108,
  moduleNumber: 1,
  notes: null,
  places: [],
  isReschedulable: false,
  question: null,
  feedback: null,
  requestReason: null,
  requestDetails: null,
};

export const BOOKED_EXAM: ApiExam = {
  ...AVAILABLE_EXAM,
  status: ExamStatusEnum.Booked,
};

export const TEST_RECORDED_GRADE: ExamGrade = {
  courseName: 'Operating Systems',
  credits: 10,
  grade: '28',
  date: new Date('2025-06-15'),
  teacherId: TEST_TEACHER.id,
  onTimeExamPoints: null,
  shortcode: '01NYHOV',
  academicYear: 2025,
  creditsCountTowardsDegree: true,
};

export const PROVISIONAL_GRADE_CONFIRMABLE: ProvisionalGrade = {
  id: 5001,
  examId: 887981,
  courseShortcode: '01NYHOV',
  courseName: 'System and device programming (AA-ZZ)',
  teacherId: 2893,
  credits: 10,
  grade: '28',
  date: new Date('2027-06-15'),
  state: ProvisionalGradeStateEnum.Confirmed,
  stateDescription: 'Confirmed',
  teacherMessage: null,
  isWithdrawn: false,
  isFailure: false,
  canBeAccepted: true,
  canBeRejected: true,
  confirmedAt: new Date('2027-06-14'),
  rejectedAt: null,
  rejectingExpiresAt: new Date('2028-06-20'),
};

export const TEST_COURSE_NOTICE: CourseNotices = {
  id: 332559,
  publishedAt: new Date('2024-09-22T14:00:00Z'),
  expiresAt: null,
  content: '<p>Exam postponed to next week.</p>',
};

export const TEST_NEWS_OVERVIEW: NewsItemOverview = {
  id: 201,
  title: 'Exam session postponed',
  isEvent: false,
  shortDescription: 'Due to building renovations',
  eventStartTime: null,
  eventEndTime: null,
  createdAt: new Date('2025-09-01T10:00:00Z'),
};

// NewsItem (detail) includes all overview fields plus location, htmlContent, extras.
export const TEST_NEWS_ITEM: NewsItem = {
  id: 201,
  title: 'Exam session postponed',
  isEvent: false,
  shortDescription: 'Due to building renovations',
  eventStartTime: null,
  eventEndTime: null,
  createdAt: new Date('2025-09-01T10:00:00Z'),
  location: '',
  htmlContent: '<p>The winter exam session has been postponed.</p>',
  extras: [],
};

// unreadCount: 0 avoids needing to mock PUT /tickets/{id}/read on the detail screen.
export const TEST_TICKET_OVERVIEW: TicketOverview = {
  id: 5500,
  subject: 'Library card renewal',
  message: 'I need help renewing my library card.',
  status: TicketStatus.Open,
  hasAttachments: false,
  needsFeedback: false,
  isFromAgent: false,
  agentId: null,
  unreadCount: 0,
  createdAt: new Date('2025-09-01T10:00:00Z'),
  updatedAt: new Date('2025-09-02T09:00:00Z'),
};

export const TEST_TICKET: Ticket = {
  ...TEST_TICKET_OVERVIEW,
  replies: [],
  attachments: [],
  duplicateId: null,
};

// courseId 999999 does not match any course in the /v2/courses spec example, so
// addUniqueShortcodeToLectures leaves uniqueShortcode undefined. processLectures
// then passes the item through with `if (!item.uniqueShortcode) return true`.
// The lecture date is outside the current week but agenda hooks do not filter
// lectures by date, so it still appears in the rendered AgendaWeek.
export const TEST_LECTURE: Lecture = {
  id: 12131312,
  courseId: 999999,
  courseName: 'Human Computer Interaction',
  teacherId: 1847,
  startsAt: new Date('2025-10-07T14:30:00Z'),
  endsAt: new Date('2025-10-07T17:30:00Z'),
  type: 'Lezione',
  description: null,
  place: {
    buildingId: 'TO_CIT22',
    floorId: 'XPTE',
    name: 'Aula 1P',
    roomId: '036',
    siteId: 'TO_CIT',
  },
  virtualClassrooms: [],
};
