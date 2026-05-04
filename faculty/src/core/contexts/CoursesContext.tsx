import { ReactNode, createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  IconDefinition,
  faBullhorn,
  faCircleExclamation,
  faCircleRadiation,
  faComments,
  faEnvelope,
  faFileSignature,
  faHouseCrack,
  faHouseFire,
  faIdCard,
  faPeopleRobbery,
  faPersonCirclePlus,
  faPersonWalkingArrowRight,
  faTruckMedical,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';

export interface Notice {
  id: number;
  title: string;
  content: string;
  startDate: string;
  endDate?: string;
  visible: boolean;
}

export interface Staff {
  id: number;
  name: string;
  role: string;
  access: string;
  idProfile?: number;
}

interface ExamCall {
  id: number;
  name: string;
  date: string;
  professor: string;
  idExam: number;
}

interface File {
  id: number;
  name: string;
  date: string;
  size: number;
  mimeType: string;
  dirId: number;
}

interface Assignment {
  id: number;
  name: string;
  date: string;
  size: number;
  student: string;
  mimeType: string;
}

interface Directory {
  id: number;
  name: string;
  files: File[];
}

interface Lesson {
  id: number;
  title: string;
  date: string;
  time: string;
  content?: string;
  staff?: Staff[];
  room?: string;
  language?: string;
}

interface Student {
  id: string;
  name: string;
  surname: string;
  year: string;
  exam: string;
  gender?: string;
  cityOfBirth: string;
  countryOfBirth?: string;
  degreeCourse: string;
  passedExams: string[];
  passedExamsDate: string[];
  /** When set, overrides catalog lookup for passed-exam lesson code (same length as passedExams). */
  passedExamsLessonCode?: string[];
  passedExamsLessonCfu?: number[];
}

interface Group {
  id: number;
  title: string;
  students: Student[];
}

interface AgendaItem {
  id: number;
  title: string;
  description: string;
  time: string;
  date: string;
  live?: boolean;
  type: string;
  location?: string;
}

interface Service {
  id: string;
  name: string;
  icon: IconDefinition;
  linkTo: string;
  favorite: boolean;
}

interface Issue {
  id: number;
  title: string;
  date: string;
  where: string;
  details: string;
  status: string;
}
interface Course {
  id: number;
  code: string;
  managed: boolean;
  title: string;
  subtitle: string;
  period: number;
  registered: number;
  teacherId: string;
  year: string;
  cfu: number;
  notices: Notice[]; // Aggiungiamo le notifiche per ogni corso
  staff: Staff[];
  examcalls: ExamCall[];
  guide: string;
  directories: Directory[];
  lessons: Lesson[];
  assignments: Assignment[];
  students: Student[];
  groups: Group[];
}

interface Exam {
  id: number;
  subject: string;
  date: string;
  period: number;
  endDate: string;
  where: string;
  modality: string;
  booked: number;
  students: Student[];
}

interface Profile {
  id: number;
  name: string;
  surname: string;
  taxDomicilie: string;
  IBAN: string;
  phoneNumber: number;
  mail: string;
  privateMail: string;
  role: string;
  role2?: string;
  role3?: string;
  sector: string;
  publications: string[];
  department: string;
  heldCourses: string[];
  collaboratingCourses: string[];
  preferred: boolean;
}

interface Emergency {
  id: string;
  name: string;
  icon: IconDefinition;
  rules: string[];
}

interface User {
  name: string;
  domicilie: string;
  taxDomicilie: string;
  IBAN: string;
  phone: string;
  email: string;
  privateMail: string;
  role2?: string;
  role3?: string;
  sector: string;
  publications: string[];
}

interface Booking {
  id: number;
  type: number;
  title: string;
  powerOutput?: boolean;
  capacity?: number;
  where?: string;
  date: string;
  time: string;
  details: string;
  status: string;
  chairType?: string;
}

interface TbsDoc {
  id: number;
  title: string;
  tbsDate: string;
  status: string;
  uploadedBy: string;
  numberOfSignatures: number;
}

interface CoursesContextType {
  addAgendaItem: (newItem: AgendaItem) => void;
  removeAgendaItem: (id: number) => void;
  agendaItems: AgendaItem[];
  issues: Issue[];
  services: Service[];
  updateServicePref: (id: string, status: boolean) => void;
  selectedIssue: Issue | null;
  setSelectedIssue: (is: Issue | null) => void;
  removeIssue: (id: number) => void;
  addIssue: (issue: Issue) => void;
  emergencies: Emergency[];
  selectedDoc: TbsDoc | null;
  selectedEmergency: Emergency | null;
  setSelectedEmergency: (em: Emergency | null) => void;
  setSelectedDoc: (doc: TbsDoc | null) => void;
  selectedStudent: Student | null;
  setSelectedStudent: (stu: Student | null) => void;
  selectedBooking: Booking | null;
  removeBooking: (id: number) => void;
  setSelectedBooking: (booking: Booking | null) => void;
  tbsDocs: TbsDoc[];
  updateTbsDocStatus: (id: number, status: string) => void;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  fakeCourses: Course[];
  addStudentsToCourse: (courseId: number, newStudents: Student[]) => void;
  managedCourses: Course[];
  fakeExams: Exam[];
  selectedCourse: Course | null;
  selectedNotice: Notice | null;
  selectedLecture: Lesson | null;
  selectedStaff: Staff | null;
  selectedFile: File | null;
  selectedExam: Exam | null;
  fakeProfiles: Profile[];
  setFakeProfiles: (profile: Profile[]) => void;
  selectedProfile: Profile | null;
  setSelectedProfile: (profile: Profile | null) => void;
  user: User;
  setUser: (user: User) => void;
  addCourse: (course: Course) => void;
  removeCourse: (courseId: number) => void;
  addManagedCourse: (course: Course) => void;
  setVisibilityOfNotice: (
    courseId: number,
    noticeId: number,
    visibility: boolean,
  ) => void;
  addMaterialToCourse: (
    courseId: number,
    directoryId: number,
    file: File,
  ) => void;
  addStaffToCourse: (courseId: number, newStaff: Staff[]) => void;
  addExam: (exam: Exam) => void;
  selectedAgendaItem: AgendaItem | null;
  setSelectedAgendaItem: (item: AgendaItem | null) => void;
  selectCourseByName: (name: string) => void;
  removeExam: (examId: number) => void;
  setSelectedCourse: (course: Course | null) => void;
  setSelectedNotice: (notice: Notice | null) => void;
  setSelectedFile: (file: File | null) => void;
  setSelectedLecture: (lesson: Lesson | null) => void;
  setSelectedStaff: (lesson: Staff | null) => void;
  setSelectedExam: (exam: Exam | null) => void;
  addNoticeToCourse: (courseId: number, notice: Notice) => void; // Funzione per aggiungere una notifica
  removeNoticeFromCourse: (courseId: number, noticeId: number) => void; // Funzione per rimuovere una notifica
  addLesson: (courseId: number, lesson: Lesson) => void;
  deleteNoticeFromCourse: (courseId: number, noticeId: number) => void;
  removeFileFromCourse: (courseId: number, fileId: number) => void;
  removeAssignmentFromCourse: (courseId: number, assignmentId: number) => void;
  deleteLessonFromCourse: (courseId: number, lessonId: number) => void;
  updateCourseNotice: (
    courseId: number,
    noticeId: number,
    updatedNotice: {
      title: string;
      content: string;
      startDate: string;
      endDate: string;
    },
  ) => void;
  updateCourseFile: (
    courseId: number,
    fileId: number,
    updatedFile: File,
    dirId: number,
  ) => void;
  updateCourseLecture: (
    courseId: number,
    lectureId: number,
    updatedLecture: Lesson,
  ) => void;
  removeStaffFromCourse: (courseId: number, staffId: number) => void;
  updateStaffAccess: (
    courseId: number,
    staffId: number,
    newAccess: string,
  ) => void;
  addDirectoryToCourse: (courseId: number, directory: Directory) => void;
  removeDirectoryFromCourse: (courseId: number, directoryId: number) => void;
  addGroupToCourse: (courseId: number, newGroup: Group) => void;
  removeGroupFromCourse: (courseId: number, groupId: number) => void;
  updateGroupInCourse: (
    courseId: number,
    groupId: number,
    updatedGroup: Group,
  ) => void;
  toggleFavoriteProfile: () => void;
  getProfileById: (id: number) => Profile | undefined;
  getExamFromId: (idExam: number, exams: Exam[]) => Exam | undefined;
  addStudentsToExam: (examId: number, newStudents: Student[]) => void;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

interface CoursesProviderProps {
  children: ReactNode;
}

export const CoursesProvider = ({ children }: CoursesProviderProps) => {
  const { t } = useTranslation();
  // Stato per i corsi, esami e appelli d'esame
  const [fakeCourses, setFakeCourses] = useState<Course[]>([
    {
      id: 1,
      code: 'MAT101',
      title: 'Matematica',
      managed: true,
      subtitle: 'Iscritti: 120 - Periodo 1',
      period: 1,
      registered: 120,
      teacherId: 'Prof. Rossi',
      year: '2023/2024',
      cfu: 6,
      notices: [
        {
          id: 1,
          title: 'Cambio aula per lezione di domani',
          content:
            'Gentili studenti e studentesse,si comunica che, a partire dalla data di lunedì 22 aprile 2025, le lezioni del corso di [Nome del Corso] tenute dal Prof. [Cognome Docente] non si svolgeranno più nell’aula originariamente prevista (Aula [vecchia]) bensì in Aula [nuova], situata presso il [nome edificio / piano].',
          startDate: '2024-10-04',
          visible: true,
        },
        {
          id: 2,
          title: 'Avviso',
          content: 'Lezione di Matematica sospesa per il ponte del 1 Maggio.',
          startDate: '2024-25-04',
          visible: true,
        },
      ],
      assignments: [
        {
          id: 1,
          name: 'Laboratorio 1',
          date: '2024-10-04',
          size: 100,
          student: 'S317657',
          mimeType: 'pdf',
        },
        {
          id: 2,
          name: 'Laboratorio 1',
          date: '2024-25-04',
          size: 100,
          student: 'S317658',
          mimeType: 'pdf',
        },
      ],
      staff: [
        { id: 1, name: 'Tu', role: 'Titolare', access: 'Può eliminare' },
        {
          id: 2,
          name: 'Mario Rossi',
          role: 'Collaboratore',
          access: 'Può leggere',
          idProfile: 9,
        },
      ],
      examcalls: [
        { id: 1, name: 'Matematica', date: 'Oggi', professor: 'Tu', idExam: 1 },
        {
          id: 2,
          name: 'Matematica',
          date: '2024-10-05',
          professor: 'Tu',
          idExam: 2,
        },
      ],
      guide: 'this is the course guide',
      directories: [
        {
          id: 1,
          name: 'Appunti Lezioni',
          files: [
            {
              id: 1,
              name: 'Lezione1.pdf',
              date: '2024-10-04',
              size: 100,
              mimeType: 'pdf',
              dirId: 1,
            },
            {
              id: 2,
              name: 'Lezione2.pdf',
              date: '2024-10-04',
              size: 100,
              mimeType: 'pdf',
              dirId: 1,
            },
          ],
        },
        {
          id: 2,
          name: 'Esercizi',
          files: [
            {
              id: 3,
              name: 'Esercizio1.pdf',
              date: '2024-10-04',
              size: 100,
              mimeType: 'pdf',
              dirId: 2,
            },
            {
              id: 4,
              name: 'Esercizio2.pdf',
              date: '2024-10-04',
              size: 100,
              mimeType: 'pdf',
              dirId: 2,
            },
          ],
        },
      ],
      lessons: [
        {
          id: 1,
          title: 'Lezione 1',
          date: '2024-10-04',
          time: '17:30-19:00',
          content:
            'Spiegazione iniziale della struttura del corso. Slide da 1 a 89 del primo plico.',
          staff: [
            { id: 1, name: 'Tu', role: 'Titolare', access: 'Completo' },
            {
              id: 2,
              name: 'Mario Rossi',
              role: 'Collaboratore',
              access: 'Può leggere',
              idProfile: 9,
            },
          ],
          room: 'Aula 3',
          language: 'Italiano',
        },
      ],
      students: [
        {
          id: 'S317601',
          name: 'Luca',
          surname: 'Bianchi',
          year: '2024',
          exam: 'yes',
          cityOfBirth: 'Milano',
          degreeCourse: 'Informatica',
          passedExams: ['Matematica I', 'Programmazione', 'Fisica I'],
          passedExamsDate: ['2024-01-10', '2024-02-12', '2024-03-05'],
        },
        {
          id: 'S317602',
          name: 'Giulia',
          surname: 'Rossi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Roma',
          degreeCourse: 'Fisica',
          passedExams: ['Fisica I', 'Analisi I', 'Laboratorio'],
          passedExamsDate: ['2024-01-18', '2024-02-20', '2024-03-15'],
        },
        {
          id: 'S317603',
          name: 'Marco',
          surname: 'Verdi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Torino',
          degreeCourse: 'Matematica',
          passedExams: ['Analisi I', 'Algebra', 'Geometria'],
          passedExamsDate: ['2024-01-22', '2024-02-28', '2024-03-10'],
        },
        {
          id: 'S317604',
          name: 'Chiara',
          surname: 'Neri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Napoli',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi', 'Meccanica'],
          passedExamsDate: ['2024-01-30', '2024-02-18', '2024-03-12'],
        },
        {
          id: 'S317605',
          name: 'Davide',
          surname: 'Ferrari',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Firenze',
          degreeCourse: 'Chimica',
          passedExams: ['Chimica Generale', 'Fisica', 'Matematica'],
          passedExamsDate: ['2024-01-16', '2024-02-14', '2024-03-08'],
        },
        {
          id: 'S317606',
          name: 'Francesca',
          surname: 'Gallo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Bologna',
          degreeCourse: 'Biologia',
          passedExams: ['Biologia Cellulare', 'Chimica', 'Genetica'],
          passedExamsDate: ['2024-01-25', '2024-02-22', '2024-03-11'],
        },
        {
          id: 'S317607',
          name: 'Alessandro',
          surname: 'Russo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Genova',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Statistica', 'Matematica'],
          passedExamsDate: ['2024-01-28', '2024-02-19', '2024-03-14'],
        },
        {
          id: 'S317608',
          name: 'Martina',
          surname: 'Greco',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Venezia',
          degreeCourse: 'Giurisprudenza',
          passedExams: [
            'Diritto Privato',
            'Diritto Pubblico',
            'Economia Politica',
          ],
          passedExamsDate: ['2024-01-12', '2024-02-17', '2024-03-09'],
        },
        {
          id: 'S317609',
          name: 'Stefano',
          surname: 'Esposito',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Palermo',
          degreeCourse: 'Psicologia',
          passedExams: ['Psicologia Generale', 'Statistica', 'Psicobiologia'],
          passedExamsDate: ['2024-01-11', '2024-02-11', '2024-03-11'],
        },
        {
          id: 'S317610',
          name: 'Federica',
          surname: 'Romano',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Verona',
          degreeCourse: 'Sociologia',
          passedExams: [
            'Sociologia Generale',
            'Metodologia',
            'Statistica Sociale',
          ],
          passedExamsDate: ['2024-01-15', '2024-02-20', '2024-03-13'],
        },
        {
          id: 'S317611',
          name: 'Matteo',
          surname: 'Colombo',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Trieste',
          degreeCourse: 'Filosofia',
          passedExams: ['Filosofia Antica', 'Logica', 'Estetica'],
          passedExamsDate: ['2024-01-23', '2024-02-13', '2024-03-06'],
        },
        {
          id: 'S317612',
          name: 'Elisa',
          surname: 'Conti',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Perugia',
          degreeCourse: 'Architettura',
          passedExams: ['Storia dell’Arte', 'Disegno Tecnico', 'Fisica'],
          passedExamsDate: ['2024-01-29', '2024-02-26', '2024-03-07'],
        },
        {
          id: 'S317613',
          name: 'Simone',
          surname: 'De Luca',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Lecce',
          degreeCourse: 'Informatica',
          passedExams: [
            'Programmazione',
            'Matematica Discreta',
            'Sistemi Operativi',
          ],
          passedExamsDate: ['2024-01-19', '2024-02-21', '2024-03-18'],
        },
        {
          id: 'S317614',
          name: 'Valentina',
          surname: 'Barbieri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Cagliari',
          degreeCourse: 'Design',
          passedExams: [
            'Disegno Industriale',
            'Teoria del Colore',
            'Storia del Design',
          ],
          passedExamsDate: ['2024-01-14', '2024-02-23', '2024-03-20'],
        },
        {
          id: 'S317615',
          name: 'Andrea',
          surname: 'Mancini',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Modena',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Macroeconomia', 'Statistica'],
          passedExamsDate: ['2024-01-09', '2024-02-05', '2024-03-04'],
        },
        {
          id: 'S317616',
          name: 'Sara',
          surname: 'Moretti',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Parma',
          degreeCourse: 'Biotecnologie',
          passedExams: ['Biologia Molecolare', 'Chimica', 'Bioinformatica'],
          passedExamsDate: ['2024-01-26', '2024-02-16', '2024-03-17'],
        },
        {
          id: 'S317617',
          name: 'Gabriele',
          surname: 'Fontana',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Reggio Emilia',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi I', 'Informatica'],
          passedExamsDate: ['2024-01-13', '2024-02-08', '2024-03-16'],
        },
        {
          id: 'S317618',
          name: 'Ilaria',
          surname: 'Mariani',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Aosta',
          degreeCourse: 'Lingue',
          passedExams: ['Lingua Inglese', 'Linguistica', 'Letteratura'],
          passedExamsDate: ['2024-01-27', '2024-02-10', '2024-03-19'],
        },
        {
          id: 'S317619',
          name: 'Nicola',
          surname: 'Rinaldi',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Trento',
          degreeCourse: 'Statistica',
          passedExams: ['Statistica I', 'Probabilità', 'Economia'],
          passedExamsDate: ['2024-01-17', '2024-02-25', '2024-03-03'],
        },
        {
          id: 'S317620',
          name: 'Laura',
          surname: 'Fabbri',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Rimini',
          degreeCourse: 'Medicina',
          passedExams: ['Anatomia', 'Fisiologia', 'Biologia'],
          passedExamsDate: ['2024-01-21', '2024-02-15', '2024-03-01'],
        },
      ],
      groups: [
        {
          id: 1,
          title: 'Gruppo 1',
          students: [
            {
              id: 'S317601',
              name: 'Luca',
              surname: 'Bianchi',
              year: '2024',
              exam: 'yes',
              cityOfBirth: 'Milano',
              degreeCourse: 'Informatica',
              passedExams: ['Matematica I', 'Programmazione', 'Fisica I'],
              passedExamsDate: ['2024-01-10', '2024-02-12', '2024-03-05'],
            },
            {
              id: 'S317602',
              name: 'Giulia',
              surname: 'Rossi',
              year: '2024',
              exam: 'no',
              cityOfBirth: 'Roma',
              degreeCourse: 'Fisica',
              passedExams: ['Fisica I', 'Analisi I', 'Laboratorio'],
              passedExamsDate: ['2024-01-18', '2024-02-20', '2024-03-15'],
            },
            {
              id: 'S317603',
              name: 'Marco',
              surname: 'Verdi',
              year: '2024',
              exam: 'no',
              cityOfBirth: 'Torino',
              degreeCourse: 'Matematica',
              passedExams: ['Analisi I', 'Algebra', 'Geometria'],
              passedExamsDate: ['2024-01-22', '2024-02-28', '2024-03-10'],
            },
            {
              id: 'S317604',
              name: 'Chiara',
              surname: 'Neri',
              year: '2024',
              exam: 'no',
              cityOfBirth: 'Napoli',
              degreeCourse: 'Ingegneria',
              passedExams: ['Fisica I', 'Analisi', 'Meccanica'],
              passedExamsDate: ['2024-01-30', '2024-02-18', '2024-03-12'],
            },
          ],
        },
        {
          id: 2,
          title: 'Gruppo 2',
          students: [
            {
              id: 'S317605',
              name: 'Davide',
              surname: 'Ferrari',
              year: '2024',
              exam: 'no',
              cityOfBirth: 'Firenze',
              degreeCourse: 'Chimica',
              passedExams: ['Chimica Generale', 'Fisica', 'Matematica'],
              passedExamsDate: ['2024-01-16', '2024-02-14', '2024-03-08'],
            },
            {
              id: 'S317606',
              name: 'Francesca',
              surname: 'Gallo',
              year: '2024',
              exam: 'no',
              cityOfBirth: 'Bologna',
              degreeCourse: 'Biologia',
              passedExams: ['Biologia Cellulare', 'Chimica', 'Genetica'],
              passedExamsDate: ['2024-01-25', '2024-02-22', '2024-03-11'],
            },
            {
              id: 'S317607',
              name: 'Alessandro',
              surname: 'Russo',
              year: '2024',
              exam: 'no',
              cityOfBirth: 'Genova',
              degreeCourse: 'Economia',
              passedExams: ['Microeconomia', 'Statistica', 'Matematica'],
              passedExamsDate: ['2024-01-28', '2024-02-19', '2024-03-14'],
            },
          ],
        },
        {
          id: 3,
          title: 'Gruppo 3',
          students: [
            {
              id: 'S317608',
              name: 'Martina',
              surname: 'Greco',
              year: '2024',
              exam: 'no',
              cityOfBirth: 'Venezia',
              degreeCourse: 'Giurisprudenza',
              passedExams: [
                'Diritto Privato',
                'Diritto Pubblico',
                'Economia Politica',
              ],
              passedExamsDate: ['2024-01-12', '2024-02-17', '2024-03-09'],
            },
            {
              id: 'S317609',
              name: 'Stefano',
              surname: 'Esposito',
              year: '2025',
              exam: 'no',
              cityOfBirth: 'Palermo',
              degreeCourse: 'Psicologia',
              passedExams: [
                'Psicologia Generale',
                'Statistica',
                'Psicobiologia',
              ],
              passedExamsDate: ['2024-01-11', '2024-02-11', '2024-03-11'],
            },
            {
              id: 'S317610',
              name: 'Federica',
              surname: 'Romano',
              year: '2024',
              exam: 'no',
              cityOfBirth: 'Verona',
              degreeCourse: 'Sociologia',
              passedExams: [
                'Sociologia Generale',
                'Metodologia',
                'Statistica Sociale',
              ],
              passedExamsDate: ['2024-01-15', '2024-02-20', '2024-03-13'],
            },
          ],
        },
        {
          id: 4,
          title: 'Gruppo 4',
          students: [
            {
              id: 'S317611',
              name: 'Matteo',
              surname: 'Colombo',
              year: '2025',
              exam: 'no',
              cityOfBirth: 'Trieste',
              degreeCourse: 'Filosofia',
              passedExams: ['Filosofia Antica', 'Logica', 'Estetica'],
              passedExamsDate: ['2024-01-23', '2024-02-13', '2024-03-06'],
            },
            {
              id: 'S317612',
              name: 'Elisa',
              surname: 'Conti',
              year: '2025',
              exam: 'no',
              cityOfBirth: 'Perugia',
              degreeCourse: 'Architettura',
              passedExams: ['Storia dell’Arte', 'Disegno Tecnico', 'Fisica'],
              passedExamsDate: ['2024-01-29', '2024-02-26', '2024-03-07'],
            },
            {
              id: 'S317613',
              name: 'Simone',
              surname: 'De Luca',
              year: '2025',
              exam: 'no',
              cityOfBirth: 'Lecce',
              degreeCourse: 'Informatica',
              passedExams: [
                'Programmazione',
                'Matematica Discreta',
                'Sistemi Operativi',
              ],
              passedExamsDate: ['2024-01-19', '2024-02-21', '2024-03-18'],
            },
          ],
        },
        {
          id: 5,
          title: 'Gruppo 5',
          students: [
            {
              id: 'S317614',
              name: 'Valentina',
              surname: 'Barbieri',
              year: '2024',
              exam: 'no',
              cityOfBirth: 'Cagliari',
              degreeCourse: 'Design',
              passedExams: [
                'Disegno Industriale',
                'Teoria del Colore',
                'Storia del Design',
              ],
              passedExamsDate: ['2024-01-14', '2024-02-23', '2024-03-20'],
            },
            {
              id: 'S317615',
              name: 'Andrea',
              surname: 'Mancini',
              year: '2024',
              exam: 'si',
              cityOfBirth: 'Modena',
              degreeCourse: 'Economia',
              passedExams: ['Microeconomia', 'Macroeconomia', 'Statistica'],
              passedExamsDate: ['2024-01-09', '2024-02-05', '2024-03-04'],
            },
            {
              id: 'S317616',
              name: 'Sara',
              surname: 'Moretti',
              year: '2024',
              exam: 'si',
              cityOfBirth: 'Parma',
              degreeCourse: 'Biotecnologie',
              passedExams: ['Biologia Molecolare', 'Chimica', 'Bioinformatica'],
              passedExamsDate: ['2024-01-26', '2024-02-16', '2024-03-17'],
            },
          ],
        },
        {
          id: 6,
          title: 'Gruppo 6',
          students: [
            {
              id: 'S317617',
              name: 'Gabriele',
              surname: 'Fontana',
              year: '2025',
              exam: 'si',
              cityOfBirth: 'Reggio Emilia',
              degreeCourse: 'Ingegneria',
              passedExams: ['Fisica I', 'Analisi I', 'Informatica'],
              passedExamsDate: ['2024-01-13', '2024-02-08', '2024-03-16'],
            },
            {
              id: 'S317618',
              name: 'Ilaria',
              surname: 'Mariani',
              year: '2024',
              exam: 'si',
              cityOfBirth: 'Aosta',
              degreeCourse: 'Lingue',
              passedExams: ['Lingua Inglese', 'Linguistica', 'Letteratura'],
              passedExamsDate: ['2024-01-27', '2024-02-10', '2024-03-19'],
            },
            {
              id: 'S317619',
              name: 'Nicola',
              surname: 'Rinaldi',
              year: '2025',
              exam: 'si',
              cityOfBirth: 'Trento',
              degreeCourse: 'Statistica',
              passedExams: ['Statistica I', 'Probabilità', 'Economia'],
              passedExamsDate: ['2024-01-17', '2024-02-25', '2024-03-03'],
            },
          ],
        },
        {
          id: 7,
          title: 'Gruppo 7',
          students: [
            {
              id: 'S317620',
              name: 'Laura',
              surname: 'Fabbri',
              year: '2024',
              exam: 'si',
              cityOfBirth: 'Rimini',
              degreeCourse: 'Medicina',
              passedExams: ['Anatomia', 'Fisiologia', 'Biologia'],
              passedExamsDate: ['2024-01-21', '2024-02-15', '2024-03-01'],
            },
            // Attenzione: nello snippet originale Nicola è presente in due gruppi,
            // qui lo inserisco solo nel gruppo 6 per coerenza (ma puoi decidere tu)
          ],
        },
      ],
    },
    {
      id: 2,
      code: 'FIS101',
      title: 'Fisica',
      managed: true,

      subtitle: 'Iscritti: 95 - Periodo 1',
      period: 1,
      registered: 95,
      teacherId: 'Prof. Bianchi',
      year: '2023/2024',
      cfu: 8,
      notices: [],
      assignments: [],
      staff: [
        { id: 1, name: 'Tu', role: 'Titolare', access: 'Può eliminare' },
        {
          id: 2,
          name: 'Mario Rossi',
          role: 'Collaboratore',
          access: 'Può leggere',
          idProfile: 9,
        },
      ],
      examcalls: [
        {
          id: 1,
          name: 'Fisica',
          date: '2024-10-04',
          professor: 'Tu',
          idExam: 3,
        },
        {
          id: 2,
          name: 'Fisica',
          date: '2024-10-05',
          professor: 'Tu',
          idExam: 4,
        },
      ],
      guide: 'this is the course guide',
      directories: [
        {
          id: 1,
          name: 'Appunti Lezioni',
          files: [
            {
              id: 1,
              name: 'Lezione1.pdf',
              date: '2024-10-04',
              size: 100,
              mimeType: 'pdf',
              dirId: 1,
            },
            {
              id: 2,
              name: 'Lezione2.pdf',
              date: '2024-10-04',
              size: 100,
              mimeType: 'pdf',
              dirId: 1,
            },
          ],
        },
        {
          id: 2,
          name: 'Esercizi',
          files: [
            {
              id: 3,
              name: 'Esercizio1.pdf',
              date: '2024-10-04',
              size: 100,
              mimeType: 'pdf',
              dirId: 2,
            },
            {
              id: 4,
              name: 'Esercizio2.pdf',
              date: '2024-10-04',
              size: 100,
              mimeType: 'pdf',
              dirId: 2,
            },
          ],
        },
      ],
      lessons: [
        {
          id: 1,
          title: 'Lezione 1',
          date: '2024-10-04',
          time: '17:00-18:30',
          content: 'ciao a tutti voi',
        },
      ],
      students: [
        {
          id: 'S317601',
          name: 'Luca',
          surname: 'Bianchi',
          year: '2024',
          exam: 'yes',
          cityOfBirth: 'Milano',
          degreeCourse: 'Informatica',
          passedExams: ['Matematica I', 'Programmazione', 'Fisica I'],
          passedExamsDate: ['2024-01-10', '2024-02-12', '2024-03-05'],
        },
        {
          id: 'S317602',
          name: 'Giulia',
          surname: 'Rossi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Roma',
          degreeCourse: 'Fisica',
          passedExams: ['Fisica I', 'Analisi I', 'Laboratorio'],
          passedExamsDate: ['2024-01-18', '2024-02-20', '2024-03-15'],
        },
        {
          id: 'S317603',
          name: 'Marco',
          surname: 'Verdi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Torino',
          degreeCourse: 'Matematica',
          passedExams: ['Analisi I', 'Algebra', 'Geometria'],
          passedExamsDate: ['2024-01-22', '2024-02-28', '2024-03-10'],
        },
        {
          id: 'S317604',
          name: 'Chiara',
          surname: 'Neri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Napoli',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi', 'Meccanica'],
          passedExamsDate: ['2024-01-30', '2024-02-18', '2024-03-12'],
        },
        {
          id: 'S317605',
          name: 'Davide',
          surname: 'Ferrari',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Firenze',
          degreeCourse: 'Chimica',
          passedExams: ['Chimica Generale', 'Fisica', 'Matematica'],
          passedExamsDate: ['2024-01-16', '2024-02-14', '2024-03-08'],
        },
        {
          id: 'S317606',
          name: 'Francesca',
          surname: 'Gallo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Bologna',
          degreeCourse: 'Biologia',
          passedExams: ['Biologia Cellulare', 'Chimica', 'Genetica'],
          passedExamsDate: ['2024-01-25', '2024-02-22', '2024-03-11'],
        },
        {
          id: 'S317607',
          name: 'Alessandro',
          surname: 'Russo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Genova',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Statistica', 'Matematica'],
          passedExamsDate: ['2024-01-28', '2024-02-19', '2024-03-14'],
        },
        {
          id: 'S317608',
          name: 'Martina',
          surname: 'Greco',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Venezia',
          degreeCourse: 'Giurisprudenza',
          passedExams: [
            'Diritto Privato',
            'Diritto Pubblico',
            'Economia Politica',
          ],
          passedExamsDate: ['2024-01-12', '2024-02-17', '2024-03-09'],
        },
        {
          id: 'S317609',
          name: 'Stefano',
          surname: 'Esposito',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Palermo',
          degreeCourse: 'Psicologia',
          passedExams: ['Psicologia Generale', 'Statistica', 'Psicobiologia'],
          passedExamsDate: ['2024-01-11', '2024-02-11', '2024-03-11'],
        },
        {
          id: 'S317610',
          name: 'Federica',
          surname: 'Romano',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Verona',
          degreeCourse: 'Sociologia',
          passedExams: [
            'Sociologia Generale',
            'Metodologia',
            'Statistica Sociale',
          ],
          passedExamsDate: ['2024-01-15', '2024-02-20', '2024-03-13'],
        },
        {
          id: 'S317611',
          name: 'Matteo',
          surname: 'Colombo',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Trieste',
          degreeCourse: 'Filosofia',
          passedExams: ['Filosofia Antica', 'Logica', 'Estetica'],
          passedExamsDate: ['2024-01-23', '2024-02-13', '2024-03-06'],
        },
        {
          id: 'S317612',
          name: 'Elisa',
          surname: 'Conti',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Perugia',
          degreeCourse: 'Architettura',
          passedExams: ['Storia dell’Arte', 'Disegno Tecnico', 'Fisica'],
          passedExamsDate: ['2024-01-29', '2024-02-26', '2024-03-07'],
        },
        {
          id: 'S317613',
          name: 'Simone',
          surname: 'De Luca',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Lecce',
          degreeCourse: 'Informatica',
          passedExams: [
            'Programmazione',
            'Matematica Discreta',
            'Sistemi Operativi',
          ],
          passedExamsDate: ['2024-01-19', '2024-02-21', '2024-03-18'],
        },
        {
          id: 'S317614',
          name: 'Valentina',
          surname: 'Barbieri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Cagliari',
          degreeCourse: 'Design',
          passedExams: [
            'Disegno Industriale',
            'Teoria del Colore',
            'Storia del Design',
          ],
          passedExamsDate: ['2024-01-14', '2024-02-23', '2024-03-20'],
        },
        {
          id: 'S317615',
          name: 'Andrea',
          surname: 'Mancini',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Modena',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Macroeconomia', 'Statistica'],
          passedExamsDate: ['2024-01-09', '2024-02-05', '2024-03-04'],
        },
        {
          id: 'S317616',
          name: 'Sara',
          surname: 'Moretti',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Parma',
          degreeCourse: 'Biotecnologie',
          passedExams: ['Biologia Molecolare', 'Chimica', 'Bioinformatica'],
          passedExamsDate: ['2024-01-26', '2024-02-16', '2024-03-17'],
        },
        {
          id: 'S317617',
          name: 'Gabriele',
          surname: 'Fontana',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Reggio Emilia',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi I', 'Informatica'],
          passedExamsDate: ['2024-01-13', '2024-02-08', '2024-03-16'],
        },
        {
          id: 'S317618',
          name: 'Ilaria',
          surname: 'Mariani',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Aosta',
          degreeCourse: 'Lingue',
          passedExams: ['Lingua Inglese', 'Linguistica', 'Letteratura'],
          passedExamsDate: ['2024-01-27', '2024-02-10', '2024-03-19'],
        },
        {
          id: 'S317619',
          name: 'Nicola',
          surname: 'Rinaldi',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Trento',
          degreeCourse: 'Statistica',
          passedExams: ['Statistica I', 'Probabilità', 'Economia'],
          passedExamsDate: ['2024-01-17', '2024-02-25', '2024-03-03'],
        },
        {
          id: 'S317620',
          name: 'Laura',
          surname: 'Fabbri',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Rimini',
          degreeCourse: 'Medicina',
          passedExams: ['Anatomia', 'Fisiologia', 'Biologia'],
          passedExamsDate: ['2024-01-21', '2024-02-15', '2024-03-01'],
        },
      ],
      groups: [],
    },
    {
      id: 3,
      code: 'PRG201',
      title: 'Programmazione',
      managed: true,

      subtitle: 'Iscritti: 210 - Periodo 2',
      period: 2,
      registered: 210,
      teacherId: 'Prof. Verdi',
      year: '2023/2024',
      cfu: 9,
      notices: [
        {
          id: 1,
          title: 'Avviso',
          content: 'Nuove esercitazioni caricate sulla piattaforma.',
          startDate: '2024-30-03',
          visible: true,
        },
      ],
      assignments: [],
      staff: [
        { id: 1, name: 'Tu', role: 'Titolare', access: 'Può eliminare' },
        {
          id: 2,
          name: 'Mario Rossi',
          role: 'Collaboratore',
          access: 'Può leggere',
          idProfile: 9,
        },
      ],
      examcalls: [
        {
          id: 1,
          name: 'Programmazione',
          date: '2024-04-10',
          professor: 'Tu',
          idExam: 5,
        },
        {
          id: 2,
          name: 'Programmazione',
          date: '2024-05-10',
          professor: 'Tu',
          idExam: 6,
        },
      ],
      guide: 'this is the course guide',
      directories: [
        {
          id: 1,
          name: 'Appunti Lezioni',
          files: [
            {
              id: 1,
              name: 'Lezione1.pdf',
              date: '2024-04-10',
              size: 100,
              mimeType: 'pdf',
              dirId: 1,
            },
            {
              id: 2,
              name: 'Lezione2.pdf',
              date: '2024-04-10',
              size: 100,
              mimeType: 'pdf',
              dirId: 1,
            },
          ],
        },
        {
          id: 2,
          name: 'Esercizi',
          files: [
            {
              id: 3,
              name: 'Esercizio1.pdf',
              date: '2024-04-10',
              size: 100,
              mimeType: 'pdf',
              dirId: 2,
            },
            {
              id: 4,
              name: 'Esercizio2.pdf',
              date: '2024-04-10',
              size: 100,
              mimeType: 'pdf',
              dirId: 2,
            },
          ],
        },
      ],
      lessons: [
        {
          id: 1,
          title: 'Lezione 1',
          date: '2024-04-10',
          time: '17:30-19:00',
          content: 'ciao a tutti voi',
        },
      ],
      students: [
        {
          id: 'S317601',
          name: 'Luca',
          surname: 'Bianchi',
          year: '2024',
          exam: 'yes',
          cityOfBirth: 'Milano',
          degreeCourse: 'Informatica',
          passedExams: ['Matematica I', 'Programmazione', 'Fisica I'],
          passedExamsDate: ['2024-01-10', '2024-02-12', '2024-03-05'],
        },
        {
          id: 'S317602',
          name: 'Giulia',
          surname: 'Rossi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Roma',
          degreeCourse: 'Fisica',
          passedExams: ['Fisica I', 'Analisi I', 'Laboratorio'],
          passedExamsDate: ['2024-01-18', '2024-02-20', '2024-03-15'],
        },
        {
          id: 'S317603',
          name: 'Marco',
          surname: 'Verdi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Torino',
          degreeCourse: 'Matematica',
          passedExams: ['Analisi I', 'Algebra', 'Geometria'],
          passedExamsDate: ['2024-01-22', '2024-02-28', '2024-03-10'],
        },
        {
          id: 'S317604',
          name: 'Chiara',
          surname: 'Neri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Napoli',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi', 'Meccanica'],
          passedExamsDate: ['2024-01-30', '2024-02-18', '2024-03-12'],
        },
        {
          id: 'S317605',
          name: 'Davide',
          surname: 'Ferrari',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Firenze',
          degreeCourse: 'Chimica',
          passedExams: ['Chimica Generale', 'Fisica', 'Matematica'],
          passedExamsDate: ['2024-01-16', '2024-02-14', '2024-03-08'],
        },
        {
          id: 'S317606',
          name: 'Francesca',
          surname: 'Gallo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Bologna',
          degreeCourse: 'Biologia',
          passedExams: ['Biologia Cellulare', 'Chimica', 'Genetica'],
          passedExamsDate: ['2024-01-25', '2024-02-22', '2024-03-11'],
        },
        {
          id: 'S317607',
          name: 'Alessandro',
          surname: 'Russo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Genova',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Statistica', 'Matematica'],
          passedExamsDate: ['2024-01-28', '2024-02-19', '2024-03-14'],
        },
        {
          id: 'S317608',
          name: 'Martina',
          surname: 'Greco',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Venezia',
          degreeCourse: 'Giurisprudenza',
          passedExams: [
            'Diritto Privato',
            'Diritto Pubblico',
            'Economia Politica',
          ],
          passedExamsDate: ['2024-01-12', '2024-02-17', '2024-03-09'],
        },
        {
          id: 'S317609',
          name: 'Stefano',
          surname: 'Esposito',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Palermo',
          degreeCourse: 'Psicologia',
          passedExams: ['Psicologia Generale', 'Statistica', 'Psicobiologia'],
          passedExamsDate: ['2024-01-11', '2024-02-11', '2024-03-11'],
        },
        {
          id: 'S317610',
          name: 'Federica',
          surname: 'Romano',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Verona',
          degreeCourse: 'Sociologia',
          passedExams: [
            'Sociologia Generale',
            'Metodologia',
            'Statistica Sociale',
          ],
          passedExamsDate: ['2024-01-15', '2024-02-20', '2024-03-13'],
        },
        {
          id: 'S317611',
          name: 'Matteo',
          surname: 'Colombo',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Trieste',
          degreeCourse: 'Filosofia',
          passedExams: ['Filosofia Antica', 'Logica', 'Estetica'],
          passedExamsDate: ['2024-01-23', '2024-02-13', '2024-03-06'],
        },
        {
          id: 'S317612',
          name: 'Elisa',
          surname: 'Conti',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Perugia',
          degreeCourse: 'Architettura',
          passedExams: ['Storia dell’Arte', 'Disegno Tecnico', 'Fisica'],
          passedExamsDate: ['2024-01-29', '2024-02-26', '2024-03-07'],
        },
        {
          id: 'S317613',
          name: 'Simone',
          surname: 'De Luca',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Lecce',
          degreeCourse: 'Informatica',
          passedExams: [
            'Programmazione',
            'Matematica Discreta',
            'Sistemi Operativi',
          ],
          passedExamsDate: ['2024-01-19', '2024-02-21', '2024-03-18'],
        },
        {
          id: 'S317614',
          name: 'Valentina',
          surname: 'Barbieri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Cagliari',
          degreeCourse: 'Design',
          passedExams: [
            'Disegno Industriale',
            'Teoria del Colore',
            'Storia del Design',
          ],
          passedExamsDate: ['2024-01-14', '2024-02-23', '2024-03-20'],
        },
        {
          id: 'S317615',
          name: 'Andrea',
          surname: 'Mancini',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Modena',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Macroeconomia', 'Statistica'],
          passedExamsDate: ['2024-01-09', '2024-02-05', '2024-03-04'],
        },
        {
          id: 'S317616',
          name: 'Sara',
          surname: 'Moretti',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Parma',
          degreeCourse: 'Biotecnologie',
          passedExams: ['Biologia Molecolare', 'Chimica', 'Bioinformatica'],
          passedExamsDate: ['2024-01-26', '2024-02-16', '2024-03-17'],
        },
        {
          id: 'S317617',
          name: 'Gabriele',
          surname: 'Fontana',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Reggio Emilia',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi I', 'Informatica'],
          passedExamsDate: ['2024-01-13', '2024-02-08', '2024-03-16'],
        },
        {
          id: 'S317618',
          name: 'Ilaria',
          surname: 'Mariani',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Aosta',
          degreeCourse: 'Lingue',
          passedExams: ['Lingua Inglese', 'Linguistica', 'Letteratura'],
          passedExamsDate: ['2024-01-27', '2024-02-10', '2024-03-19'],
        },
        {
          id: 'S317619',
          name: 'Nicola',
          surname: 'Rinaldi',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Trento',
          degreeCourse: 'Statistica',
          passedExams: ['Statistica I', 'Probabilità', 'Economia'],
          passedExamsDate: ['2024-01-17', '2024-02-25', '2024-03-03'],
        },
        {
          id: 'S317620',
          name: 'Laura',
          surname: 'Fabbri',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Rimini',
          degreeCourse: 'Medicina',
          passedExams: ['Anatomia', 'Fisiologia', 'Biologia'],
          passedExamsDate: ['2024-01-21', '2024-02-15', '2024-03-01'],
        },
      ],
      groups: [],
    },
    {
      id: 4,
      code: 'CHM101',
      title: 'Chimica',
      managed: true,

      subtitle: 'Iscritti: 78 - Periodo 2',
      period: 2,
      registered: 78,
      teacherId: 'Prof. Neri',
      year: '2024/2025',
      cfu: 6,
      notices: [
        {
          id: 1,
          title: 'Avviso',
          content: 'Aggiornamenti sul laboratorio di Chimica disponibili.',
          startDate: '2024-04-01',
          visible: true,
        },
      ],
      assignments: [],
      staff: [
        { id: 1, name: 'Tu', role: 'Titolare', access: 'Può eliminare' },
        {
          id: 2,
          name: 'Mario Rossi',
          role: 'Collaboratore',
          access: 'Può leggere',
          idProfile: 9,
        },
      ],
      examcalls: [
        {
          id: 1,
          name: 'Chimica',
          date: '2024-10-04',
          professor: 'Tu',
          idExam: 7,
        },
        {
          id: 2,
          name: 'Chimica',
          date: '2024-10-05',
          professor: 'Tu',
          idExam: 8,
        },
      ],
      guide: 'this is the course guide',
      directories: [
        {
          id: 1,
          name: 'Appunti Lezioni',
          files: [
            {
              id: 1,
              name: 'Lezione1.pdf',
              date: '2024-10-04',
              size: 100,
              mimeType: 'pdf',
              dirId: 1,
            },
            {
              id: 2,
              name: 'Lezione2.pdf',
              date: '2024-10-04',
              size: 100,
              mimeType: 'pdf',
              dirId: 1,
            },
          ],
        },
        {
          id: 2,
          name: 'Esercizi',
          files: [
            {
              id: 3,
              name: 'Esercizio1.pdf',
              date: '2024-10-04',
              size: 100,
              mimeType: 'pdf',
              dirId: 2,
            },
            {
              id: 4,
              name: 'Esercizio2.pdf',
              date: '2024-10-04',
              size: 100,
              mimeType: 'pdf',
              dirId: 2,
            },
          ],
        },
      ],
      lessons: [
        {
          id: 1,
          title: 'Lezione 1',
          date: '2024-10-04',
          time: '17:30-19:00',
          content: 'ciao a tutti voi',
        },
      ],
      students: [
        {
          id: 'S317601',
          name: 'Luca',
          surname: 'Bianchi',
          year: '2024',
          exam: 'yes',
          cityOfBirth: 'Milano',
          degreeCourse: 'Informatica',
          passedExams: ['Matematica I', 'Programmazione', 'Fisica I'],
          passedExamsDate: ['2024-01-10', '2024-02-12', '2024-03-05'],
        },
        {
          id: 'S317602',
          name: 'Giulia',
          surname: 'Rossi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Roma',
          degreeCourse: 'Fisica',
          passedExams: ['Fisica I', 'Analisi I', 'Laboratorio'],
          passedExamsDate: ['2024-01-18', '2024-02-20', '2024-03-15'],
        },
        {
          id: 'S317603',
          name: 'Marco',
          surname: 'Verdi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Torino',
          degreeCourse: 'Matematica',
          passedExams: ['Analisi I', 'Algebra', 'Geometria'],
          passedExamsDate: ['2024-01-22', '2024-02-28', '2024-03-10'],
        },
        {
          id: 'S317604',
          name: 'Chiara',
          surname: 'Neri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Napoli',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi', 'Meccanica'],
          passedExamsDate: ['2024-01-30', '2024-02-18', '2024-03-12'],
        },
        {
          id: 'S317605',
          name: 'Davide',
          surname: 'Ferrari',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Firenze',
          degreeCourse: 'Chimica',
          passedExams: ['Chimica Generale', 'Fisica', 'Matematica'],
          passedExamsDate: ['2024-01-16', '2024-02-14', '2024-03-08'],
        },
        {
          id: 'S317606',
          name: 'Francesca',
          surname: 'Gallo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Bologna',
          degreeCourse: 'Biologia',
          passedExams: ['Biologia Cellulare', 'Chimica', 'Genetica'],
          passedExamsDate: ['2024-01-25', '2024-02-22', '2024-03-11'],
        },
        {
          id: 'S317607',
          name: 'Alessandro',
          surname: 'Russo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Genova',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Statistica', 'Matematica'],
          passedExamsDate: ['2024-01-28', '2024-02-19', '2024-03-14'],
        },
        {
          id: 'S317608',
          name: 'Martina',
          surname: 'Greco',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Venezia',
          degreeCourse: 'Giurisprudenza',
          passedExams: [
            'Diritto Privato',
            'Diritto Pubblico',
            'Economia Politica',
          ],
          passedExamsDate: ['2024-01-12', '2024-02-17', '2024-03-09'],
        },
        {
          id: 'S317609',
          name: 'Stefano',
          surname: 'Esposito',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Palermo',
          degreeCourse: 'Psicologia',
          passedExams: ['Psicologia Generale', 'Statistica', 'Psicobiologia'],
          passedExamsDate: ['2024-01-11', '2024-02-11', '2024-03-11'],
        },
        {
          id: 'S317610',
          name: 'Federica',
          surname: 'Romano',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Verona',
          degreeCourse: 'Sociologia',
          passedExams: [
            'Sociologia Generale',
            'Metodologia',
            'Statistica Sociale',
          ],
          passedExamsDate: ['2024-01-15', '2024-02-20', '2024-03-13'],
        },
        {
          id: 'S317611',
          name: 'Matteo',
          surname: 'Colombo',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Trieste',
          degreeCourse: 'Filosofia',
          passedExams: ['Filosofia Antica', 'Logica', 'Estetica'],
          passedExamsDate: ['2024-01-23', '2024-02-13', '2024-03-06'],
        },
        {
          id: 'S317612',
          name: 'Elisa',
          surname: 'Conti',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Perugia',
          degreeCourse: 'Architettura',
          passedExams: ['Storia dell’Arte', 'Disegno Tecnico', 'Fisica'],
          passedExamsDate: ['2024-01-29', '2024-02-26', '2024-03-07'],
        },
        {
          id: 'S317613',
          name: 'Simone',
          surname: 'De Luca',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Lecce',
          degreeCourse: 'Informatica',
          passedExams: [
            'Programmazione',
            'Matematica Discreta',
            'Sistemi Operativi',
          ],
          passedExamsDate: ['2024-01-19', '2024-02-21', '2024-03-18'],
        },
        {
          id: 'S317614',
          name: 'Valentina',
          surname: 'Barbieri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Cagliari',
          degreeCourse: 'Design',
          passedExams: [
            'Disegno Industriale',
            'Teoria del Colore',
            'Storia del Design',
          ],
          passedExamsDate: ['2024-01-14', '2024-02-23', '2024-03-20'],
        },
        {
          id: 'S317615',
          name: 'Andrea',
          surname: 'Mancini',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Modena',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Macroeconomia', 'Statistica'],
          passedExamsDate: ['2024-01-09', '2024-02-05', '2024-03-04'],
        },
        {
          id: 'S317616',
          name: 'Sara',
          surname: 'Moretti',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Parma',
          degreeCourse: 'Biotecnologie',
          passedExams: ['Biologia Molecolare', 'Chimica', 'Bioinformatica'],
          passedExamsDate: ['2024-01-26', '2024-02-16', '2024-03-17'],
        },
        {
          id: 'S317617',
          name: 'Gabriele',
          surname: 'Fontana',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Reggio Emilia',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi I', 'Informatica'],
          passedExamsDate: ['2024-01-13', '2024-02-08', '2024-03-16'],
        },
        {
          id: 'S317618',
          name: 'Ilaria',
          surname: 'Mariani',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Aosta',
          degreeCourse: 'Lingue',
          passedExams: ['Lingua Inglese', 'Linguistica', 'Letteratura'],
          passedExamsDate: ['2024-01-27', '2024-02-10', '2024-03-19'],
        },
        {
          id: 'S317619',
          name: 'Nicola',
          surname: 'Rinaldi',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Trento',
          degreeCourse: 'Statistica',
          passedExams: ['Statistica I', 'Probabilità', 'Economia'],
          passedExamsDate: ['2024-01-17', '2024-02-25', '2024-03-03'],
        },
        {
          id: 'S317620',
          name: 'Laura',
          surname: 'Fabbri',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Rimini',
          degreeCourse: 'Medicina',
          passedExams: ['Anatomia', 'Fisiologia', 'Biologia'],
          passedExamsDate: ['2024-01-21', '2024-02-15', '2024-03-01'],
        },
      ],
      groups: [],
    },
  ]);

  const [managedCourses, setManagedCourses] = useState<Course[]>([
    {
      id: 5,
      code: 'INF201',
      title: 'Informatica Teorica',
      subtitle: 'Iscritti: 120 - Periodo 1',
      managed: false,

      period: 1,
      registered: 120,
      teacherId: 'Prof. Gialli',
      year: '2023/2024',
      cfu: 6,
      notices: [
        {
          id: 1,
          title: 'Avviso',
          content: 'Rinviato il test di Informatica Teorica.',
          startDate: '2024-03-28',
          visible: true,
        },
      ],
      assignments: [],
      staff: [
        { id: 1, name: 'Tu', role: 'Collaboratore', access: 'Può eliminare' },
        {
          id: 2,
          name: 'Mario Rossi',
          role: 'Titolare',
          access: 'Può leggere',
          idProfile: 9,
        },
      ],
      examcalls: [
        {
          id: 1,
          name: 'Informatica Teorica',
          date: '2024-10-04',
          professor: 'Tu',
          idExam: 9,
        },
        {
          id: 2,
          name: 'Informatica Teorica',
          date: '2024-10-05',
          professor: 'Tu',
          idExam: 10,
        },
      ],
      guide: 'this is the course guide',
      directories: [
        {
          id: 1,
          name: 'Appunti Lezioni',
          files: [
            {
              id: 1,
              name: 'Lezione1.pdf',
              date: '2024-10-04',
              size: 100,
              mimeType: 'pdf',
              dirId: 1,
            },
            {
              id: 2,
              name: 'Lezione2.pdf',
              date: '2024-10-04',
              size: 100,
              mimeType: 'pdf',
              dirId: 1,
            },
          ],
        },
        {
          id: 2,
          name: 'Esercizi',
          files: [
            {
              id: 3,
              name: 'Esercizio1.pdf',
              date: '2024-10-04',
              size: 100,
              mimeType: 'pdf',
              dirId: 2,
            },
            {
              id: 4,
              name: 'Esercizio2.pdf',
              date: '2024-10-04',
              size: 100,
              mimeType: 'pdf',
              dirId: 2,
            },
          ],
        },
      ],
      lessons: [
        {
          id: 1,
          title: 'Lezione 1',
          date: '2024-10-04',
          time: '17:30-19:00',
          content: 'ciao a tutti voi',
        },
      ],
      students: [
        {
          id: 'S317601',
          name: 'Luca',
          surname: 'Bianchi',
          year: '2024',
          exam: 'yes',
          cityOfBirth: 'Milano',
          degreeCourse: 'Informatica',
          passedExams: ['Matematica I', 'Programmazione', 'Fisica I'],
          passedExamsDate: ['2024-01-10', '2024-02-12', '2024-03-05'],
        },
        {
          id: 'S317602',
          name: 'Giulia',
          surname: 'Rossi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Roma',
          degreeCourse: 'Fisica',
          passedExams: ['Fisica I', 'Analisi I', 'Laboratorio'],
          passedExamsDate: ['2024-01-18', '2024-02-20', '2024-03-15'],
        },
        {
          id: 'S317603',
          name: 'Marco',
          surname: 'Verdi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Torino',
          degreeCourse: 'Matematica',
          passedExams: ['Analisi I', 'Algebra', 'Geometria'],
          passedExamsDate: ['2024-01-22', '2024-02-28', '2024-03-10'],
        },
        {
          id: 'S317604',
          name: 'Chiara',
          surname: 'Neri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Napoli',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi', 'Meccanica'],
          passedExamsDate: ['2024-01-30', '2024-02-18', '2024-03-12'],
        },
        {
          id: 'S317605',
          name: 'Davide',
          surname: 'Ferrari',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Firenze',
          degreeCourse: 'Chimica',
          passedExams: ['Chimica Generale', 'Fisica', 'Matematica'],
          passedExamsDate: ['2024-01-16', '2024-02-14', '2024-03-08'],
        },
        {
          id: 'S317606',
          name: 'Francesca',
          surname: 'Gallo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Bologna',
          degreeCourse: 'Biologia',
          passedExams: ['Biologia Cellulare', 'Chimica', 'Genetica'],
          passedExamsDate: ['2024-01-25', '2024-02-22', '2024-03-11'],
        },
        {
          id: 'S317607',
          name: 'Alessandro',
          surname: 'Russo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Genova',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Statistica', 'Matematica'],
          passedExamsDate: ['2024-01-28', '2024-02-19', '2024-03-14'],
        },
        {
          id: 'S317608',
          name: 'Martina',
          surname: 'Greco',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Venezia',
          degreeCourse: 'Giurisprudenza',
          passedExams: [
            'Diritto Privato',
            'Diritto Pubblico',
            'Economia Politica',
          ],
          passedExamsDate: ['2024-01-12', '2024-02-17', '2024-03-09'],
        },
        {
          id: 'S317609',
          name: 'Stefano',
          surname: 'Esposito',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Palermo',
          degreeCourse: 'Psicologia',
          passedExams: ['Psicologia Generale', 'Statistica', 'Psicobiologia'],
          passedExamsDate: ['2024-01-11', '2024-02-11', '2024-03-11'],
        },
        {
          id: 'S317610',
          name: 'Federica',
          surname: 'Romano',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Verona',
          degreeCourse: 'Sociologia',
          passedExams: [
            'Sociologia Generale',
            'Metodologia',
            'Statistica Sociale',
          ],
          passedExamsDate: ['2024-01-15', '2024-02-20', '2024-03-13'],
        },
        {
          id: 'S317611',
          name: 'Matteo',
          surname: 'Colombo',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Trieste',
          degreeCourse: 'Filosofia',
          passedExams: ['Filosofia Antica', 'Logica', 'Estetica'],
          passedExamsDate: ['2024-01-23', '2024-02-13', '2024-03-06'],
        },
        {
          id: 'S317612',
          name: 'Elisa',
          surname: 'Conti',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Perugia',
          degreeCourse: 'Architettura',
          passedExams: ['Storia dell’Arte', 'Disegno Tecnico', 'Fisica'],
          passedExamsDate: ['2024-01-29', '2024-02-26', '2024-03-07'],
        },
        {
          id: 'S317613',
          name: 'Simone',
          surname: 'De Luca',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Lecce',
          degreeCourse: 'Informatica',
          passedExams: [
            'Programmazione',
            'Matematica Discreta',
            'Sistemi Operativi',
          ],
          passedExamsDate: ['2024-01-19', '2024-02-21', '2024-03-18'],
        },
        {
          id: 'S317614',
          name: 'Valentina',
          surname: 'Barbieri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Cagliari',
          degreeCourse: 'Design',
          passedExams: [
            'Disegno Industriale',
            'Teoria del Colore',
            'Storia del Design',
          ],
          passedExamsDate: ['2024-01-14', '2024-02-23', '2024-03-20'],
        },
        {
          id: 'S317615',
          name: 'Andrea',
          surname: 'Mancini',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Modena',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Macroeconomia', 'Statistica'],
          passedExamsDate: ['2024-01-09', '2024-02-05', '2024-03-04'],
        },
        {
          id: 'S317616',
          name: 'Sara',
          surname: 'Moretti',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Parma',
          degreeCourse: 'Biotecnologie',
          passedExams: ['Biologia Molecolare', 'Chimica', 'Bioinformatica'],
          passedExamsDate: ['2024-01-26', '2024-02-16', '2024-03-17'],
        },
        {
          id: 'S317617',
          name: 'Gabriele',
          surname: 'Fontana',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Reggio Emilia',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi I', 'Informatica'],
          passedExamsDate: ['2024-01-13', '2024-02-08', '2024-03-16'],
        },
        {
          id: 'S317618',
          name: 'Ilaria',
          surname: 'Mariani',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Aosta',
          degreeCourse: 'Lingue',
          passedExams: ['Lingua Inglese', 'Linguistica', 'Letteratura'],
          passedExamsDate: ['2024-01-27', '2024-02-10', '2024-03-19'],
        },
        {
          id: 'S317619',
          name: 'Nicola',
          surname: 'Rinaldi',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Trento',
          degreeCourse: 'Statistica',
          passedExams: ['Statistica I', 'Probabilità', 'Economia'],
          passedExamsDate: ['2024-01-17', '2024-02-25', '2024-03-03'],
        },
        {
          id: 'S317620',
          name: 'Laura',
          surname: 'Fabbri',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Rimini',
          degreeCourse: 'Medicina',
          passedExams: ['Anatomia', 'Fisiologia', 'Biologia'],
          passedExamsDate: ['2024-01-21', '2024-02-15', '2024-03-01'],
        },
      ],
      groups: [],
    },
    {
      id: 6,
      code: 'INF201',
      title: 'Intelligenza Artificiale',
      subtitle: 'Iscritti: 95 - Periodo 2',
      period: 2,
      managed: false,

      registered: 95,
      teacherId: 'Prof. Blu',
      year: '2023/2024',
      cfu: 9,

      notices: [
        {
          id: 1,
          title: 'Avviso',
          content: 'Prolungato il termine per la consegna del progetto.',
          startDate: '2024-02-04',
          visible: true,
        },
      ],
      assignments: [],
      staff: [
        { id: 1, name: 'Tu', role: 'Collaboratore', access: 'Può eliminare' },
        {
          id: 2,
          name: 'Mario Rossi',
          role: 'Titolare',
          access: 'Può leggere',
          idProfile: 9,
        },
      ],
      examcalls: [
        {
          id: 1,
          name: 'Intelligenza Artificiale',
          date: '2024-10-04',
          professor: 'Tu',
          idExam: 11,
        },
        {
          id: 2,
          name: 'Intelligenza Artificiale',
          date: '2024-10-05',
          professor: 'Tu',
          idExam: 12,
        },
      ],
      guide: 'this is the course guide',
      directories: [
        {
          id: 1,
          name: 'Appunti Lezioni',
          files: [
            {
              id: 1,
              name: 'Lezione1.pdf',
              date: '2024-10-04',
              size: 100,
              mimeType: 'pdf',
              dirId: 1,
            },
            {
              id: 2,
              name: 'Lezione2.pdf',
              date: '2024-10-04',
              size: 100,
              mimeType: 'pdf',
              dirId: 1,
            },
          ],
        },
        {
          id: 2,
          name: 'Esercizi',
          files: [
            {
              id: 3,
              name: 'Esercizio1.pdf',
              date: '2024-10-04',
              size: 100,
              mimeType: 'pdf',
              dirId: 2,
            },
            {
              id: 4,
              name: 'Esercizio2.pdf',
              date: '2024-10-04',
              size: 100,
              mimeType: 'pdf',
              dirId: 2,
            },
          ],
        },
      ],
      lessons: [
        {
          id: 1,
          title: 'Lezione 1',
          date: '2024-10-04',
          time: '17:30-19:00',
          content: 'ciao a tutti voi',
        },
      ],
      students: [
        {
          id: 'S317601',
          name: 'Luca',
          surname: 'Bianchi',
          year: '2024',
          exam: 'yes',
          cityOfBirth: 'Milano',
          degreeCourse: 'Informatica',
          passedExams: ['Matematica I', 'Programmazione', 'Fisica I'],
          passedExamsDate: ['2024-01-10', '2024-02-12', '2024-03-05'],
        },
        {
          id: 'S317602',
          name: 'Giulia',
          surname: 'Rossi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Roma',
          degreeCourse: 'Fisica',
          passedExams: ['Fisica I', 'Analisi I', 'Laboratorio'],
          passedExamsDate: ['2024-01-18', '2024-02-20', '2024-03-15'],
        },
        {
          id: 'S317603',
          name: 'Marco',
          surname: 'Verdi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Torino',
          degreeCourse: 'Matematica',
          passedExams: ['Analisi I', 'Algebra', 'Geometria'],
          passedExamsDate: ['2024-01-22', '2024-02-28', '2024-03-10'],
        },
        {
          id: 'S317604',
          name: 'Chiara',
          surname: 'Neri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Napoli',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi', 'Meccanica'],
          passedExamsDate: ['2024-01-30', '2024-02-18', '2024-03-12'],
        },
        {
          id: 'S317605',
          name: 'Davide',
          surname: 'Ferrari',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Firenze',
          degreeCourse: 'Chimica',
          passedExams: ['Chimica Generale', 'Fisica', 'Matematica'],
          passedExamsDate: ['2024-01-16', '2024-02-14', '2024-03-08'],
        },
        {
          id: 'S317606',
          name: 'Francesca',
          surname: 'Gallo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Bologna',
          degreeCourse: 'Biologia',
          passedExams: ['Biologia Cellulare', 'Chimica', 'Genetica'],
          passedExamsDate: ['2024-01-25', '2024-02-22', '2024-03-11'],
        },
        {
          id: 'S317607',
          name: 'Alessandro',
          surname: 'Russo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Genova',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Statistica', 'Matematica'],
          passedExamsDate: ['2024-01-28', '2024-02-19', '2024-03-14'],
        },
        {
          id: 'S317608',
          name: 'Martina',
          surname: 'Greco',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Venezia',
          degreeCourse: 'Giurisprudenza',
          passedExams: [
            'Diritto Privato',
            'Diritto Pubblico',
            'Economia Politica',
          ],
          passedExamsDate: ['2024-01-12', '2024-02-17', '2024-03-09'],
        },
        {
          id: 'S317609',
          name: 'Stefano',
          surname: 'Esposito',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Palermo',
          degreeCourse: 'Psicologia',
          passedExams: ['Psicologia Generale', 'Statistica', 'Psicobiologia'],
          passedExamsDate: ['2024-01-11', '2024-02-11', '2024-03-11'],
        },
        {
          id: 'S317610',
          name: 'Federica',
          surname: 'Romano',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Verona',
          degreeCourse: 'Sociologia',
          passedExams: [
            'Sociologia Generale',
            'Metodologia',
            'Statistica Sociale',
          ],
          passedExamsDate: ['2024-01-15', '2024-02-20', '2024-03-13'],
        },
        {
          id: 'S317611',
          name: 'Matteo',
          surname: 'Colombo',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Trieste',
          degreeCourse: 'Filosofia',
          passedExams: ['Filosofia Antica', 'Logica', 'Estetica'],
          passedExamsDate: ['2024-01-23', '2024-02-13', '2024-03-06'],
        },
        {
          id: 'S317612',
          name: 'Elisa',
          surname: 'Conti',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Perugia',
          degreeCourse: 'Architettura',
          passedExams: ['Storia dell’Arte', 'Disegno Tecnico', 'Fisica'],
          passedExamsDate: ['2024-01-29', '2024-02-26', '2024-03-07'],
        },
        {
          id: 'S317613',
          name: 'Simone',
          surname: 'De Luca',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Lecce',
          degreeCourse: 'Informatica',
          passedExams: [
            'Programmazione',
            'Matematica Discreta',
            'Sistemi Operativi',
          ],
          passedExamsDate: ['2024-01-19', '2024-02-21', '2024-03-18'],
        },
        {
          id: 'S317614',
          name: 'Valentina',
          surname: 'Barbieri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Cagliari',
          degreeCourse: 'Design',
          passedExams: [
            'Disegno Industriale',
            'Teoria del Colore',
            'Storia del Design',
          ],
          passedExamsDate: ['2024-01-14', '2024-02-23', '2024-03-20'],
        },
        {
          id: 'S317615',
          name: 'Andrea',
          surname: 'Mancini',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Modena',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Macroeconomia', 'Statistica'],
          passedExamsDate: ['2024-01-09', '2024-02-05', '2024-03-04'],
        },
        {
          id: 'S317616',
          name: 'Sara',
          surname: 'Moretti',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Parma',
          degreeCourse: 'Biotecnologie',
          passedExams: ['Biologia Molecolare', 'Chimica', 'Bioinformatica'],
          passedExamsDate: ['2024-01-26', '2024-02-16', '2024-03-17'],
        },
        {
          id: 'S317617',
          name: 'Gabriele',
          surname: 'Fontana',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Reggio Emilia',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi I', 'Informatica'],
          passedExamsDate: ['2024-01-13', '2024-02-08', '2024-03-16'],
        },
        {
          id: 'S317618',
          name: 'Ilaria',
          surname: 'Mariani',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Aosta',
          degreeCourse: 'Lingue',
          passedExams: ['Lingua Inglese', 'Linguistica', 'Letteratura'],
          passedExamsDate: ['2024-01-27', '2024-02-10', '2024-03-19'],
        },
        {
          id: 'S317619',
          name: 'Nicola',
          surname: 'Rinaldi',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Trento',
          degreeCourse: 'Statistica',
          passedExams: ['Statistica I', 'Probabilità', 'Economia'],
          passedExamsDate: ['2024-01-17', '2024-02-25', '2024-03-03'],
        },
        {
          id: 'S317620',
          name: 'Laura',
          surname: 'Fabbri',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Rimini',
          degreeCourse: 'Medicina',
          passedExams: ['Anatomia', 'Fisiologia', 'Biologia'],
          passedExamsDate: ['2024-01-21', '2024-02-15', '2024-03-01'],
        },
      ],
      groups: [],
    },
  ]);

  const [fakeExams, setFakeExams] = useState<Exam[]>([
    {
      id: 1,
      subject: 'Matematica',
      date: 'Oggi',
      endDate: 'Chiuse',
      period: 1,
      where: 'Aula 3',
      modality: 'Scritto',
      booked: 89,
      students: [
        {
          id: 'S317601',
          name: 'Luca',
          surname: 'Bianchi',
          year: '2024',
          exam: 'yes',
          cityOfBirth: 'Milano',
          degreeCourse: 'Informatica',
          passedExams: ['Matematica I', 'Programmazione', 'Fisica I'],
          passedExamsDate: ['2024-01-10', '2024-02-12', '2024-03-05'],
        },
        {
          id: 'S317602',
          name: 'Giulia',
          surname: 'Rossi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Roma',
          degreeCourse: 'Fisica',
          passedExams: ['Fisica I', 'Analisi I', 'Laboratorio'],
          passedExamsDate: ['2024-01-18', '2024-02-20', '2024-03-15'],
        },
        {
          id: 'S317603',
          name: 'Marco',
          surname: 'Verdi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Torino',
          degreeCourse: 'Matematica',
          passedExams: ['Analisi I', 'Algebra', 'Geometria'],
          passedExamsDate: ['2024-01-22', '2024-02-28', '2024-03-10'],
        },
        {
          id: 'S317604',
          name: 'Chiara',
          surname: 'Neri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Napoli',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi', 'Meccanica'],
          passedExamsDate: ['2024-01-30', '2024-02-18', '2024-03-12'],
        },
        {
          id: 'S317605',
          name: 'Davide',
          surname: 'Ferrari',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Firenze',
          degreeCourse: 'Chimica',
          passedExams: ['Chimica Generale', 'Fisica', 'Matematica'],
          passedExamsDate: ['2024-01-16', '2024-02-14', '2024-03-08'],
        },
        {
          id: 'S317606',
          name: 'Francesca',
          surname: 'Gallo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Bologna',
          degreeCourse: 'Biologia',
          passedExams: ['Biologia Cellulare', 'Chimica', 'Genetica'],
          passedExamsDate: ['2024-01-25', '2024-02-22', '2024-03-11'],
        },
        {
          id: 'S317607',
          name: 'Alessandro',
          surname: 'Russo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Genova',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Statistica', 'Matematica'],
          passedExamsDate: ['2024-01-28', '2024-02-19', '2024-03-14'],
        },
        {
          id: 'S317608',
          name: 'Martina',
          surname: 'Greco',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Venezia',
          degreeCourse: 'Giurisprudenza',
          passedExams: [
            'Diritto Privato',
            'Diritto Pubblico',
            'Economia Politica',
          ],
          passedExamsDate: ['2024-01-12', '2024-02-17', '2024-03-09'],
        },
        {
          id: 'S317609',
          name: 'Stefano',
          surname: 'Esposito',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Palermo',
          degreeCourse: 'Psicologia',
          passedExams: ['Psicologia Generale', 'Statistica', 'Psicobiologia'],
          passedExamsDate: ['2024-01-11', '2024-02-11', '2024-03-11'],
        },
        {
          id: 'S317610',
          name: 'Federica',
          surname: 'Romano',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Verona',
          degreeCourse: 'Sociologia',
          passedExams: [
            'Sociologia Generale',
            'Metodologia',
            'Statistica Sociale',
          ],
          passedExamsDate: ['2024-01-15', '2024-02-20', '2024-03-13'],
        },
        {
          id: 'S317611',
          name: 'Matteo',
          surname: 'Colombo',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Trieste',
          degreeCourse: 'Filosofia',
          passedExams: ['Filosofia Antica', 'Logica', 'Estetica'],
          passedExamsDate: ['2024-01-23', '2024-02-13', '2024-03-06'],
        },
        {
          id: 'S317612',
          name: 'Elisa',
          surname: 'Conti',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Perugia',
          degreeCourse: 'Architettura',
          passedExams: ['Storia dell’Arte', 'Disegno Tecnico', 'Fisica'],
          passedExamsDate: ['2024-01-29', '2024-02-26', '2024-03-07'],
        },
        {
          id: 'S317613',
          name: 'Simone',
          surname: 'De Luca',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Lecce',
          degreeCourse: 'Informatica',
          passedExams: [
            'Programmazione',
            'Matematica Discreta',
            'Sistemi Operativi',
          ],
          passedExamsDate: ['2024-01-19', '2024-02-21', '2024-03-18'],
        },
        {
          id: 'S317614',
          name: 'Valentina',
          surname: 'Barbieri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Cagliari',
          degreeCourse: 'Design',
          passedExams: [
            'Disegno Industriale',
            'Teoria del Colore',
            'Storia del Design',
          ],
          passedExamsDate: ['2024-01-14', '2024-02-23', '2024-03-20'],
        },
        {
          id: 'S317615',
          name: 'Andrea',
          surname: 'Mancini',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Modena',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Macroeconomia', 'Statistica'],
          passedExamsDate: ['2024-01-09', '2024-02-05', '2024-03-04'],
        },
        {
          id: 'S317616',
          name: 'Sara',
          surname: 'Moretti',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Parma',
          degreeCourse: 'Biotecnologie',
          passedExams: ['Biologia Molecolare', 'Chimica', 'Bioinformatica'],
          passedExamsDate: ['2024-01-26', '2024-02-16', '2024-03-17'],
        },
        {
          id: 'S317617',
          name: 'Gabriele',
          surname: 'Fontana',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Reggio Emilia',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi I', 'Informatica'],
          passedExamsDate: ['2024-01-13', '2024-02-08', '2024-03-16'],
        },
        {
          id: 'S317618',
          name: 'Ilaria',
          surname: 'Mariani',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Aosta',
          degreeCourse: 'Lingue',
          passedExams: ['Lingua Inglese', 'Linguistica', 'Letteratura'],
          passedExamsDate: ['2024-01-27', '2024-02-10', '2024-03-19'],
        },
        {
          id: 'S317619',
          name: 'Nicola',
          surname: 'Rinaldi',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Trento',
          degreeCourse: 'Statistica',
          passedExams: ['Statistica I', 'Probabilità', 'Economia'],
          passedExamsDate: ['2024-01-17', '2024-02-25', '2024-03-03'],
        },
        {
          id: 'S317620',
          name: 'Laura',
          surname: 'Fabbri',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Rimini',
          degreeCourse: 'Medicina',
          passedExams: ['Anatomia', 'Fisiologia', 'Biologia'],
          passedExamsDate: ['2024-01-21', '2024-02-15', '2024-03-01'],
        },
      ],
    },
    {
      id: 2,
      subject: 'Matematica',
      date: '2025-10-05',
      endDate: '2025-30-04',
      period: 2,
      where: 'Aula 3',
      modality: 'Scritto',
      booked: 89,
      students: [
        {
          id: 'S317601',
          name: 'Luca',
          surname: 'Bianchi',
          year: '2024',
          exam: 'yes',
          cityOfBirth: 'Milano',
          degreeCourse: 'Informatica',
          passedExams: ['Matematica I', 'Programmazione', 'Fisica I'],
          passedExamsDate: ['2024-01-10', '2024-02-12', '2024-03-05'],
        },
        {
          id: 'S317602',
          name: 'Giulia',
          surname: 'Rossi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Roma',
          degreeCourse: 'Fisica',
          passedExams: ['Fisica I', 'Analisi I', 'Laboratorio'],
          passedExamsDate: ['2024-01-18', '2024-02-20', '2024-03-15'],
        },
        {
          id: 'S317603',
          name: 'Marco',
          surname: 'Verdi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Torino',
          degreeCourse: 'Matematica',
          passedExams: ['Analisi I', 'Algebra', 'Geometria'],
          passedExamsDate: ['2024-01-22', '2024-02-28', '2024-03-10'],
        },
        {
          id: 'S317604',
          name: 'Chiara',
          surname: 'Neri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Napoli',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi', 'Meccanica'],
          passedExamsDate: ['2024-01-30', '2024-02-18', '2024-03-12'],
        },
        {
          id: 'S317605',
          name: 'Davide',
          surname: 'Ferrari',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Firenze',
          degreeCourse: 'Chimica',
          passedExams: ['Chimica Generale', 'Fisica', 'Matematica'],
          passedExamsDate: ['2024-01-16', '2024-02-14', '2024-03-08'],
        },
        {
          id: 'S317606',
          name: 'Francesca',
          surname: 'Gallo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Bologna',
          degreeCourse: 'Biologia',
          passedExams: ['Biologia Cellulare', 'Chimica', 'Genetica'],
          passedExamsDate: ['2024-01-25', '2024-02-22', '2024-03-11'],
        },
        {
          id: 'S317607',
          name: 'Alessandro',
          surname: 'Russo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Genova',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Statistica', 'Matematica'],
          passedExamsDate: ['2024-01-28', '2024-02-19', '2024-03-14'],
        },
        {
          id: 'S317608',
          name: 'Martina',
          surname: 'Greco',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Venezia',
          degreeCourse: 'Giurisprudenza',
          passedExams: [
            'Diritto Privato',
            'Diritto Pubblico',
            'Economia Politica',
          ],
          passedExamsDate: ['2024-01-12', '2024-02-17', '2024-03-09'],
        },
        {
          id: 'S317609',
          name: 'Stefano',
          surname: 'Esposito',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Palermo',
          degreeCourse: 'Psicologia',
          passedExams: ['Psicologia Generale', 'Statistica', 'Psicobiologia'],
          passedExamsDate: ['2024-01-11', '2024-02-11', '2024-03-11'],
        },
        {
          id: 'S317610',
          name: 'Federica',
          surname: 'Romano',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Verona',
          degreeCourse: 'Sociologia',
          passedExams: [
            'Sociologia Generale',
            'Metodologia',
            'Statistica Sociale',
          ],
          passedExamsDate: ['2024-01-15', '2024-02-20', '2024-03-13'],
        },
        {
          id: 'S317611',
          name: 'Matteo',
          surname: 'Colombo',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Trieste',
          degreeCourse: 'Filosofia',
          passedExams: ['Filosofia Antica', 'Logica', 'Estetica'],
          passedExamsDate: ['2024-01-23', '2024-02-13', '2024-03-06'],
        },
        {
          id: 'S317612',
          name: 'Elisa',
          surname: 'Conti',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Perugia',
          degreeCourse: 'Architettura',
          passedExams: ['Storia dell’Arte', 'Disegno Tecnico', 'Fisica'],
          passedExamsDate: ['2024-01-29', '2024-02-26', '2024-03-07'],
        },
        {
          id: 'S317613',
          name: 'Simone',
          surname: 'De Luca',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Lecce',
          degreeCourse: 'Informatica',
          passedExams: [
            'Programmazione',
            'Matematica Discreta',
            'Sistemi Operativi',
          ],
          passedExamsDate: ['2024-01-19', '2024-02-21', '2024-03-18'],
        },
        {
          id: 'S317614',
          name: 'Valentina',
          surname: 'Barbieri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Cagliari',
          degreeCourse: 'Design',
          passedExams: [
            'Disegno Industriale',
            'Teoria del Colore',
            'Storia del Design',
          ],
          passedExamsDate: ['2024-01-14', '2024-02-23', '2024-03-20'],
        },
        {
          id: 'S317615',
          name: 'Andrea',
          surname: 'Mancini',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Modena',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Macroeconomia', 'Statistica'],
          passedExamsDate: ['2024-01-09', '2024-02-05', '2024-03-04'],
        },
        {
          id: 'S317616',
          name: 'Sara',
          surname: 'Moretti',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Parma',
          degreeCourse: 'Biotecnologie',
          passedExams: ['Biologia Molecolare', 'Chimica', 'Bioinformatica'],
          passedExamsDate: ['2024-01-26', '2024-02-16', '2024-03-17'],
        },
        {
          id: 'S317617',
          name: 'Gabriele',
          surname: 'Fontana',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Reggio Emilia',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi I', 'Informatica'],
          passedExamsDate: ['2024-01-13', '2024-02-08', '2024-03-16'],
        },
        {
          id: 'S317618',
          name: 'Ilaria',
          surname: 'Mariani',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Aosta',
          degreeCourse: 'Lingue',
          passedExams: ['Lingua Inglese', 'Linguistica', 'Letteratura'],
          passedExamsDate: ['2024-01-27', '2024-02-10', '2024-03-19'],
        },
        {
          id: 'S317619',
          name: 'Nicola',
          surname: 'Rinaldi',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Trento',
          degreeCourse: 'Statistica',
          passedExams: ['Statistica I', 'Probabilità', 'Economia'],
          passedExamsDate: ['2024-01-17', '2024-02-25', '2024-03-03'],
        },
        {
          id: 'S317620',
          name: 'Laura',
          surname: 'Fabbri',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Rimini',
          degreeCourse: 'Medicina',
          passedExams: ['Anatomia', 'Fisiologia', 'Biologia'],
          passedExamsDate: ['2024-01-21', '2024-02-15', '2024-03-01'],
        },
      ],
    },
    {
      id: 3,
      subject: 'Fisica',
      date: '2025-20-04',
      endDate: '2025-10-04',
      period: 1,
      where: 'Aula 3',
      modality: 'Scritto',
      booked: 89,
      students: [
        {
          id: 'S317601',
          name: 'Luca',
          surname: 'Bianchi',
          year: '2024',
          exam: 'yes',
          cityOfBirth: 'Milano',
          degreeCourse: 'Informatica',
          passedExams: ['Matematica I', 'Programmazione', 'Fisica I'],
          passedExamsDate: ['2024-01-10', '2024-02-12', '2024-03-05'],
        },
        {
          id: 'S317602',
          name: 'Giulia',
          surname: 'Rossi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Roma',
          degreeCourse: 'Fisica',
          passedExams: ['Fisica I', 'Analisi I', 'Laboratorio'],
          passedExamsDate: ['2024-01-18', '2024-02-20', '2024-03-15'],
        },
        {
          id: 'S317603',
          name: 'Marco',
          surname: 'Verdi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Torino',
          degreeCourse: 'Matematica',
          passedExams: ['Analisi I', 'Algebra', 'Geometria'],
          passedExamsDate: ['2024-01-22', '2024-02-28', '2024-03-10'],
        },
        {
          id: 'S317604',
          name: 'Chiara',
          surname: 'Neri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Napoli',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi', 'Meccanica'],
          passedExamsDate: ['2024-01-30', '2024-02-18', '2024-03-12'],
        },
        {
          id: 'S317605',
          name: 'Davide',
          surname: 'Ferrari',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Firenze',
          degreeCourse: 'Chimica',
          passedExams: ['Chimica Generale', 'Fisica', 'Matematica'],
          passedExamsDate: ['2024-01-16', '2024-02-14', '2024-03-08'],
        },
        {
          id: 'S317606',
          name: 'Francesca',
          surname: 'Gallo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Bologna',
          degreeCourse: 'Biologia',
          passedExams: ['Biologia Cellulare', 'Chimica', 'Genetica'],
          passedExamsDate: ['2024-01-25', '2024-02-22', '2024-03-11'],
        },
        {
          id: 'S317607',
          name: 'Alessandro',
          surname: 'Russo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Genova',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Statistica', 'Matematica'],
          passedExamsDate: ['2024-01-28', '2024-02-19', '2024-03-14'],
        },
        {
          id: 'S317608',
          name: 'Martina',
          surname: 'Greco',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Venezia',
          degreeCourse: 'Giurisprudenza',
          passedExams: [
            'Diritto Privato',
            'Diritto Pubblico',
            'Economia Politica',
          ],
          passedExamsDate: ['2024-01-12', '2024-02-17', '2024-03-09'],
        },
        {
          id: 'S317609',
          name: 'Stefano',
          surname: 'Esposito',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Palermo',
          degreeCourse: 'Psicologia',
          passedExams: ['Psicologia Generale', 'Statistica', 'Psicobiologia'],
          passedExamsDate: ['2024-01-11', '2024-02-11', '2024-03-11'],
        },
        {
          id: 'S317610',
          name: 'Federica',
          surname: 'Romano',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Verona',
          degreeCourse: 'Sociologia',
          passedExams: [
            'Sociologia Generale',
            'Metodologia',
            'Statistica Sociale',
          ],
          passedExamsDate: ['2024-01-15', '2024-02-20', '2024-03-13'],
        },
        {
          id: 'S317611',
          name: 'Matteo',
          surname: 'Colombo',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Trieste',
          degreeCourse: 'Filosofia',
          passedExams: ['Filosofia Antica', 'Logica', 'Estetica'],
          passedExamsDate: ['2024-01-23', '2024-02-13', '2024-03-06'],
        },
        {
          id: 'S317612',
          name: 'Elisa',
          surname: 'Conti',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Perugia',
          degreeCourse: 'Architettura',
          passedExams: ['Storia dell’Arte', 'Disegno Tecnico', 'Fisica'],
          passedExamsDate: ['2024-01-29', '2024-02-26', '2024-03-07'],
        },
        {
          id: 'S317613',
          name: 'Simone',
          surname: 'De Luca',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Lecce',
          degreeCourse: 'Informatica',
          passedExams: [
            'Programmazione',
            'Matematica Discreta',
            'Sistemi Operativi',
          ],
          passedExamsDate: ['2024-01-19', '2024-02-21', '2024-03-18'],
        },
        {
          id: 'S317614',
          name: 'Valentina',
          surname: 'Barbieri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Cagliari',
          degreeCourse: 'Design',
          passedExams: [
            'Disegno Industriale',
            'Teoria del Colore',
            'Storia del Design',
          ],
          passedExamsDate: ['2024-01-14', '2024-02-23', '2024-03-20'],
        },
        {
          id: 'S317615',
          name: 'Andrea',
          surname: 'Mancini',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Modena',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Macroeconomia', 'Statistica'],
          passedExamsDate: ['2024-01-09', '2024-02-05', '2024-03-04'],
        },
        {
          id: 'S317616',
          name: 'Sara',
          surname: 'Moretti',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Parma',
          degreeCourse: 'Biotecnologie',
          passedExams: ['Biologia Molecolare', 'Chimica', 'Bioinformatica'],
          passedExamsDate: ['2024-01-26', '2024-02-16', '2024-03-17'],
        },
        {
          id: 'S317617',
          name: 'Gabriele',
          surname: 'Fontana',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Reggio Emilia',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi I', 'Informatica'],
          passedExamsDate: ['2024-01-13', '2024-02-08', '2024-03-16'],
        },
        {
          id: 'S317618',
          name: 'Ilaria',
          surname: 'Mariani',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Aosta',
          degreeCourse: 'Lingue',
          passedExams: ['Lingua Inglese', 'Linguistica', 'Letteratura'],
          passedExamsDate: ['2024-01-27', '2024-02-10', '2024-03-19'],
        },
        {
          id: 'S317619',
          name: 'Nicola',
          surname: 'Rinaldi',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Trento',
          degreeCourse: 'Statistica',
          passedExams: ['Statistica I', 'Probabilità', 'Economia'],
          passedExamsDate: ['2024-01-17', '2024-02-25', '2024-03-03'],
        },
        {
          id: 'S317620',
          name: 'Laura',
          surname: 'Fabbri',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Rimini',
          degreeCourse: 'Medicina',
          passedExams: ['Anatomia', 'Fisiologia', 'Biologia'],
          passedExamsDate: ['2024-01-21', '2024-02-15', '2024-03-01'],
        },
      ],
    },
    {
      id: 4,
      subject: 'Fisica',
      date: '2025-20-05',
      endDate: '2025-10-05',
      period: 2,
      where: 'Aula 3',
      modality: 'Scritto',
      booked: 89,
      students: [
        {
          id: 'S317601',
          name: 'Luca',
          surname: 'Bianchi',
          year: '2024',
          exam: 'yes',
          cityOfBirth: 'Milano',
          degreeCourse: 'Informatica',
          passedExams: ['Matematica I', 'Programmazione', 'Fisica I'],
          passedExamsDate: ['2024-01-10', '2024-02-12', '2024-03-05'],
        },
        {
          id: 'S317602',
          name: 'Giulia',
          surname: 'Rossi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Roma',
          degreeCourse: 'Fisica',
          passedExams: ['Fisica I', 'Analisi I', 'Laboratorio'],
          passedExamsDate: ['2024-01-18', '2024-02-20', '2024-03-15'],
        },
        {
          id: 'S317603',
          name: 'Marco',
          surname: 'Verdi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Torino',
          degreeCourse: 'Matematica',
          passedExams: ['Analisi I', 'Algebra', 'Geometria'],
          passedExamsDate: ['2024-01-22', '2024-02-28', '2024-03-10'],
        },
        {
          id: 'S317604',
          name: 'Chiara',
          surname: 'Neri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Napoli',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi', 'Meccanica'],
          passedExamsDate: ['2024-01-30', '2024-02-18', '2024-03-12'],
        },
        {
          id: 'S317605',
          name: 'Davide',
          surname: 'Ferrari',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Firenze',
          degreeCourse: 'Chimica',
          passedExams: ['Chimica Generale', 'Fisica', 'Matematica'],
          passedExamsDate: ['2024-01-16', '2024-02-14', '2024-03-08'],
        },
        {
          id: 'S317606',
          name: 'Francesca',
          surname: 'Gallo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Bologna',
          degreeCourse: 'Biologia',
          passedExams: ['Biologia Cellulare', 'Chimica', 'Genetica'],
          passedExamsDate: ['2024-01-25', '2024-02-22', '2024-03-11'],
        },
        {
          id: 'S317607',
          name: 'Alessandro',
          surname: 'Russo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Genova',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Statistica', 'Matematica'],
          passedExamsDate: ['2024-01-28', '2024-02-19', '2024-03-14'],
        },
        {
          id: 'S317608',
          name: 'Martina',
          surname: 'Greco',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Venezia',
          degreeCourse: 'Giurisprudenza',
          passedExams: [
            'Diritto Privato',
            'Diritto Pubblico',
            'Economia Politica',
          ],
          passedExamsDate: ['2024-01-12', '2024-02-17', '2024-03-09'],
        },
        {
          id: 'S317609',
          name: 'Stefano',
          surname: 'Esposito',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Palermo',
          degreeCourse: 'Psicologia',
          passedExams: ['Psicologia Generale', 'Statistica', 'Psicobiologia'],
          passedExamsDate: ['2024-01-11', '2024-02-11', '2024-03-11'],
        },
        {
          id: 'S317610',
          name: 'Federica',
          surname: 'Romano',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Verona',
          degreeCourse: 'Sociologia',
          passedExams: [
            'Sociologia Generale',
            'Metodologia',
            'Statistica Sociale',
          ],
          passedExamsDate: ['2024-01-15', '2024-02-20', '2024-03-13'],
        },
        {
          id: 'S317611',
          name: 'Matteo',
          surname: 'Colombo',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Trieste',
          degreeCourse: 'Filosofia',
          passedExams: ['Filosofia Antica', 'Logica', 'Estetica'],
          passedExamsDate: ['2024-01-23', '2024-02-13', '2024-03-06'],
        },
        {
          id: 'S317612',
          name: 'Elisa',
          surname: 'Conti',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Perugia',
          degreeCourse: 'Architettura',
          passedExams: ['Storia dell’Arte', 'Disegno Tecnico', 'Fisica'],
          passedExamsDate: ['2024-01-29', '2024-02-26', '2024-03-07'],
        },
        {
          id: 'S317613',
          name: 'Simone',
          surname: 'De Luca',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Lecce',
          degreeCourse: 'Informatica',
          passedExams: [
            'Programmazione',
            'Matematica Discreta',
            'Sistemi Operativi',
          ],
          passedExamsDate: ['2024-01-19', '2024-02-21', '2024-03-18'],
        },
        {
          id: 'S317614',
          name: 'Valentina',
          surname: 'Barbieri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Cagliari',
          degreeCourse: 'Design',
          passedExams: [
            'Disegno Industriale',
            'Teoria del Colore',
            'Storia del Design',
          ],
          passedExamsDate: ['2024-01-14', '2024-02-23', '2024-03-20'],
        },
        {
          id: 'S317615',
          name: 'Andrea',
          surname: 'Mancini',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Modena',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Macroeconomia', 'Statistica'],
          passedExamsDate: ['2024-01-09', '2024-02-05', '2024-03-04'],
        },
        {
          id: 'S317616',
          name: 'Sara',
          surname: 'Moretti',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Parma',
          degreeCourse: 'Biotecnologie',
          passedExams: ['Biologia Molecolare', 'Chimica', 'Bioinformatica'],
          passedExamsDate: ['2024-01-26', '2024-02-16', '2024-03-17'],
        },
        {
          id: 'S317617',
          name: 'Gabriele',
          surname: 'Fontana',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Reggio Emilia',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi I', 'Informatica'],
          passedExamsDate: ['2024-01-13', '2024-02-08', '2024-03-16'],
        },
        {
          id: 'S317618',
          name: 'Ilaria',
          surname: 'Mariani',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Aosta',
          degreeCourse: 'Lingue',
          passedExams: ['Lingua Inglese', 'Linguistica', 'Letteratura'],
          passedExamsDate: ['2024-01-27', '2024-02-10', '2024-03-19'],
        },
        {
          id: 'S317619',
          name: 'Nicola',
          surname: 'Rinaldi',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Trento',
          degreeCourse: 'Statistica',
          passedExams: ['Statistica I', 'Probabilità', 'Economia'],
          passedExamsDate: ['2024-01-17', '2024-02-25', '2024-03-03'],
        },
        {
          id: 'S317620',
          name: 'Laura',
          surname: 'Fabbri',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Rimini',
          degreeCourse: 'Medicina',
          passedExams: ['Anatomia', 'Fisiologia', 'Biologia'],
          passedExamsDate: ['2024-01-21', '2024-02-15', '2024-03-01'],
        },
      ],
    },
    {
      id: 5,
      subject: 'Programmazione',
      date: '2025-20-04',
      endDate: '2025-10-04',
      period: 1,
      where: 'Aula 3',
      modality: 'Scritto',
      booked: 89,
      students: [
        {
          id: 'S317601',
          name: 'Luca',
          surname: 'Bianchi',
          year: '2024',
          exam: 'yes',
          cityOfBirth: 'Milano',
          degreeCourse: 'Informatica',
          passedExams: ['Matematica I', 'Programmazione', 'Fisica I'],
          passedExamsDate: ['2024-01-10', '2024-02-12', '2024-03-05'],
        },
        {
          id: 'S317602',
          name: 'Giulia',
          surname: 'Rossi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Roma',
          degreeCourse: 'Fisica',
          passedExams: ['Fisica I', 'Analisi I', 'Laboratorio'],
          passedExamsDate: ['2024-01-18', '2024-02-20', '2024-03-15'],
        },
        {
          id: 'S317603',
          name: 'Marco',
          surname: 'Verdi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Torino',
          degreeCourse: 'Matematica',
          passedExams: ['Analisi I', 'Algebra', 'Geometria'],
          passedExamsDate: ['2024-01-22', '2024-02-28', '2024-03-10'],
        },
        {
          id: 'S317604',
          name: 'Chiara',
          surname: 'Neri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Napoli',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi', 'Meccanica'],
          passedExamsDate: ['2024-01-30', '2024-02-18', '2024-03-12'],
        },
        {
          id: 'S317605',
          name: 'Davide',
          surname: 'Ferrari',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Firenze',
          degreeCourse: 'Chimica',
          passedExams: ['Chimica Generale', 'Fisica', 'Matematica'],
          passedExamsDate: ['2024-01-16', '2024-02-14', '2024-03-08'],
        },
        {
          id: 'S317606',
          name: 'Francesca',
          surname: 'Gallo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Bologna',
          degreeCourse: 'Biologia',
          passedExams: ['Biologia Cellulare', 'Chimica', 'Genetica'],
          passedExamsDate: ['2024-01-25', '2024-02-22', '2024-03-11'],
        },
        {
          id: 'S317607',
          name: 'Alessandro',
          surname: 'Russo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Genova',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Statistica', 'Matematica'],
          passedExamsDate: ['2024-01-28', '2024-02-19', '2024-03-14'],
        },
        {
          id: 'S317608',
          name: 'Martina',
          surname: 'Greco',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Venezia',
          degreeCourse: 'Giurisprudenza',
          passedExams: [
            'Diritto Privato',
            'Diritto Pubblico',
            'Economia Politica',
          ],
          passedExamsDate: ['2024-01-12', '2024-02-17', '2024-03-09'],
        },
        {
          id: 'S317609',
          name: 'Stefano',
          surname: 'Esposito',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Palermo',
          degreeCourse: 'Psicologia',
          passedExams: ['Psicologia Generale', 'Statistica', 'Psicobiologia'],
          passedExamsDate: ['2024-01-11', '2024-02-11', '2024-03-11'],
        },
        {
          id: 'S317610',
          name: 'Federica',
          surname: 'Romano',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Verona',
          degreeCourse: 'Sociologia',
          passedExams: [
            'Sociologia Generale',
            'Metodologia',
            'Statistica Sociale',
          ],
          passedExamsDate: ['2024-01-15', '2024-02-20', '2024-03-13'],
        },
        {
          id: 'S317611',
          name: 'Matteo',
          surname: 'Colombo',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Trieste',
          degreeCourse: 'Filosofia',
          passedExams: ['Filosofia Antica', 'Logica', 'Estetica'],
          passedExamsDate: ['2024-01-23', '2024-02-13', '2024-03-06'],
        },
        {
          id: 'S317612',
          name: 'Elisa',
          surname: 'Conti',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Perugia',
          degreeCourse: 'Architettura',
          passedExams: ['Storia dell’Arte', 'Disegno Tecnico', 'Fisica'],
          passedExamsDate: ['2024-01-29', '2024-02-26', '2024-03-07'],
        },
        {
          id: 'S317613',
          name: 'Simone',
          surname: 'De Luca',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Lecce',
          degreeCourse: 'Informatica',
          passedExams: [
            'Programmazione',
            'Matematica Discreta',
            'Sistemi Operativi',
          ],
          passedExamsDate: ['2024-01-19', '2024-02-21', '2024-03-18'],
        },
        {
          id: 'S317614',
          name: 'Valentina',
          surname: 'Barbieri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Cagliari',
          degreeCourse: 'Design',
          passedExams: [
            'Disegno Industriale',
            'Teoria del Colore',
            'Storia del Design',
          ],
          passedExamsDate: ['2024-01-14', '2024-02-23', '2024-03-20'],
        },
        {
          id: 'S317615',
          name: 'Andrea',
          surname: 'Mancini',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Modena',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Macroeconomia', 'Statistica'],
          passedExamsDate: ['2024-01-09', '2024-02-05', '2024-03-04'],
        },
        {
          id: 'S317616',
          name: 'Sara',
          surname: 'Moretti',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Parma',
          degreeCourse: 'Biotecnologie',
          passedExams: ['Biologia Molecolare', 'Chimica', 'Bioinformatica'],
          passedExamsDate: ['2024-01-26', '2024-02-16', '2024-03-17'],
        },
        {
          id: 'S317617',
          name: 'Gabriele',
          surname: 'Fontana',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Reggio Emilia',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi I', 'Informatica'],
          passedExamsDate: ['2024-01-13', '2024-02-08', '2024-03-16'],
        },
        {
          id: 'S317618',
          name: 'Ilaria',
          surname: 'Mariani',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Aosta',
          degreeCourse: 'Lingue',
          passedExams: ['Lingua Inglese', 'Linguistica', 'Letteratura'],
          passedExamsDate: ['2024-01-27', '2024-02-10', '2024-03-19'],
        },
        {
          id: 'S317619',
          name: 'Nicola',
          surname: 'Rinaldi',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Trento',
          degreeCourse: 'Statistica',
          passedExams: ['Statistica I', 'Probabilità', 'Economia'],
          passedExamsDate: ['2024-01-17', '2024-02-25', '2024-03-03'],
        },
        {
          id: 'S317620',
          name: 'Laura',
          surname: 'Fabbri',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Rimini',
          degreeCourse: 'Medicina',
          passedExams: ['Anatomia', 'Fisiologia', 'Biologia'],
          passedExamsDate: ['2024-01-21', '2024-02-15', '2024-03-01'],
        },
      ],
    },
    {
      id: 6,
      subject: 'Programmazione',
      date: '2025-20-05',
      endDate: '2025-10-05',
      period: 2,
      where: 'Aula 3',
      modality: 'Scritto',
      booked: 89,
      students: [
        {
          id: 'S317601',
          name: 'Luca',
          surname: 'Bianchi',
          year: '2024',
          exam: 'yes',
          cityOfBirth: 'Milano',
          degreeCourse: 'Informatica',
          passedExams: ['Matematica I', 'Programmazione', 'Fisica I'],
          passedExamsDate: ['2024-01-10', '2024-02-12', '2024-03-05'],
        },
        {
          id: 'S317602',
          name: 'Giulia',
          surname: 'Rossi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Roma',
          degreeCourse: 'Fisica',
          passedExams: ['Fisica I', 'Analisi I', 'Laboratorio'],
          passedExamsDate: ['2024-01-18', '2024-02-20', '2024-03-15'],
        },
        {
          id: 'S317603',
          name: 'Marco',
          surname: 'Verdi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Torino',
          degreeCourse: 'Matematica',
          passedExams: ['Analisi I', 'Algebra', 'Geometria'],
          passedExamsDate: ['2024-01-22', '2024-02-28', '2024-03-10'],
        },
        {
          id: 'S317604',
          name: 'Chiara',
          surname: 'Neri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Napoli',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi', 'Meccanica'],
          passedExamsDate: ['2024-01-30', '2024-02-18', '2024-03-12'],
        },
        {
          id: 'S317605',
          name: 'Davide',
          surname: 'Ferrari',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Firenze',
          degreeCourse: 'Chimica',
          passedExams: ['Chimica Generale', 'Fisica', 'Matematica'],
          passedExamsDate: ['2024-01-16', '2024-02-14', '2024-03-08'],
        },
        {
          id: 'S317606',
          name: 'Francesca',
          surname: 'Gallo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Bologna',
          degreeCourse: 'Biologia',
          passedExams: ['Biologia Cellulare', 'Chimica', 'Genetica'],
          passedExamsDate: ['2024-01-25', '2024-02-22', '2024-03-11'],
        },
        {
          id: 'S317607',
          name: 'Alessandro',
          surname: 'Russo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Genova',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Statistica', 'Matematica'],
          passedExamsDate: ['2024-01-28', '2024-02-19', '2024-03-14'],
        },
        {
          id: 'S317608',
          name: 'Martina',
          surname: 'Greco',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Venezia',
          degreeCourse: 'Giurisprudenza',
          passedExams: [
            'Diritto Privato',
            'Diritto Pubblico',
            'Economia Politica',
          ],
          passedExamsDate: ['2024-01-12', '2024-02-17', '2024-03-09'],
        },
        {
          id: 'S317609',
          name: 'Stefano',
          surname: 'Esposito',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Palermo',
          degreeCourse: 'Psicologia',
          passedExams: ['Psicologia Generale', 'Statistica', 'Psicobiologia'],
          passedExamsDate: ['2024-01-11', '2024-02-11', '2024-03-11'],
        },
        {
          id: 'S317610',
          name: 'Federica',
          surname: 'Romano',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Verona',
          degreeCourse: 'Sociologia',
          passedExams: [
            'Sociologia Generale',
            'Metodologia',
            'Statistica Sociale',
          ],
          passedExamsDate: ['2024-01-15', '2024-02-20', '2024-03-13'],
        },
        {
          id: 'S317611',
          name: 'Matteo',
          surname: 'Colombo',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Trieste',
          degreeCourse: 'Filosofia',
          passedExams: ['Filosofia Antica', 'Logica', 'Estetica'],
          passedExamsDate: ['2024-01-23', '2024-02-13', '2024-03-06'],
        },
        {
          id: 'S317612',
          name: 'Elisa',
          surname: 'Conti',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Perugia',
          degreeCourse: 'Architettura',
          passedExams: ['Storia dell’Arte', 'Disegno Tecnico', 'Fisica'],
          passedExamsDate: ['2024-01-29', '2024-02-26', '2024-03-07'],
        },
        {
          id: 'S317613',
          name: 'Simone',
          surname: 'De Luca',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Lecce',
          degreeCourse: 'Informatica',
          passedExams: [
            'Programmazione',
            'Matematica Discreta',
            'Sistemi Operativi',
          ],
          passedExamsDate: ['2024-01-19', '2024-02-21', '2024-03-18'],
        },
        {
          id: 'S317614',
          name: 'Valentina',
          surname: 'Barbieri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Cagliari',
          degreeCourse: 'Design',
          passedExams: [
            'Disegno Industriale',
            'Teoria del Colore',
            'Storia del Design',
          ],
          passedExamsDate: ['2024-01-14', '2024-02-23', '2024-03-20'],
        },
        {
          id: 'S317615',
          name: 'Andrea',
          surname: 'Mancini',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Modena',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Macroeconomia', 'Statistica'],
          passedExamsDate: ['2024-01-09', '2024-02-05', '2024-03-04'],
        },
        {
          id: 'S317616',
          name: 'Sara',
          surname: 'Moretti',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Parma',
          degreeCourse: 'Biotecnologie',
          passedExams: ['Biologia Molecolare', 'Chimica', 'Bioinformatica'],
          passedExamsDate: ['2024-01-26', '2024-02-16', '2024-03-17'],
        },
        {
          id: 'S317617',
          name: 'Gabriele',
          surname: 'Fontana',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Reggio Emilia',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi I', 'Informatica'],
          passedExamsDate: ['2024-01-13', '2024-02-08', '2024-03-16'],
        },
        {
          id: 'S317618',
          name: 'Ilaria',
          surname: 'Mariani',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Aosta',
          degreeCourse: 'Lingue',
          passedExams: ['Lingua Inglese', 'Linguistica', 'Letteratura'],
          passedExamsDate: ['2024-01-27', '2024-02-10', '2024-03-19'],
        },
        {
          id: 'S317619',
          name: 'Nicola',
          surname: 'Rinaldi',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Trento',
          degreeCourse: 'Statistica',
          passedExams: ['Statistica I', 'Probabilità', 'Economia'],
          passedExamsDate: ['2024-01-17', '2024-02-25', '2024-03-03'],
        },
        {
          id: 'S317620',
          name: 'Laura',
          surname: 'Fabbri',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Rimini',
          degreeCourse: 'Medicina',
          passedExams: ['Anatomia', 'Fisiologia', 'Biologia'],
          passedExamsDate: ['2024-01-21', '2024-02-15', '2024-03-01'],
        },
      ],
    },
    {
      id: 7,
      subject: 'Chimica',
      date: '2025-20-04',
      endDate: '2025-10-04',
      period: 1,
      where: 'Aula 3',
      modality: 'Scritto',
      booked: 89,
      students: [
        {
          id: 'S317601',
          name: 'Luca',
          surname: 'Bianchi',
          year: '2024',
          exam: 'yes',
          cityOfBirth: 'Milano',
          degreeCourse: 'Informatica',
          passedExams: ['Matematica I', 'Programmazione', 'Fisica I'],
          passedExamsDate: ['2024-01-10', '2024-02-12', '2024-03-05'],
        },
        {
          id: 'S317602',
          name: 'Giulia',
          surname: 'Rossi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Roma',
          degreeCourse: 'Fisica',
          passedExams: ['Fisica I', 'Analisi I', 'Laboratorio'],
          passedExamsDate: ['2024-01-18', '2024-02-20', '2024-03-15'],
        },
        {
          id: 'S317603',
          name: 'Marco',
          surname: 'Verdi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Torino',
          degreeCourse: 'Matematica',
          passedExams: ['Analisi I', 'Algebra', 'Geometria'],
          passedExamsDate: ['2024-01-22', '2024-02-28', '2024-03-10'],
        },
        {
          id: 'S317604',
          name: 'Chiara',
          surname: 'Neri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Napoli',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi', 'Meccanica'],
          passedExamsDate: ['2024-01-30', '2024-02-18', '2024-03-12'],
        },
        {
          id: 'S317605',
          name: 'Davide',
          surname: 'Ferrari',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Firenze',
          degreeCourse: 'Chimica',
          passedExams: ['Chimica Generale', 'Fisica', 'Matematica'],
          passedExamsDate: ['2024-01-16', '2024-02-14', '2024-03-08'],
        },
        {
          id: 'S317606',
          name: 'Francesca',
          surname: 'Gallo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Bologna',
          degreeCourse: 'Biologia',
          passedExams: ['Biologia Cellulare', 'Chimica', 'Genetica'],
          passedExamsDate: ['2024-01-25', '2024-02-22', '2024-03-11'],
        },
        {
          id: 'S317607',
          name: 'Alessandro',
          surname: 'Russo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Genova',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Statistica', 'Matematica'],
          passedExamsDate: ['2024-01-28', '2024-02-19', '2024-03-14'],
        },
        {
          id: 'S317608',
          name: 'Martina',
          surname: 'Greco',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Venezia',
          degreeCourse: 'Giurisprudenza',
          passedExams: [
            'Diritto Privato',
            'Diritto Pubblico',
            'Economia Politica',
          ],
          passedExamsDate: ['2024-01-12', '2024-02-17', '2024-03-09'],
        },
        {
          id: 'S317609',
          name: 'Stefano',
          surname: 'Esposito',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Palermo',
          degreeCourse: 'Psicologia',
          passedExams: ['Psicologia Generale', 'Statistica', 'Psicobiologia'],
          passedExamsDate: ['2024-01-11', '2024-02-11', '2024-03-11'],
        },
        {
          id: 'S317610',
          name: 'Federica',
          surname: 'Romano',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Verona',
          degreeCourse: 'Sociologia',
          passedExams: [
            'Sociologia Generale',
            'Metodologia',
            'Statistica Sociale',
          ],
          passedExamsDate: ['2024-01-15', '2024-02-20', '2024-03-13'],
        },
        {
          id: 'S317611',
          name: 'Matteo',
          surname: 'Colombo',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Trieste',
          degreeCourse: 'Filosofia',
          passedExams: ['Filosofia Antica', 'Logica', 'Estetica'],
          passedExamsDate: ['2024-01-23', '2024-02-13', '2024-03-06'],
        },
        {
          id: 'S317612',
          name: 'Elisa',
          surname: 'Conti',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Perugia',
          degreeCourse: 'Architettura',
          passedExams: ['Storia dell’Arte', 'Disegno Tecnico', 'Fisica'],
          passedExamsDate: ['2024-01-29', '2024-02-26', '2024-03-07'],
        },
        {
          id: 'S317613',
          name: 'Simone',
          surname: 'De Luca',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Lecce',
          degreeCourse: 'Informatica',
          passedExams: [
            'Programmazione',
            'Matematica Discreta',
            'Sistemi Operativi',
          ],
          passedExamsDate: ['2024-01-19', '2024-02-21', '2024-03-18'],
        },
        {
          id: 'S317614',
          name: 'Valentina',
          surname: 'Barbieri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Cagliari',
          degreeCourse: 'Design',
          passedExams: [
            'Disegno Industriale',
            'Teoria del Colore',
            'Storia del Design',
          ],
          passedExamsDate: ['2024-01-14', '2024-02-23', '2024-03-20'],
        },
        {
          id: 'S317615',
          name: 'Andrea',
          surname: 'Mancini',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Modena',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Macroeconomia', 'Statistica'],
          passedExamsDate: ['2024-01-09', '2024-02-05', '2024-03-04'],
        },
        {
          id: 'S317616',
          name: 'Sara',
          surname: 'Moretti',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Parma',
          degreeCourse: 'Biotecnologie',
          passedExams: ['Biologia Molecolare', 'Chimica', 'Bioinformatica'],
          passedExamsDate: ['2024-01-26', '2024-02-16', '2024-03-17'],
        },
        {
          id: 'S317617',
          name: 'Gabriele',
          surname: 'Fontana',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Reggio Emilia',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi I', 'Informatica'],
          passedExamsDate: ['2024-01-13', '2024-02-08', '2024-03-16'],
        },
        {
          id: 'S317618',
          name: 'Ilaria',
          surname: 'Mariani',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Aosta',
          degreeCourse: 'Lingue',
          passedExams: ['Lingua Inglese', 'Linguistica', 'Letteratura'],
          passedExamsDate: ['2024-01-27', '2024-02-10', '2024-03-19'],
        },
        {
          id: 'S317619',
          name: 'Nicola',
          surname: 'Rinaldi',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Trento',
          degreeCourse: 'Statistica',
          passedExams: ['Statistica I', 'Probabilità', 'Economia'],
          passedExamsDate: ['2024-01-17', '2024-02-25', '2024-03-03'],
        },
        {
          id: 'S317620',
          name: 'Laura',
          surname: 'Fabbri',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Rimini',
          degreeCourse: 'Medicina',
          passedExams: ['Anatomia', 'Fisiologia', 'Biologia'],
          passedExamsDate: ['2024-01-21', '2024-02-15', '2024-03-01'],
        },
      ],
    },
    {
      id: 8,
      subject: 'Chimica',
      date: '2025-20-05',
      endDate: '2025-10-05',
      period: 2,
      where: 'Aula 3',
      modality: 'Scritto',
      booked: 89,
      students: [
        {
          id: 'S317601',
          name: 'Luca',
          surname: 'Bianchi',
          year: '2024',
          exam: 'yes',
          cityOfBirth: 'Milano',
          degreeCourse: 'Informatica',
          passedExams: ['Matematica I', 'Programmazione', 'Fisica I'],
          passedExamsDate: ['2024-01-10', '2024-02-12', '2024-03-05'],
        },
        {
          id: 'S317602',
          name: 'Giulia',
          surname: 'Rossi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Roma',
          degreeCourse: 'Fisica',
          passedExams: ['Fisica I', 'Analisi I', 'Laboratorio'],
          passedExamsDate: ['2024-01-18', '2024-02-20', '2024-03-15'],
        },
        {
          id: 'S317603',
          name: 'Marco',
          surname: 'Verdi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Torino',
          degreeCourse: 'Matematica',
          passedExams: ['Analisi I', 'Algebra', 'Geometria'],
          passedExamsDate: ['2024-01-22', '2024-02-28', '2024-03-10'],
        },
        {
          id: 'S317604',
          name: 'Chiara',
          surname: 'Neri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Napoli',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi', 'Meccanica'],
          passedExamsDate: ['2024-01-30', '2024-02-18', '2024-03-12'],
        },
        {
          id: 'S317605',
          name: 'Davide',
          surname: 'Ferrari',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Firenze',
          degreeCourse: 'Chimica',
          passedExams: ['Chimica Generale', 'Fisica', 'Matematica'],
          passedExamsDate: ['2024-01-16', '2024-02-14', '2024-03-08'],
        },
        {
          id: 'S317606',
          name: 'Francesca',
          surname: 'Gallo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Bologna',
          degreeCourse: 'Biologia',
          passedExams: ['Biologia Cellulare', 'Chimica', 'Genetica'],
          passedExamsDate: ['2024-01-25', '2024-02-22', '2024-03-11'],
        },
        {
          id: 'S317607',
          name: 'Alessandro',
          surname: 'Russo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Genova',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Statistica', 'Matematica'],
          passedExamsDate: ['2024-01-28', '2024-02-19', '2024-03-14'],
        },
        {
          id: 'S317608',
          name: 'Martina',
          surname: 'Greco',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Venezia',
          degreeCourse: 'Giurisprudenza',
          passedExams: [
            'Diritto Privato',
            'Diritto Pubblico',
            'Economia Politica',
          ],
          passedExamsDate: ['2024-01-12', '2024-02-17', '2024-03-09'],
        },
        {
          id: 'S317609',
          name: 'Stefano',
          surname: 'Esposito',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Palermo',
          degreeCourse: 'Psicologia',
          passedExams: ['Psicologia Generale', 'Statistica', 'Psicobiologia'],
          passedExamsDate: ['2024-01-11', '2024-02-11', '2024-03-11'],
        },
        {
          id: 'S317610',
          name: 'Federica',
          surname: 'Romano',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Verona',
          degreeCourse: 'Sociologia',
          passedExams: [
            'Sociologia Generale',
            'Metodologia',
            'Statistica Sociale',
          ],
          passedExamsDate: ['2024-01-15', '2024-02-20', '2024-03-13'],
        },
        {
          id: 'S317611',
          name: 'Matteo',
          surname: 'Colombo',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Trieste',
          degreeCourse: 'Filosofia',
          passedExams: ['Filosofia Antica', 'Logica', 'Estetica'],
          passedExamsDate: ['2024-01-23', '2024-02-13', '2024-03-06'],
        },
        {
          id: 'S317612',
          name: 'Elisa',
          surname: 'Conti',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Perugia',
          degreeCourse: 'Architettura',
          passedExams: ['Storia dell’Arte', 'Disegno Tecnico', 'Fisica'],
          passedExamsDate: ['2024-01-29', '2024-02-26', '2024-03-07'],
        },
        {
          id: 'S317613',
          name: 'Simone',
          surname: 'De Luca',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Lecce',
          degreeCourse: 'Informatica',
          passedExams: [
            'Programmazione',
            'Matematica Discreta',
            'Sistemi Operativi',
          ],
          passedExamsDate: ['2024-01-19', '2024-02-21', '2024-03-18'],
        },
        {
          id: 'S317614',
          name: 'Valentina',
          surname: 'Barbieri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Cagliari',
          degreeCourse: 'Design',
          passedExams: [
            'Disegno Industriale',
            'Teoria del Colore',
            'Storia del Design',
          ],
          passedExamsDate: ['2024-01-14', '2024-02-23', '2024-03-20'],
        },
        {
          id: 'S317615',
          name: 'Andrea',
          surname: 'Mancini',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Modena',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Macroeconomia', 'Statistica'],
          passedExamsDate: ['2024-01-09', '2024-02-05', '2024-03-04'],
        },
        {
          id: 'S317616',
          name: 'Sara',
          surname: 'Moretti',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Parma',
          degreeCourse: 'Biotecnologie',
          passedExams: ['Biologia Molecolare', 'Chimica', 'Bioinformatica'],
          passedExamsDate: ['2024-01-26', '2024-02-16', '2024-03-17'],
        },
        {
          id: 'S317617',
          name: 'Gabriele',
          surname: 'Fontana',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Reggio Emilia',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi I', 'Informatica'],
          passedExamsDate: ['2024-01-13', '2024-02-08', '2024-03-16'],
        },
        {
          id: 'S317618',
          name: 'Ilaria',
          surname: 'Mariani',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Aosta',
          degreeCourse: 'Lingue',
          passedExams: ['Lingua Inglese', 'Linguistica', 'Letteratura'],
          passedExamsDate: ['2024-01-27', '2024-02-10', '2024-03-19'],
        },
        {
          id: 'S317619',
          name: 'Nicola',
          surname: 'Rinaldi',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Trento',
          degreeCourse: 'Statistica',
          passedExams: ['Statistica I', 'Probabilità', 'Economia'],
          passedExamsDate: ['2024-01-17', '2024-02-25', '2024-03-03'],
        },
        {
          id: 'S317620',
          name: 'Laura',
          surname: 'Fabbri',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Rimini',
          degreeCourse: 'Medicina',
          passedExams: ['Anatomia', 'Fisiologia', 'Biologia'],
          passedExamsDate: ['2024-01-21', '2024-02-15', '2024-03-01'],
        },
      ],
    },
    {
      id: 9,
      subject: 'Informatica Teorica',
      date: '2025-20-04',
      endDate: '2025-10-04',
      period: 1,
      where: 'Aula 3',
      modality: 'Scritto',
      booked: 89,
      students: [
        {
          id: 'S317601',
          name: 'Luca',
          surname: 'Bianchi',
          year: '2024',
          exam: 'yes',
          cityOfBirth: 'Milano',
          degreeCourse: 'Informatica',
          passedExams: ['Matematica I', 'Programmazione', 'Fisica I'],
          passedExamsDate: ['2024-01-10', '2024-02-12', '2024-03-05'],
        },
        {
          id: 'S317602',
          name: 'Giulia',
          surname: 'Rossi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Roma',
          degreeCourse: 'Fisica',
          passedExams: ['Fisica I', 'Analisi I', 'Laboratorio'],
          passedExamsDate: ['2024-01-18', '2024-02-20', '2024-03-15'],
        },
        {
          id: 'S317603',
          name: 'Marco',
          surname: 'Verdi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Torino',
          degreeCourse: 'Matematica',
          passedExams: ['Analisi I', 'Algebra', 'Geometria'],
          passedExamsDate: ['2024-01-22', '2024-02-28', '2024-03-10'],
        },
        {
          id: 'S317604',
          name: 'Chiara',
          surname: 'Neri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Napoli',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi', 'Meccanica'],
          passedExamsDate: ['2024-01-30', '2024-02-18', '2024-03-12'],
        },
        {
          id: 'S317605',
          name: 'Davide',
          surname: 'Ferrari',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Firenze',
          degreeCourse: 'Chimica',
          passedExams: ['Chimica Generale', 'Fisica', 'Matematica'],
          passedExamsDate: ['2024-01-16', '2024-02-14', '2024-03-08'],
        },
        {
          id: 'S317606',
          name: 'Francesca',
          surname: 'Gallo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Bologna',
          degreeCourse: 'Biologia',
          passedExams: ['Biologia Cellulare', 'Chimica', 'Genetica'],
          passedExamsDate: ['2024-01-25', '2024-02-22', '2024-03-11'],
        },
        {
          id: 'S317607',
          name: 'Alessandro',
          surname: 'Russo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Genova',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Statistica', 'Matematica'],
          passedExamsDate: ['2024-01-28', '2024-02-19', '2024-03-14'],
        },
        {
          id: 'S317608',
          name: 'Martina',
          surname: 'Greco',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Venezia',
          degreeCourse: 'Giurisprudenza',
          passedExams: [
            'Diritto Privato',
            'Diritto Pubblico',
            'Economia Politica',
          ],
          passedExamsDate: ['2024-01-12', '2024-02-17', '2024-03-09'],
        },
        {
          id: 'S317609',
          name: 'Stefano',
          surname: 'Esposito',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Palermo',
          degreeCourse: 'Psicologia',
          passedExams: ['Psicologia Generale', 'Statistica', 'Psicobiologia'],
          passedExamsDate: ['2024-01-11', '2024-02-11', '2024-03-11'],
        },
        {
          id: 'S317610',
          name: 'Federica',
          surname: 'Romano',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Verona',
          degreeCourse: 'Sociologia',
          passedExams: [
            'Sociologia Generale',
            'Metodologia',
            'Statistica Sociale',
          ],
          passedExamsDate: ['2024-01-15', '2024-02-20', '2024-03-13'],
        },
        {
          id: 'S317611',
          name: 'Matteo',
          surname: 'Colombo',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Trieste',
          degreeCourse: 'Filosofia',
          passedExams: ['Filosofia Antica', 'Logica', 'Estetica'],
          passedExamsDate: ['2024-01-23', '2024-02-13', '2024-03-06'],
        },
        {
          id: 'S317612',
          name: 'Elisa',
          surname: 'Conti',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Perugia',
          degreeCourse: 'Architettura',
          passedExams: ['Storia dell’Arte', 'Disegno Tecnico', 'Fisica'],
          passedExamsDate: ['2024-01-29', '2024-02-26', '2024-03-07'],
        },
        {
          id: 'S317613',
          name: 'Simone',
          surname: 'De Luca',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Lecce',
          degreeCourse: 'Informatica',
          passedExams: [
            'Programmazione',
            'Matematica Discreta',
            'Sistemi Operativi',
          ],
          passedExamsDate: ['2024-01-19', '2024-02-21', '2024-03-18'],
        },
        {
          id: 'S317614',
          name: 'Valentina',
          surname: 'Barbieri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Cagliari',
          degreeCourse: 'Design',
          passedExams: [
            'Disegno Industriale',
            'Teoria del Colore',
            'Storia del Design',
          ],
          passedExamsDate: ['2024-01-14', '2024-02-23', '2024-03-20'],
        },
        {
          id: 'S317615',
          name: 'Andrea',
          surname: 'Mancini',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Modena',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Macroeconomia', 'Statistica'],
          passedExamsDate: ['2024-01-09', '2024-02-05', '2024-03-04'],
        },
        {
          id: 'S317616',
          name: 'Sara',
          surname: 'Moretti',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Parma',
          degreeCourse: 'Biotecnologie',
          passedExams: ['Biologia Molecolare', 'Chimica', 'Bioinformatica'],
          passedExamsDate: ['2024-01-26', '2024-02-16', '2024-03-17'],
        },
        {
          id: 'S317617',
          name: 'Gabriele',
          surname: 'Fontana',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Reggio Emilia',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi I', 'Informatica'],
          passedExamsDate: ['2024-01-13', '2024-02-08', '2024-03-16'],
        },
        {
          id: 'S317618',
          name: 'Ilaria',
          surname: 'Mariani',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Aosta',
          degreeCourse: 'Lingue',
          passedExams: ['Lingua Inglese', 'Linguistica', 'Letteratura'],
          passedExamsDate: ['2024-01-27', '2024-02-10', '2024-03-19'],
        },
        {
          id: 'S317619',
          name: 'Nicola',
          surname: 'Rinaldi',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Trento',
          degreeCourse: 'Statistica',
          passedExams: ['Statistica I', 'Probabilità', 'Economia'],
          passedExamsDate: ['2024-01-17', '2024-02-25', '2024-03-03'],
        },
        {
          id: 'S317620',
          name: 'Laura',
          surname: 'Fabbri',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Rimini',
          degreeCourse: 'Medicina',
          passedExams: ['Anatomia', 'Fisiologia', 'Biologia'],
          passedExamsDate: ['2024-01-21', '2024-02-15', '2024-03-01'],
        },
      ],
    },
    {
      id: 10,
      subject: 'Informatica Teorica',
      date: '2025-20-05',
      endDate: '2025-10-05',
      period: 2,
      where: 'Aula 3',
      modality: 'Scritto',
      booked: 89,
      students: [
        {
          id: 'S317601',
          name: 'Luca',
          surname: 'Bianchi',
          year: '2024',
          exam: 'yes',
          cityOfBirth: 'Milano',
          degreeCourse: 'Informatica',
          passedExams: ['Matematica I', 'Programmazione', 'Fisica I'],
          passedExamsDate: ['2024-01-10', '2024-02-12', '2024-03-05'],
        },
        {
          id: 'S317602',
          name: 'Giulia',
          surname: 'Rossi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Roma',
          degreeCourse: 'Fisica',
          passedExams: ['Fisica I', 'Analisi I', 'Laboratorio'],
          passedExamsDate: ['2024-01-18', '2024-02-20', '2024-03-15'],
        },
        {
          id: 'S317603',
          name: 'Marco',
          surname: 'Verdi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Torino',
          degreeCourse: 'Matematica',
          passedExams: ['Analisi I', 'Algebra', 'Geometria'],
          passedExamsDate: ['2024-01-22', '2024-02-28', '2024-03-10'],
        },
        {
          id: 'S317604',
          name: 'Chiara',
          surname: 'Neri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Napoli',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi', 'Meccanica'],
          passedExamsDate: ['2024-01-30', '2024-02-18', '2024-03-12'],
        },
        {
          id: 'S317605',
          name: 'Davide',
          surname: 'Ferrari',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Firenze',
          degreeCourse: 'Chimica',
          passedExams: ['Chimica Generale', 'Fisica', 'Matematica'],
          passedExamsDate: ['2024-01-16', '2024-02-14', '2024-03-08'],
        },
        {
          id: 'S317606',
          name: 'Francesca',
          surname: 'Gallo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Bologna',
          degreeCourse: 'Biologia',
          passedExams: ['Biologia Cellulare', 'Chimica', 'Genetica'],
          passedExamsDate: ['2024-01-25', '2024-02-22', '2024-03-11'],
        },
        {
          id: 'S317607',
          name: 'Alessandro',
          surname: 'Russo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Genova',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Statistica', 'Matematica'],
          passedExamsDate: ['2024-01-28', '2024-02-19', '2024-03-14'],
        },
        {
          id: 'S317608',
          name: 'Martina',
          surname: 'Greco',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Venezia',
          degreeCourse: 'Giurisprudenza',
          passedExams: [
            'Diritto Privato',
            'Diritto Pubblico',
            'Economia Politica',
          ],
          passedExamsDate: ['2024-01-12', '2024-02-17', '2024-03-09'],
        },
        {
          id: 'S317609',
          name: 'Stefano',
          surname: 'Esposito',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Palermo',
          degreeCourse: 'Psicologia',
          passedExams: ['Psicologia Generale', 'Statistica', 'Psicobiologia'],
          passedExamsDate: ['2024-01-11', '2024-02-11', '2024-03-11'],
        },
        {
          id: 'S317610',
          name: 'Federica',
          surname: 'Romano',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Verona',
          degreeCourse: 'Sociologia',
          passedExams: [
            'Sociologia Generale',
            'Metodologia',
            'Statistica Sociale',
          ],
          passedExamsDate: ['2024-01-15', '2024-02-20', '2024-03-13'],
        },
        {
          id: 'S317611',
          name: 'Matteo',
          surname: 'Colombo',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Trieste',
          degreeCourse: 'Filosofia',
          passedExams: ['Filosofia Antica', 'Logica', 'Estetica'],
          passedExamsDate: ['2024-01-23', '2024-02-13', '2024-03-06'],
        },
        {
          id: 'S317612',
          name: 'Elisa',
          surname: 'Conti',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Perugia',
          degreeCourse: 'Architettura',
          passedExams: ['Storia dell’Arte', 'Disegno Tecnico', 'Fisica'],
          passedExamsDate: ['2024-01-29', '2024-02-26', '2024-03-07'],
        },
        {
          id: 'S317613',
          name: 'Simone',
          surname: 'De Luca',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Lecce',
          degreeCourse: 'Informatica',
          passedExams: [
            'Programmazione',
            'Matematica Discreta',
            'Sistemi Operativi',
          ],
          passedExamsDate: ['2024-01-19', '2024-02-21', '2024-03-18'],
        },
        {
          id: 'S317614',
          name: 'Valentina',
          surname: 'Barbieri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Cagliari',
          degreeCourse: 'Design',
          passedExams: [
            'Disegno Industriale',
            'Teoria del Colore',
            'Storia del Design',
          ],
          passedExamsDate: ['2024-01-14', '2024-02-23', '2024-03-20'],
        },
        {
          id: 'S317615',
          name: 'Andrea',
          surname: 'Mancini',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Modena',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Macroeconomia', 'Statistica'],
          passedExamsDate: ['2024-01-09', '2024-02-05', '2024-03-04'],
        },
        {
          id: 'S317616',
          name: 'Sara',
          surname: 'Moretti',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Parma',
          degreeCourse: 'Biotecnologie',
          passedExams: ['Biologia Molecolare', 'Chimica', 'Bioinformatica'],
          passedExamsDate: ['2024-01-26', '2024-02-16', '2024-03-17'],
        },
        {
          id: 'S317617',
          name: 'Gabriele',
          surname: 'Fontana',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Reggio Emilia',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi I', 'Informatica'],
          passedExamsDate: ['2024-01-13', '2024-02-08', '2024-03-16'],
        },
        {
          id: 'S317618',
          name: 'Ilaria',
          surname: 'Mariani',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Aosta',
          degreeCourse: 'Lingue',
          passedExams: ['Lingua Inglese', 'Linguistica', 'Letteratura'],
          passedExamsDate: ['2024-01-27', '2024-02-10', '2024-03-19'],
        },
        {
          id: 'S317619',
          name: 'Nicola',
          surname: 'Rinaldi',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Trento',
          degreeCourse: 'Statistica',
          passedExams: ['Statistica I', 'Probabilità', 'Economia'],
          passedExamsDate: ['2024-01-17', '2024-02-25', '2024-03-03'],
        },
        {
          id: 'S317620',
          name: 'Laura',
          surname: 'Fabbri',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Rimini',
          degreeCourse: 'Medicina',
          passedExams: ['Anatomia', 'Fisiologia', 'Biologia'],
          passedExamsDate: ['2024-01-21', '2024-02-15', '2024-03-01'],
        },
      ],
    },
    {
      id: 11,
      subject: 'Intelligenza Artificiale',
      date: '2025-20-04',
      endDate: '2025-10-04',
      period: 1,
      where: 'Aula 3',
      modality: 'Scritto',
      booked: 89,
      students: [
        {
          id: 'S317601',
          name: 'Luca',
          surname: 'Bianchi',
          year: '2024',
          exam: 'yes',
          cityOfBirth: 'Milano',
          degreeCourse: 'Informatica',
          passedExams: ['Matematica I', 'Programmazione', 'Fisica I'],
          passedExamsDate: ['2024-01-10', '2024-02-12', '2024-03-05'],
        },
        {
          id: 'S317602',
          name: 'Giulia',
          surname: 'Rossi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Roma',
          degreeCourse: 'Fisica',
          passedExams: ['Fisica I', 'Analisi I', 'Laboratorio'],
          passedExamsDate: ['2024-01-18', '2024-02-20', '2024-03-15'],
        },
        {
          id: 'S317603',
          name: 'Marco',
          surname: 'Verdi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Torino',
          degreeCourse: 'Matematica',
          passedExams: ['Analisi I', 'Algebra', 'Geometria'],
          passedExamsDate: ['2024-01-22', '2024-02-28', '2024-03-10'],
        },
        {
          id: 'S317604',
          name: 'Chiara',
          surname: 'Neri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Napoli',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi', 'Meccanica'],
          passedExamsDate: ['2024-01-30', '2024-02-18', '2024-03-12'],
        },
        {
          id: 'S317605',
          name: 'Davide',
          surname: 'Ferrari',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Firenze',
          degreeCourse: 'Chimica',
          passedExams: ['Chimica Generale', 'Fisica', 'Matematica'],
          passedExamsDate: ['2024-01-16', '2024-02-14', '2024-03-08'],
        },
        {
          id: 'S317606',
          name: 'Francesca',
          surname: 'Gallo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Bologna',
          degreeCourse: 'Biologia',
          passedExams: ['Biologia Cellulare', 'Chimica', 'Genetica'],
          passedExamsDate: ['2024-01-25', '2024-02-22', '2024-03-11'],
        },
        {
          id: 'S317607',
          name: 'Alessandro',
          surname: 'Russo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Genova',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Statistica', 'Matematica'],
          passedExamsDate: ['2024-01-28', '2024-02-19', '2024-03-14'],
        },
        {
          id: 'S317608',
          name: 'Martina',
          surname: 'Greco',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Venezia',
          degreeCourse: 'Giurisprudenza',
          passedExams: [
            'Diritto Privato',
            'Diritto Pubblico',
            'Economia Politica',
          ],
          passedExamsDate: ['2024-01-12', '2024-02-17', '2024-03-09'],
        },
        {
          id: 'S317609',
          name: 'Stefano',
          surname: 'Esposito',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Palermo',
          degreeCourse: 'Psicologia',
          passedExams: ['Psicologia Generale', 'Statistica', 'Psicobiologia'],
          passedExamsDate: ['2024-01-11', '2024-02-11', '2024-03-11'],
        },
        {
          id: 'S317610',
          name: 'Federica',
          surname: 'Romano',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Verona',
          degreeCourse: 'Sociologia',
          passedExams: [
            'Sociologia Generale',
            'Metodologia',
            'Statistica Sociale',
          ],
          passedExamsDate: ['2024-01-15', '2024-02-20', '2024-03-13'],
        },
        {
          id: 'S317611',
          name: 'Matteo',
          surname: 'Colombo',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Trieste',
          degreeCourse: 'Filosofia',
          passedExams: ['Filosofia Antica', 'Logica', 'Estetica'],
          passedExamsDate: ['2024-01-23', '2024-02-13', '2024-03-06'],
        },
        {
          id: 'S317612',
          name: 'Elisa',
          surname: 'Conti',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Perugia',
          degreeCourse: 'Architettura',
          passedExams: ['Storia dell’Arte', 'Disegno Tecnico', 'Fisica'],
          passedExamsDate: ['2024-01-29', '2024-02-26', '2024-03-07'],
        },
        {
          id: 'S317613',
          name: 'Simone',
          surname: 'De Luca',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Lecce',
          degreeCourse: 'Informatica',
          passedExams: [
            'Programmazione',
            'Matematica Discreta',
            'Sistemi Operativi',
          ],
          passedExamsDate: ['2024-01-19', '2024-02-21', '2024-03-18'],
        },
        {
          id: 'S317614',
          name: 'Valentina',
          surname: 'Barbieri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Cagliari',
          degreeCourse: 'Design',
          passedExams: [
            'Disegno Industriale',
            'Teoria del Colore',
            'Storia del Design',
          ],
          passedExamsDate: ['2024-01-14', '2024-02-23', '2024-03-20'],
        },
        {
          id: 'S317615',
          name: 'Andrea',
          surname: 'Mancini',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Modena',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Macroeconomia', 'Statistica'],
          passedExamsDate: ['2024-01-09', '2024-02-05', '2024-03-04'],
        },
        {
          id: 'S317616',
          name: 'Sara',
          surname: 'Moretti',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Parma',
          degreeCourse: 'Biotecnologie',
          passedExams: ['Biologia Molecolare', 'Chimica', 'Bioinformatica'],
          passedExamsDate: ['2024-01-26', '2024-02-16', '2024-03-17'],
        },
        {
          id: 'S317617',
          name: 'Gabriele',
          surname: 'Fontana',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Reggio Emilia',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi I', 'Informatica'],
          passedExamsDate: ['2024-01-13', '2024-02-08', '2024-03-16'],
        },
        {
          id: 'S317618',
          name: 'Ilaria',
          surname: 'Mariani',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Aosta',
          degreeCourse: 'Lingue',
          passedExams: ['Lingua Inglese', 'Linguistica', 'Letteratura'],
          passedExamsDate: ['2024-01-27', '2024-02-10', '2024-03-19'],
        },
        {
          id: 'S317619',
          name: 'Nicola',
          surname: 'Rinaldi',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Trento',
          degreeCourse: 'Statistica',
          passedExams: ['Statistica I', 'Probabilità', 'Economia'],
          passedExamsDate: ['2024-01-17', '2024-02-25', '2024-03-03'],
        },
        {
          id: 'S317620',
          name: 'Laura',
          surname: 'Fabbri',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Rimini',
          degreeCourse: 'Medicina',
          passedExams: ['Anatomia', 'Fisiologia', 'Biologia'],
          passedExamsDate: ['2024-01-21', '2024-02-15', '2024-03-01'],
        },
      ],
    },
    {
      id: 12,
      subject: 'Intelligenza Artificiale',
      date: '2025-20-05',
      endDate: '2025-10-05',
      period: 2,
      where: 'Aula 3',
      modality: 'Scritto',
      booked: 89,
      students: [
        {
          id: 'S317601',
          name: 'Luca',
          surname: 'Bianchi',
          year: '2024',
          exam: 'yes',
          cityOfBirth: 'Milano',
          degreeCourse: 'Informatica',
          passedExams: ['Matematica I', 'Programmazione', 'Fisica I'],
          passedExamsDate: ['2024-01-10', '2024-02-12', '2024-03-05'],
        },
        {
          id: 'S317602',
          name: 'Giulia',
          surname: 'Rossi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Roma',
          degreeCourse: 'Fisica',
          passedExams: ['Fisica I', 'Analisi I', 'Laboratorio'],
          passedExamsDate: ['2024-01-18', '2024-02-20', '2024-03-15'],
        },
        {
          id: 'S317603',
          name: 'Marco',
          surname: 'Verdi',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Torino',
          degreeCourse: 'Matematica',
          passedExams: ['Analisi I', 'Algebra', 'Geometria'],
          passedExamsDate: ['2024-01-22', '2024-02-28', '2024-03-10'],
        },
        {
          id: 'S317604',
          name: 'Chiara',
          surname: 'Neri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Napoli',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi', 'Meccanica'],
          passedExamsDate: ['2024-01-30', '2024-02-18', '2024-03-12'],
        },
        {
          id: 'S317605',
          name: 'Davide',
          surname: 'Ferrari',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Firenze',
          degreeCourse: 'Chimica',
          passedExams: ['Chimica Generale', 'Fisica', 'Matematica'],
          passedExamsDate: ['2024-01-16', '2024-02-14', '2024-03-08'],
        },
        {
          id: 'S317606',
          name: 'Francesca',
          surname: 'Gallo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Bologna',
          degreeCourse: 'Biologia',
          passedExams: ['Biologia Cellulare', 'Chimica', 'Genetica'],
          passedExamsDate: ['2024-01-25', '2024-02-22', '2024-03-11'],
        },
        {
          id: 'S317607',
          name: 'Alessandro',
          surname: 'Russo',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Genova',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Statistica', 'Matematica'],
          passedExamsDate: ['2024-01-28', '2024-02-19', '2024-03-14'],
        },
        {
          id: 'S317608',
          name: 'Martina',
          surname: 'Greco',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Venezia',
          degreeCourse: 'Giurisprudenza',
          passedExams: [
            'Diritto Privato',
            'Diritto Pubblico',
            'Economia Politica',
          ],
          passedExamsDate: ['2024-01-12', '2024-02-17', '2024-03-09'],
        },
        {
          id: 'S317609',
          name: 'Stefano',
          surname: 'Esposito',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Palermo',
          degreeCourse: 'Psicologia',
          passedExams: ['Psicologia Generale', 'Statistica', 'Psicobiologia'],
          passedExamsDate: ['2024-01-11', '2024-02-11', '2024-03-11'],
        },
        {
          id: 'S317610',
          name: 'Federica',
          surname: 'Romano',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Verona',
          degreeCourse: 'Sociologia',
          passedExams: [
            'Sociologia Generale',
            'Metodologia',
            'Statistica Sociale',
          ],
          passedExamsDate: ['2024-01-15', '2024-02-20', '2024-03-13'],
        },
        {
          id: 'S317611',
          name: 'Matteo',
          surname: 'Colombo',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Trieste',
          degreeCourse: 'Filosofia',
          passedExams: ['Filosofia Antica', 'Logica', 'Estetica'],
          passedExamsDate: ['2024-01-23', '2024-02-13', '2024-03-06'],
        },
        {
          id: 'S317612',
          name: 'Elisa',
          surname: 'Conti',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Perugia',
          degreeCourse: 'Architettura',
          passedExams: ['Storia dell’Arte', 'Disegno Tecnico', 'Fisica'],
          passedExamsDate: ['2024-01-29', '2024-02-26', '2024-03-07'],
        },
        {
          id: 'S317613',
          name: 'Simone',
          surname: 'De Luca',
          year: '2025',
          exam: 'no',
          cityOfBirth: 'Lecce',
          degreeCourse: 'Informatica',
          passedExams: [
            'Programmazione',
            'Matematica Discreta',
            'Sistemi Operativi',
          ],
          passedExamsDate: ['2024-01-19', '2024-02-21', '2024-03-18'],
        },
        {
          id: 'S317614',
          name: 'Valentina',
          surname: 'Barbieri',
          year: '2024',
          exam: 'no',
          cityOfBirth: 'Cagliari',
          degreeCourse: 'Design',
          passedExams: [
            'Disegno Industriale',
            'Teoria del Colore',
            'Storia del Design',
          ],
          passedExamsDate: ['2024-01-14', '2024-02-23', '2024-03-20'],
        },
        {
          id: 'S317615',
          name: 'Andrea',
          surname: 'Mancini',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Modena',
          degreeCourse: 'Economia',
          passedExams: ['Microeconomia', 'Macroeconomia', 'Statistica'],
          passedExamsDate: ['2024-01-09', '2024-02-05', '2024-03-04'],
        },
        {
          id: 'S317616',
          name: 'Sara',
          surname: 'Moretti',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Parma',
          degreeCourse: 'Biotecnologie',
          passedExams: ['Biologia Molecolare', 'Chimica', 'Bioinformatica'],
          passedExamsDate: ['2024-01-26', '2024-02-16', '2024-03-17'],
        },
        {
          id: 'S317617',
          name: 'Gabriele',
          surname: 'Fontana',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Reggio Emilia',
          degreeCourse: 'Ingegneria',
          passedExams: ['Fisica I', 'Analisi I', 'Informatica'],
          passedExamsDate: ['2024-01-13', '2024-02-08', '2024-03-16'],
        },
        {
          id: 'S317618',
          name: 'Ilaria',
          surname: 'Mariani',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Aosta',
          degreeCourse: 'Lingue',
          passedExams: ['Lingua Inglese', 'Linguistica', 'Letteratura'],
          passedExamsDate: ['2024-01-27', '2024-02-10', '2024-03-19'],
        },
        {
          id: 'S317619',
          name: 'Nicola',
          surname: 'Rinaldi',
          year: '2025',
          exam: 'si',
          cityOfBirth: 'Trento',
          degreeCourse: 'Statistica',
          passedExams: ['Statistica I', 'Probabilità', 'Economia'],
          passedExamsDate: ['2024-01-17', '2024-02-25', '2024-03-03'],
        },
        {
          id: 'S317620',
          name: 'Laura',
          surname: 'Fabbri',
          year: '2024',
          exam: 'si',
          cityOfBirth: 'Rimini',
          degreeCourse: 'Medicina',
          passedExams: ['Anatomia', 'Fisiologia', 'Biologia'],
          passedExamsDate: ['2024-01-21', '2024-02-15', '2024-03-01'],
        },
      ],
    },
  ]);

  const addStudentsToExam = (examId: number, newStudents: Student[]) => {
    setFakeExams(prevExams =>
      prevExams.map(exam => {
        if (exam.id !== examId) return exam;

        const existingStudentIds = new Set(
          exam.students.map(student => student.id),
        );
        const uniqueNewStudents = newStudents.filter(
          student => !existingStudentIds.has(student.id),
        );

        return {
          ...exam,
          students: [...exam.students, ...uniqueNewStudents],
        };
      }),
    );

    if (selectedExam && selectedExam.id === examId) {
      const existingStudentIds = new Set(
        selectedExam.students.map(student => student.id),
      );
      const uniqueNewStudents = newStudents.filter(
        student => !existingStudentIds.has(student.id),
      );

      setSelectedExam(prev =>
        prev
          ? { ...prev, students: [...prev.students, ...uniqueNewStudents] }
          : prev,
      );
    }
  };

  const [tbsDocs, setTbsDocs] = useState<TbsDoc[]>([
    {
      id: 1,
      title: 'Contratto di collaborazione 2025',
      tbsDate: '2025-04-15',
      status: 'da firmare',
      uploadedBy: 'Ufficio Personale',
      numberOfSignatures: 1,
    },
    {
      id: 2,
      title: 'Verbale riunione dipartimento DAUIN',
      tbsDate: '2025-03-22',
      status: 'firmato',
      uploadedBy: 'Segreteria Didattica',
      numberOfSignatures: 2,
    },
    {
      id: 3,
      title: 'Dichiarazione attività didattica',
      tbsDate: '2025-02-28',
      status: 'da firmare',
      uploadedBy: 'Ufficio Docenti',
      numberOfSignatures: 2,
    },
    {
      id: 4,
      title: 'Accordo di ricerca con esterni',
      tbsDate: '2025-01-30',
      status: 'firmato',
      uploadedBy: 'Area Ricerca',
      numberOfSignatures: 2,
    },
    {
      id: 5,
      title: 'Relazione finale progetto PRIN',
      tbsDate: '2025-03-01',
      status: 'da firmare',
      uploadedBy: 'Responsabile Scientifico',
      numberOfSignatures: 1,
    },
  ]);

  const updateTbsDocStatus = (docId: number, newStatus: string) => {
    setTbsDocs(prevDocs =>
      prevDocs.map(doc =>
        doc.id === docId ? { ...doc, status: newStatus } : doc,
      ),
    );
  };

  const [services, setServices] = useState<Service[]>([
    {
      id: 'Mail',
      name: 'Mail',
      icon: faEnvelope,
      linkTo: 'Mail',
      favorite: true,
    },
    {
      id: 'People',
      name: 'Persone',
      icon: faIdCard,
      linkTo: 'Persone',
      favorite: true,
    },
    {
      id: 'DigitalSignature',
      name: t('other.digitalSignature'),
      icon: faFileSignature,
      linkTo: 'DigitalSignature',
      favorite: false,
    },
    {
      id: 'Segnalations',
      name: t('other.reportsFault'),
      icon: faComments,
      linkTo: 'IssueReport',
      favorite: false,
    },
    {
      id: 'News',
      name: t('newsScreen.title'),
      icon: faBullhorn,
      linkTo: 'News',
      favorite: false,
    },
    {
      id: 'BookingPlaces',
      name: t('other.bookPlaces'),
      icon: faPersonCirclePlus,
      linkTo: 'Prenotazione',
      favorite: false,
    },
    {
      id: 'Emergency',
      name: t('other.emergencies'),
      icon: faCircleExclamation,
      linkTo: 'Emergency',
      favorite: false,
    },
    {
      id: 'Support',
      name: t('other.support'),
      icon: faVideo,
      linkTo: 'Supporto',
      favorite: false,
    },
  ]);

  const updateServicePref = (serviceId: string, newStatus: boolean) => {
    setServices(prevServs =>
      prevServs.map(serv =>
        serv.id === serviceId ? { ...serv, favorite: newStatus } : serv,
      ),
    );
  };

  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([
    {
      id: 0,
      title: 'Fisica',
      description: 'Meccanica e Termodinamica',
      time: '10:00 - 11:30',
      date: '2025-05-11',
      type: 'lezione',
      location: 'Aula 2',
    },
    {
      id: 1,
      title: 'Fisica',
      description: 'Meccanica e Termodinamica',
      time: '10:00 - 13:00',
      date: '2025-06-05',
      type: 'lezione',
      location: 'Aula 2',
    },
    {
      id: 2,
      title: 'Matematica',
      description: 'Analisi e Algebra',
      time: '08:30 - 10:00',
      date: '2025-06-05',
      type: 'lezione',
      location: 'Aula 2',
    },
    {
      id: 3,
      title: 'Programmazione',
      description: 'Strutture dati',
      time: '11:30 - 13:00',
      date: '2025-06-06',
      type: 'lezione',
      location: 'Aula 2',
    },
    {
      id: 4,
      title: 'Chimica',
      description: 'Composti organici',
      time: '08:30 - 10:00',
      date: '2025-06-07',
      type: 'lezione',
      location: 'Aula 2',
    },
    {
      id: 5,
      title: 'Informatica Teorica',
      description: 'Automi e linguaggi',
      time: '08:30 - 10:00',
      date: '2025-06-08',
      type: 'lezione',
      location: 'Aula 2',
    },
    {
      id: 6,
      title: 'Matematica',
      description: 'Analisi e Algebra',
      time: '10:00 - 11:30',
      date: '2025-06-09',
      type: 'lezione',
      location: 'Aula 2',
    },

    {
      id: 7,
      title: 'Fisica',
      description: 'Meccanica e Termodinamica',
      time: '10:00 - 11:30',
      date: '2025-06-12',
      type: 'lezione',
      location: 'Aula 2',
    },
    {
      id: 8,
      title: 'Matematica',
      description: 'Analisi e Algebra',
      time: '08:30 - 10:00',
      date: '2025-06-12',
      type: 'lezione',
      location: 'Aula 2',
    },
    {
      id: 9,
      title: 'Programmazione',
      description: 'Strutture dati',
      time: '11:30 - 13:00',
      date: '2025-06-14',
      type: 'lezione',
      location: 'Aula 2',
    },
    {
      id: 10,
      title: 'Chimica',
      description: 'Composti organici',
      time: '08:30 - 10:00',
      date: '2025-06-15',
      type: 'lezione',
      location: 'Aula 2',
    },
    {
      id: 11,
      title: 'Informatica Teorica',
      description: 'Automi e linguaggi',
      time: '08:30 - 10:00',
      date: '2025-06-16',
      type: 'lezione',
      location: 'Aula 2',
    },
    {
      id: 12,
      title: 'Matematica',
      description: 'Analisi e Algebra',
      time: '10:00 - 11:30',
      date: '2025-06-16',
      type: 'lezione',
      location: 'Aula 2',
    },

    {
      id: 13,
      title: 'Matematica',
      description: 'Analisi e Algebra',
      time: '08:30 - 10:00',
      date: '2025-06-19',
      type: 'lezione',
      location: 'Aula 2',
    },
    {
      id: 14,
      title: 'Fisica',
      description: 'Meccanica e Termodinamica',
      time: '10:00 - 11:30',
      date: '2025-06-19',
      type: 'lezione',
      location: 'Aula 2',
    },
    {
      id: 15,
      title: 'Programmazione',
      description: 'Strutture dati',
      time: '11:30 - 13:00',
      date: '2025-06-21',
      type: 'lezione',
      location: 'Aula 2',
    },
    {
      id: 16,
      title: 'Chimica',
      description: 'Composti organici',
      time: '08:30 - 10:00',
      date: '2025-06-22',
      type: 'lezione',
      location: 'Aula 2',
    },
    {
      id: 17,
      title: 'Informatica Teorica',
      description: 'Automi e linguaggi',
      time: '08:30 - 10:00',
      date: '2025-06-23',
      type: 'lezione',
      location: 'Aula 2',
    },
    {
      id: 18,
      title: 'Matematica',
      description: 'Analisi e Algebra',
      time: '10:00 - 11:30',
      date: '2025-06-23',
      type: 'lezione',
      location: 'Aula 2',
    },

    {
      id: 19,
      title: 'Matematica',
      description: 'Analisi e Algebra',
      time: '08:30 - 10:00',
      date: '2025-06-26',
      type: 'lezione',
      location: 'Aula 2',
    },
    {
      id: 20,
      title: 'Fisica',
      description: 'Meccanica e Termodinamica',
      time: '10:00 - 11:30',
      date: '2025-06-26',
      type: 'lezione',
      location: 'Aula 2',
    },
    {
      id: 21,
      title: 'Programmazione',
      description: 'Strutture dati',
      time: '11:30 - 13:00',
      date: '2025-06-28',
      type: 'lezione',
      location: 'Aula 2',
    },
    {
      id: 22,
      title: 'Chimica',
      description: 'Composti organici',
      time: '08:30 - 10:00',
      date: '2025-06-29',
      type: 'lezione',
      location: 'Aula 2',
    },
    {
      id: 23,
      title: 'Informatica Teorica',
      description: 'Automi e linguaggi',
      time: '08:30 - 10:00',
      date: '2025-06-30',
      type: 'lezione',
      location: 'Aula 2',
    },
    {
      id: 24,
      title: 'Matematica',
      description: 'Analisi e Algebra',
      time: '10:00 - 11:30',
      date: '2025-06-30',
      type: 'lezione',
      location: 'Aula 2',
    },
  ]);

  const addAgendaItem = (newItem: AgendaItem) => {
    setAgendaItems(prevItems => [...prevItems, newItem]);
  };

  const removeAgendaItem = (itemId: number) => {
    setAgendaItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const [emergencies] = useState<Emergency[]>([
    {
      id: '1',
      name: 'Incendio',
      icon: faHouseFire,
      rules: [
        'Non utilizzare gli ascensori.',
        'Se l’incendio si è sviluppato all’interno del locale dove ci si trova, uscire subito e chiudere la porta.',
        'Se l’incendio si è sviluppato fuori dal locale e le vie di fuga sono impraticabili, chiudere la porta e sigillare le fessure con panni bagnati.',
        'Se il fumo rende difficoltosa la respirazione, filtrare l’aria con un fazzoletto bagnato e sdraiarsi sul pavimento.',
        'Do not use elevators.',
        'If the fire has started in the room you are in, leave immediately and close the door.',
        'If the fire is outside and escape routes are blocked, close the door and seal gaps with wet cloths.',
        'If smoke makes breathing difficult, filter the air with a wet cloth and lie on the floor.',
      ],
    },
    {
      id: '2',
      name: 'Evacuazione',
      icon: faPersonWalkingArrowRight,
      rules: [
        'Segui le vie di fuga indicate dalle segnalazioni luminose.',
        'Non tornare indietro per recuperare oggetti personali.',
        'Mantieni la calma e aiuta chi ha bisogno.',
        'Raggiungi il punto di raccolta designato in modo ordinato.',
        'Follow escape routes indicated by emergency lights.',
        'Do not go back to retrieve personal belongings.',
        'Stay calm and assist those in need.',
        'Reach the designated assembly point in an orderly manner.',
      ],
    },
    {
      id: '3',
      name: 'Terremoto',
      icon: faHouseCrack,
      rules: [
        'Durante la scossa, riparati sotto un tavolo o una struttura solida.',
        'Allontanati da finestre e oggetti che possono cadere.',
        'Non usare ascensori.',
        'Dopo la scossa, esci con calma e segui le indicazioni di evacuazione.',
        'During the shaking, take cover under a table or sturdy structure.',
        'Stay away from windows and objects that may fall.',
        'Do not use elevators.',
        'After the shaking, exit calmly and follow evacuation instructions.',
      ],
    },
    {
      id: '4',
      name: 'Rapina/Aggressione',
      icon: faPeopleRobbery,
      rules: [
        'Non reagire e mantieni la calma.',
        'Osserva attentamente ma discretamente per poter descrivere l’aggressore.',
        'Allontanati in sicurezza appena possibile.',
        'Chiama immediatamente le forze dell’ordine e segnala l’accaduto.',
        'Do not react and stay calm.',
        'Observe carefully but discreetly so you can describe the attacker.',
        'Move away safely as soon as possible.',
        'Immediately call the police and report the incident.',
      ],
    },
    {
      id: '5',
      name: 'Sostanze pericolose',
      icon: faCircleRadiation,
      rules: [
        'Evita il contatto diretto e non inalare vapori o fumi.',
        'Allontanati dall’area interessata e avvisa immediatamente il personale competente.',
        'Chiudi porte e finestre per contenere la dispersione.',
        'Attiva le procedure di emergenza previste dal piano di sicurezza.',
        'Avoid direct contact and do not inhale vapors or fumes.',
        'Move away from the affected area and immediately alert trained personnel.',
        'Close doors and windows to contain the spread.',
        'Activate the emergency procedures as outlined in the safety plan.',
      ],
    },
    {
      id: '6',
      name: 'Infortunio',
      icon: faTruckMedical,
      rules: [
        'Non spostare l’infortunato se non strettamente necessario.',
        'Allerta immediatamente il personale di primo soccorso.',
        'Rassicura l’infortunato e mantieni la calma.',
        'Se necessario, chiama il numero unico di emergenza 112.',
        'Do not move the injured person unless absolutely necessary.',
        'Immediately alert first aid personnel.',
        'Reassure the injured person and stay calm.',
        'If needed, call the emergency number 112.',
      ],
    },
  ]);

  const [fakeProfiles, setFakeProfiles] = useState<Profile[]>([
    {
      id: 1,
      name: 'Luca',
      surname: 'Rossi',
      taxDomicilie: 'Via Milano 5, Torino',
      IBAN: 'IT60X0542811101000000123456',
      phoneNumber: 3491234567,
      mail: 'luca.rossi@polito.it',
      privateMail: 'luca.rossi@gmail.com',
      role: 'Profesore Associato',
      role2: 'Vice direttore dipartimento di automatica e informatica',
      department: 'DAUIN',
      sector: 'INF/01 - Informatica',
      heldCourses: ['Fondamenti di Informatica', 'Programmazione Avanzata'],
      collaboratingCourses: ['Sistemi Operativi', 'Basi di Dati'],
      preferred: false,
      publications: [
        'Architetture efficienti per microservizi cloud-native',
        'Sicurezza nelle piattaforme containerizzate',
        'Ottimizzazione della programmazione concorrente',
      ],
    },
    {
      id: 2,
      name: 'Giulia',
      surname: 'Verdi',
      taxDomicilie: 'Via Nizza 100, Torino',
      IBAN: 'IT75P0300203280000400123456',
      phoneNumber: 3206549871,
      mail: 'giulia.verdi@polito.it',
      privateMail: 'giulia.verdi@yahoo.it',
      role: 'Profesore Associato',
      role2:
        'Vice coordinatore collegio di ingegneria informatica, del cinema e meccatronica',
      role3: 'Componente centro interdipartimentale PEIC',
      department: 'DET',
      sector: 'ING-INF/02 - Campi Elettromagnetici',
      heldCourses: ['Elettronica Digitale', 'Fondamenti di Telecomunicazioni'],
      collaboratingCourses: ['Reti di Telecomunicazioni', 'Antennistica'],
      preferred: false,
      publications: [
        'Progettazione di antenne flessibili per dispositivi wearable',
        'Comunicazioni wireless a bassa potenza',
        'Ottimizzazione dei filtri digitali per il 5G',
      ],
    },
    {
      id: 3,
      name: 'Marco',
      surname: 'Bianchi',
      taxDomicilie: 'Via Po 25, Torino',
      IBAN: 'IT20N0300203280000400456789',
      phoneNumber: 3331122334,
      mail: 'marco.bianchi@polito.it',
      privateMail: 'marco.bianchi@hotmail.com',
      role: 'Profesore Associato',
      department: 'DAD',
      sector: 'ICAR/14 - Composizione Architettonica e Urbana',
      heldCourses: ["Storia dell'Architettura", 'Progettazione Architettonica'],
      collaboratingCourses: ['Restauro', 'Design Urbano'],
      preferred: false,
      publications: [
        'Approcci contemporanei alla progettazione urbana',
        'Riqualificazione architettonica nei centri storici',
        'Uso della realtà aumentata nella progettazione',
      ],
    },
    {
      id: 4,
      name: 'Sara',
      surname: 'Ferrari',
      taxDomicilie: 'Via Accademia Albertina 3, Torino',
      IBAN: 'IT15F0542811101000000987654',
      phoneNumber: 3479988776,
      mail: 'sara.ferrari@polito.it',
      privateMail: 'sara.ferrari@gmail.com',
      role: 'Profesore Associato',
      role2: 'Componente centro interdipartimentale PEIC',
      department: 'DISMA',
      sector: 'MAT/05 - Analisi Matematica',
      heldCourses: ['Analisi Matematica I', 'Statistica'],
      collaboratingCourses: ['Geometria', 'Probabilità'],
      preferred: false,
      publications: [
        'Metodi statistici avanzati per la ricerca ingegneristica',
        'Analisi multivariata dei dati complessi',
        'Modelli matematici per la diffusione virale',
      ],
    },
    {
      id: 5,
      name: 'Alessandro',
      surname: 'Moretti',
      taxDomicilie: 'Via Carlo Alberto 45, Torino',
      IBAN: 'IT40S0306909606100000123456',
      phoneNumber: 3485566778,
      mail: 'alessandro.moretti@polito.it',
      privateMail: 'alessandro.moretti@libero.it',
      role: 'Profesore Associato',
      department: 'DAUIN',
      sector: 'ING-INF/05 - Sistemi di Elaborazione delle Informazioni',
      heldCourses: ['Sistemi Embedded', 'Cybersecurity'],
      collaboratingCourses: ['Programmazione Mobile', 'Tecnologie Web'],
      preferred: false,
      publications: [
        'Cybersecurity nei dispositivi embedded industriali',
        'Autenticazione sicura per IoT',
        "Sistemi resilienti per l'automazione",
      ],
    },
    {
      id: 6,
      name: 'Francesca',
      surname: 'Gallo',
      taxDomicilie: 'Via Duchessa Jolanda 12, Torino',
      IBAN: 'IT11B0306909402100000567890',
      phoneNumber: 3661231231,
      mail: 'francesca.gallo@polito.it',
      privateMail: 'francesca.gallo@yahoo.it',
      role: 'Profesore Associato',
      department: 'DAD',
      sector: 'ICAR/17 - Disegno',
      heldCourses: ['Tecniche di Rappresentazione', 'Disegno Industriale'],
      collaboratingCourses: ['Materiali e Tecnologie', 'Design Sostenibile'],
      preferred: false,
      publications: [
        "L'integrazione della sostenibilità nel design industriale",
        'Strumenti digitali per la rappresentazione tecnica',
        'Design user-centered nei contesti educativi',
      ],
    },
    {
      id: 7,
      name: 'Davide',
      surname: 'Conti',
      taxDomicilie: 'Via Madama Cristina 8, Torino',
      IBAN: 'IT39G0300203280000400234567',
      phoneNumber: 3394455667,
      mail: 'davide.conti@polito.it',
      privateMail: 'davide.conti@outlook.com',
      role: 'Profesore Associato',
      department: 'DET',
      sector: 'ING-INF/07 - Misure Elettriche ed Elettroniche',
      heldCourses: ['Segnali e Sistemi', 'Elettronica di Potenza'],
      collaboratingCourses: ['Misure Elettriche', 'Fondamenti di Automazione'],
      preferred: false,
      publications: [
        'Controllo intelligente di sistemi di potenza',
        'Tecniche di misura in ambienti industriali',
        'Automazione adattiva nei sistemi embedded',
      ],
    },
    {
      id: 8,
      name: 'Martina',
      surname: 'Russo',
      taxDomicilie: 'Via Bava 14, Torino',
      IBAN: 'IT60U0542811101000000678912',
      phoneNumber: 3288887776,
      mail: 'martina.russo@polito.it',
      privateMail: 'martina.russo@gmail.com',
      role: 'Profesore Associato',
      department: 'DISMA',
      sector: 'MAT/08 - Analisi Numerica',
      heldCourses: ['Logica Matematica', 'Calcolo Numerico'],
      collaboratingCourses: ['Ricerca Operativa', 'Algebra Lineare'],
      preferred: false,
      publications: [
        'Algoritmi iterativi per equazioni differenziali',
        'Ottimizzazione numerica in ambito ingegneristico',
        'Simulazioni numeriche per reti neurali',
      ],
    },
    {
      id: 9,
      name: 'Mario',
      surname: 'Rossi',
      taxDomicilie: 'Via Accademia Albertina 1, Torino',
      IBAN: 'IT22Z0306909402100000111122',
      phoneNumber: 3465556677,
      mail: 'stefano.esposito@polito.it',
      privateMail: 'stefano.esposito@hotmail.com',
      role: 'Profesore Associato',
      role2: 'Componente centro interdipartimentale PEIC',
      department: 'DAUIN',
      sector: 'INF/01 - Informatica',
      heldCourses: ['Machine Learning', 'Deep Learning'],
      collaboratingCourses: ['Algoritmi', 'Intelligenza Artificiale'],
      preferred: false,
      publications: [
        "Modelli transformer per l'elaborazione linguistica",
        'Deep learning su dispositivi edge',
        'Explainable AI nei sistemi decisionali',
      ],
    },
    {
      id: 10,
      name: 'Elena',
      surname: 'Marino',
      taxDomicilie: 'Via Boggio 9, Torino',
      IBAN: 'IT85K0306909606100000981234',
      phoneNumber: 3342211334,
      mail: 'elena.marino@polito.it',
      privateMail: 'elena.marino@icloud.com',
      role: 'Profesore Associato',
      department: 'DAD',
      sector: 'ICAR/20 - Tecnica e Pianificazione Urbanistica',
      heldCourses: ['Urbanistica', 'Paesaggio e Ambiente'],
      collaboratingCourses: [
        'Architettura Sostenibile',
        'Tecnologia delle Costruzioni',
      ],
      preferred: false,
      publications: [
        'Pianificazione urbana resiliente al cambiamento climatico',
        "Metodi GIS per l'analisi territoriale",
        'Mobilità sostenibile nelle aree metropolitane',
      ],
    },
  ]);

  const [user, setUser] = useState<User>({
    name: 'Marco Rossi',
    domicilie: 'Corso Mediterraneo 89',
    taxDomicilie: 'Via Accademia Albertina 1, Torino',
    IBAN: 'IT22Z0306909402100000111122',
    phone: '0110907198',
    email: 'marco.rossi@polito.it',
    privateMail: 'marcorossi@gmail.com',
    role2: 'Vice direttore dipartimento di automatica e informatica',
    publications: [
      'Architetture efficienti per microservizi cloud-native',
      'Sicurezza nelle piattaforme containerizzate',
      'Ottimizzazione della programmazione concorrente',
    ],
    sector: 'INF/01 - Informatica',
  });

  const [issues, setIssues] = useState<Issue[]>([
    {
      id: 1,
      title: 'Segnalazione #34549',
      date: '2025-10-04',
      where: 'Aula 1',
      details: 'PC in aula non funzionante',
      status: 'in attesa',
    },
    {
      id: 2,
      title: 'Segnalazione #34550',
      date: '2025-10-05',
      where: 'Aula 2',
      details: 'PC in aula non funzionante',
      status: 'risolta',
    },
    {
      id: 3,
      title: 'Segnalazione #34551',
      where: 'Aula C3',
      date: '2025-10-06',
      details: 'PC in aula non funzionante',
      status: 'respinta',
    },
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    // Tipo 0: Prenotazione aule
    {
      id: 1,
      type: 0,
      title: 'Richiesta aula #34549',
      powerOutput: true,
      capacity: 30,
      date: '2025-10-04',
      where: 'Valentino',
      time: '16:00 - 17:30',
      details: 'Lezione di matematica avanzata',
      status: 'in attesa',
      chairType: 'Indifferente',
    },
    {
      id: 2,
      type: 0,
      title: 'Richiesta aula #34550',
      powerOutput: false,
      capacity: 25,
      date: '2025-10-05',
      where: 'Centrale',
      time: '10:00 - 12:00',
      details: 'Corso introduttivo di informatica',
      status: 'accettata',
      chairType: 'Indifferente',
    },
    {
      id: 3,
      type: 0,
      title: 'Richiesta aula #34551',
      powerOutput: true,
      capacity: 20,
      where: 'Aula C303',
      date: '2025-10-06',
      time: '14:00 - 15:30',
      details: 'Laboratorio di fisica',
      status: 'respinta',
      chairType: 'Indifferente',
    },

    // Tipo 1: Spazi per eventi
    {
      id: 4,
      type: 1,
      title: 'Richiesta spazio #34567',
      powerOutput: true,
      capacity: 100,
      where: 'Aula Magna',
      date: '2025-10-07',
      time: '09:00 - 13:00',
      details: 'Conferenza annuale dipartimentale',
      status: 'accettata',
      chairType: 'Indifferente',
    },
    {
      id: 5,
      type: 1,
      title: 'Richiesta spazio #34569',
      powerOutput: true,
      capacity: 150,
      where: 'Auditorium Cittadella',
      date: '2025-10-08',
      time: '15:00 - 18:00',
      details: 'Evento culturale con ospiti esterni',
      status: 'in attesa',
      chairType: 'Indifferente',
    },
    {
      id: 6,
      type: 1,
      title: 'Richiesta spazio #34569',
      powerOutput: false,
      capacity: 80,
      where: 'Sala Conferenze',
      date: '2025-10-09',
      time: '11:00 - 14:00',
      details: 'Seminario tecnico',
      status: 'respinta',
      chairType: 'Indifferente',
    },

    // Tipo 2: Spazi strutture
    {
      id: 7,
      type: 2,
      title: 'Prenotazione spazio #34589',
      where: 'Sala Riunioni 1',
      date: '2025-10-10',
      time: '11:00 - 12:30',
      details: 'Meeting del team di progetto',
      status: 'accettata',
      chairType: 'Indifferente',
    },
    {
      id: 8,
      type: 2,
      title: 'Prenotazione spazio #34565',
      where: 'Ufficio Direzione',
      date: '2025-10-11',
      time: '10:00 - 11:00',
      details: 'Colloquio riservato',
      status: 'respinta',
      chairType: 'Indifferente',
    },
    {
      id: 9,
      type: 2,
      title: 'Prenotazione spazio #34533',
      where: 'Studio Docente 3B',
      date: '2025-10-12',
      time: '09:30 - 10:30',
      details: 'Incontro con studenti',
      status: 'in attesa',
      chairType: 'Indifferente',
    },
  ]);

  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(
    null,
  );

  const [selectedAgendaItem, setSelectedAgendaItem] =
    useState<AgendaItem | null>(null);

  const [selectedDoc, setSelectedDoc] = useState<TbsDoc | null>(null);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [selectedLecture, setSelectedLecture] = useState<Lesson | null>(null);

  // Funzioni per aggiungere e rimuovere corsi, esami, appelli d'esame
  const addCourse = (course: Course) => {
    setFakeCourses(prevCourses => [...prevCourses, course]);
  };

  const removeCourse = (courseId: number) => {
    setFakeCourses(prevCourses =>
      prevCourses.filter(course => course.id !== courseId),
    );
  };

  const getExamFromId = (idExam: number, exams: Exam[]): Exam | undefined => {
    return exams.find(exam => exam.id === idExam);
  };

  const addManagedCourse = (course: Course) => {
    setManagedCourses(prevCourses => [...prevCourses, course]);
  };

  const addExam = (exam: Exam) => {
    setFakeExams(prevExams => [...prevExams, exam]);
  };

  const removeExam = (examId: number) => {
    setFakeExams(prevExams => prevExams.filter(exam => exam.id !== examId));
  };

  const addLesson = (courseId: number, lesson: Lesson) => {
    setFakeCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? { ...course, lessons: [...(course.lessons || []), lesson] }
          : course,
      ),
    );

    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(prevSelectedCourse =>
        prevSelectedCourse
          ? {
              ...prevSelectedCourse,
              lessons: [...(prevSelectedCourse.lessons || []), lesson],
            }
          : prevSelectedCourse,
      );
    }
  };

  const addStaffToCourse = (courseId: number, newStaff: Staff[]) => {
    setFakeCourses(prevCourses =>
      prevCourses.map(course => {
        if (course.id !== courseId) return course;

        const existingStaffIds = new Set(course.staff.map(member => member.id));
        const uniqueNewStaff = newStaff.filter(
          member => !existingStaffIds.has(member.id),
        );

        return {
          ...course,
          staff: [...course.staff, ...uniqueNewStaff],
        };
      }),
    );

    if (selectedCourse && selectedCourse.id === courseId) {
      const existingStaffIds = new Set(
        selectedCourse.staff.map(member => member.id),
      );
      const uniqueNewStaff = newStaff.filter(
        member => !existingStaffIds.has(member.id),
      );

      setSelectedCourse(prev =>
        prev ? { ...prev, staff: [...prev.staff, ...uniqueNewStaff] } : prev,
      );
    }
  };

  const addStudentsToCourse = (courseId: number, newStudents: Student[]) => {
    setFakeCourses(prevCourses =>
      prevCourses.map(course => {
        if (course.id !== courseId) return course;

        const existingStudentIds = new Set(
          course.students.map(student => student.id),
        );
        const uniqueNewStudents = newStudents.filter(
          student => !existingStudentIds.has(student.id),
        );

        return {
          ...course,
          students: [...course.students, ...uniqueNewStudents],
        };
      }),
    );

    if (selectedCourse && selectedCourse.id === courseId) {
      const existingStudentIds = new Set(
        selectedCourse.students.map(student => student.id),
      );
      const uniqueNewStudents = newStudents.filter(
        student => !existingStudentIds.has(student.id),
      );

      setSelectedCourse(prev =>
        prev
          ? { ...prev, students: [...prev.students, ...uniqueNewStudents] }
          : prev,
      );
    }
  };

  const selectCourseByName = (courseName: string) => {
    const allCourses = [...fakeCourses, ...managedCourses];
    const course = allCourses.find(
      c => c.title.toLowerCase() === courseName.toLowerCase(),
    );
    if (course) {
      setSelectedCourse(course);
    } else {
      console.warn(`Corso con nome "${courseName}" non trovato.`);
    }
  };

  const addNoticeToCourse = (courseId: number, notice: Notice) => {
    setFakeCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? { ...course, notices: [...course.notices, notice] }
          : course,
      ),
    );

    if (!selectedCourse) {
      return;
    }

    setSelectedCourse(prev =>
      prev ? { ...prev, notices: [...prev.notices, notice] } : prev,
    );

    setSelectedNotice(notice); // <-- questa riga è fondamentale
  };

  const deleteNoticeFromCourse = (courseId: number, noticeId: number) => {
    setFakeCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? {
              ...course,
              notices: course.notices.filter(notice => notice.id !== noticeId),
            }
          : course,
      ),
    );

    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(prevSelectedCourse =>
        prevSelectedCourse
          ? {
              ...prevSelectedCourse,
              notices: prevSelectedCourse.notices.filter(
                notice => notice.id !== noticeId,
              ),
            }
          : prevSelectedCourse,
      );
    }
  };

  const removeIssue = (issueId: number) => {
    setIssues(prevIssues => prevIssues.filter(Issue => Issue.id !== issueId));
  };

  const addIssue = (newIssue: Issue) => {
    setIssues(prevIssues => [...prevIssues, newIssue]);
  };

  const removeBooking = (bookingId: number) => {
    setBookings(prevBookings =>
      prevBookings.filter(booking => booking.id !== bookingId),
    );
  };

  const addBooking = (newBooking: Booking) => {
    setBookings(prevBookings => [...prevBookings, newBooking]);
  };

  const addMaterialToCourse = (
    courseId: number,
    directoryId: number,
    file: File,
  ) => {
    setFakeCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? {
              ...course,
              directories: course.directories.map(directory =>
                directory.id === directoryId
                  ? { ...directory, files: [...directory.files, file] }
                  : directory,
              ),
            }
          : course,
      ),
    );

    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(prevSelectedCourse =>
        prevSelectedCourse
          ? {
              ...prevSelectedCourse,
              directories: prevSelectedCourse.directories.map(directory =>
                directory.id === directoryId
                  ? { ...directory, files: [...directory.files, file] }
                  : directory,
              ),
            }
          : prevSelectedCourse,
      );
    }
  };

  const getProfileById = (idProfile: number): Profile | undefined => {
    return fakeProfiles.find(profile => profile.id === idProfile);
  };

  const removeNoticeFromCourse = (courseId: number, noticeId: number) => {
    setFakeCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? {
              ...course,
              notices: course.notices.filter(notice => notice.id !== noticeId),
            }
          : course,
      ),
    );
  };

  const setVisibilityOfNotice = (
    courseId: number,
    noticeId: number,
    visibility: boolean,
  ) => {
    setFakeCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? {
              ...course,
              notices: course.notices.map(notice =>
                notice.id === noticeId
                  ? { ...notice, visible: visibility }
                  : notice,
              ),
            }
          : course,
      ),
    );

    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(prevSelectedCourse =>
        prevSelectedCourse
          ? {
              ...prevSelectedCourse,
              notices: prevSelectedCourse.notices.map(notice =>
                notice.id === noticeId
                  ? { ...notice, visible: visibility }
                  : notice,
              ),
            }
          : prevSelectedCourse,
      );
    }
  };

  const addGroupToCourse = (courseId: number, newGroup: Group) => {
    setFakeCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? { ...course, groups: [...(course.groups || []), newGroup] }
          : course,
      ),
    );

    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(prevSelectedCourse =>
        prevSelectedCourse
          ? {
              ...prevSelectedCourse,
              groups: [...(prevSelectedCourse.groups || []), newGroup],
            }
          : prevSelectedCourse,
      );
    }
  };

  const removeGroupFromCourse = (courseId: number, groupId: number) => {
    setFakeCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? {
              ...course,
              groups: course.groups?.filter(group => group.id !== groupId),
            }
          : course,
      ),
    );

    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(prevSelectedCourse =>
        prevSelectedCourse
          ? {
              ...prevSelectedCourse,
              groups: prevSelectedCourse.groups?.filter(
                group => group.id !== groupId,
              ),
            }
          : prevSelectedCourse,
      );
    }
  };
  const updateGroupInCourse = (
    courseId: number,
    groupId: number,
    updatedGroup: Group,
  ) => {
    setFakeCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? {
              ...course,
              groups: course.groups?.map(group =>
                group.id === groupId ? { ...group, ...updatedGroup } : group,
              ),
            }
          : course,
      ),
    );

    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(prevSelectedCourse =>
        prevSelectedCourse
          ? {
              ...prevSelectedCourse,
              groups: prevSelectedCourse.groups?.map(group =>
                group.id === groupId ? { ...group, ...updatedGroup } : group,
              ),
            }
          : prevSelectedCourse,
      );
    }
  };

  const removeFileFromCourse = (courseId: number, fileId: number) => {
    setFakeCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? {
              ...course,
              directories: course.directories.map(directory => ({
                ...directory,
                files: directory.files.filter(file => file.id !== fileId),
              })),
            }
          : course,
      ),
    );

    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(prevSelectedCourse =>
        prevSelectedCourse
          ? {
              ...prevSelectedCourse,
              directories: prevSelectedCourse.directories.map(directory => ({
                ...directory,
                files: directory.files.filter(file => file.id !== fileId),
              })),
            }
          : prevSelectedCourse,
      );
    }
  };

  const toggleFavoriteProfile = () => {
    if (!selectedProfile) return;

    const updatedProfile = {
      ...selectedProfile,
      preferred: !selectedProfile.preferred,
    };

    // Aggiorna la lista dei profili fake
    setFakeProfiles(prevProfiles =>
      prevProfiles.map(profile =>
        profile.id === updatedProfile.id ? updatedProfile : profile,
      ),
    );

    // Aggiorna anche il selectedProfile
    setSelectedProfile(updatedProfile);
  };
  const removeAssignmentFromCourse = (
    courseId: number,
    assignmentId: number,
  ) => {
    setFakeCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? {
              ...course,
              assignments: course.assignments.filter(
                assignment => assignment.id !== assignmentId,
              ),
            }
          : course,
      ),
    );

    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(prevSelectedCourse =>
        prevSelectedCourse
          ? {
              ...prevSelectedCourse,
              assignments: prevSelectedCourse.assignments.filter(
                assignment => assignment.id !== assignmentId,
              ),
            }
          : prevSelectedCourse,
      );
    }
  };

  const deleteLessonFromCourse = (courseId: number, lessonId: number) => {
    setFakeCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? {
              ...course,
              lessons: course.lessons?.filter(lesson => lesson.id !== lessonId), // Rimuove la lezione dal corso
            }
          : course,
      ),
    );

    setSelectedCourse(prevCourse =>
      prevCourse?.id === courseId
        ? {
            ...prevCourse,
            lessons: prevCourse.lessons?.filter(
              lesson => lesson.id !== lessonId,
            ), // Rimuove la lezione dal corso selezionato
          }
        : prevCourse,
    );
  };

  const updateCourseNotice = (
    courseId: number,
    noticeId: number,
    updatedNotice: {
      title: string;
      content: string;
      startDate: string;
      endDate: string;
    },
  ) => {
    setFakeCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? {
              ...course,
              notices: course.notices?.map(notice =>
                notice.id === noticeId
                  ? {
                      ...notice,
                      title: updatedNotice.title,
                      content: updatedNotice.content,
                      startDate: updatedNotice.startDate,
                      endDate: updatedNotice.endDate,
                    }
                  : notice,
              ),
            }
          : course,
      ),
    );

    // Se stai anche gestendo la selezione del corso in `selectedCourse`, aggiorna quello
    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(prevSelectedCourse =>
        prevSelectedCourse
          ? {
              ...prevSelectedCourse,
              notices: prevSelectedCourse.notices?.map(notice =>
                notice.id === noticeId
                  ? {
                      ...notice,
                      title: updatedNotice.title,
                      content: updatedNotice.content,
                      startDate: updatedNotice.startDate,
                      endDate: updatedNotice.endDate,
                    }
                  : notice,
              ),
            }
          : prevSelectedCourse,
      );
    }
  };

  const updateCourseFile = (
    courseId: number,
    fileId: number,
    updatedFile: File,
    newDirectoryId: number,
  ) => {
    setFakeCourses(prevCourses =>
      prevCourses.map(course => {
        if (course.id !== courseId) return course; // Se non è il corso giusto, restituiscilo invariato

        // Rimuovi il file dalla directory attuale
        let fileToMove: File | null = null;
        const updatedDirectories = course.directories.map(directory => {
          if (directory.files.some(file => file.id === fileId)) {
            fileToMove =
              directory.files.find(file => file.id === fileId) || null;
            return {
              ...directory,
              files: directory.files.filter(file => file.id !== fileId), // Rimuovi file
            };
          }
          return directory;
        });

        // Se non troviamo il file, esci
        if (!fileToMove) return course;

        // Trova la nuova directory e aggiungi il file aggiornato
        const finalDirectories = updatedDirectories.map(directory => {
          if (directory.id === newDirectoryId) {
            return {
              ...directory,
              files: [...directory.files, { ...fileToMove, ...updatedFile }], // Aggiungi file aggiornato
            };
          }
          return directory;
        });

        return { ...course, directories: finalDirectories };
      }),
    );

    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(prevSelectedCourse => {
        if (!prevSelectedCourse) return prevSelectedCourse;

        let fileToMove: File | null = null;
        const updatedDirectories = prevSelectedCourse.directories.map(
          directory => {
            if (directory.files.some(file => file.id === fileId)) {
              fileToMove =
                directory.files.find(file => file.id === fileId) || null;
              return {
                ...directory,
                files: directory.files.filter(file => file.id !== fileId),
              };
            }
            return directory;
          },
        );

        if (!fileToMove) return prevSelectedCourse;

        const finalDirectories = updatedDirectories.map(directory => {
          if (directory.id === newDirectoryId) {
            return {
              ...directory,
              files: [...directory.files, { ...fileToMove, ...updatedFile }],
            };
          }
          return directory;
        });

        return { ...prevSelectedCourse, directories: finalDirectories };
      });
    }
  };

  const updateCourseLecture = (
    courseId: number,
    lectureId: number,
    updatedLecture: Lesson,
  ) => {
    // Aggiorna l'orario della lezione nel contesto globale (fakeCourses)à

    setFakeCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? {
              ...course,
              lessons: course.lessons.map(lecture =>
                lecture.id === lectureId
                  ? { ...lecture, ...updatedLecture }
                  : lecture,
              ),
            }
          : course,
      ),
    );

    // Se il corso selezionato è quello che stiamo aggiornando, aggiorna anche il selectedCourse
    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(prevSelectedCourse =>
        prevSelectedCourse
          ? {
              ...prevSelectedCourse,
              lessons: prevSelectedCourse.lessons.map(lecture =>
                lecture.id === lectureId
                  ? { ...lecture, ...updatedLecture }
                  : lecture,
              ),
            }
          : prevSelectedCourse,
      );
    }
  };

  const removeStaffFromCourse = (courseId: number, staffId: number) => {
    setFakeCourses(prevCourses => {
      const updatedCourses = prevCourses.map(course =>
        course.id === courseId
          ? {
              ...course,
              staff: course.staff.filter(member => member.id !== staffId),
            }
          : course,
      );

      // Aggiorna selectedCourse se è quello attuale
      const updatedSelectedCourse =
        updatedCourses.find(c => c.id === courseId) || null;
      setSelectedCourse(updatedSelectedCourse);

      return updatedCourses;
    });
  };

  const updateStaffAccess = (
    courseId: number,
    staffId: number,
    newAccess: string,
  ) => {
    setFakeCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? {
              ...course,
              staff: course.staff.map(member =>
                member.id === staffId
                  ? { ...member, access: newAccess }
                  : member,
              ),
            }
          : course,
      ),
    );

    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(prevSelectedCourse =>
        prevSelectedCourse
          ? {
              ...prevSelectedCourse,
              staff: prevSelectedCourse.staff.map(member =>
                member.id === staffId
                  ? { ...member, access: newAccess }
                  : member,
              ),
            }
          : prevSelectedCourse,
      );
    }

    if (selectedStaff && selectedStaff.id === staffId) {
      setSelectedStaff(prev => (prev ? { ...prev, access: newAccess } : prev));
    }
  };

  const addDirectoryToCourse = (courseId: number, newDirectory: Directory) => {
    setFakeCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? {
              ...course,
              directories: [...course.directories, newDirectory],
            }
          : course,
      ),
    );

    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(prevSelectedCourse =>
        prevSelectedCourse
          ? {
              ...prevSelectedCourse,
              directories: [...prevSelectedCourse.directories, newDirectory],
            }
          : prevSelectedCourse,
      );
    }
  };

  const removeDirectoryFromCourse = (courseId: number, directoryId: number) => {
    setFakeCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? {
              ...course,
              directories: course.directories.filter(
                dir => dir.id !== directoryId,
              ),
            }
          : course,
      ),
    );

    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(prevSelectedCourse =>
        prevSelectedCourse
          ? {
              ...prevSelectedCourse,
              directories: prevSelectedCourse.directories.filter(
                dir => dir.id !== directoryId,
              ),
            }
          : prevSelectedCourse,
      );
    }
  };

  return (
    <CoursesContext.Provider
      value={{
        fakeCourses,
        managedCourses,
        fakeExams,
        user,
        setUser,
        updateCourseNotice,
        updateCourseLecture,
        selectedCourse,
        selectedNotice,
        selectedFile,
        selectedStaff,
        setSelectedStaff,
        removeAssignmentFromCourse,
        removeFileFromCourse,
        deleteLessonFromCourse,
        selectedLecture,
        deleteNoticeFromCourse,
        setVisibilityOfNotice,
        addCourse,
        removeCourse,
        addManagedCourse,
        addLesson,
        addMaterialToCourse,
        addExam,
        addStaffToCourse,
        updateCourseFile,
        removeExam,
        setSelectedCourse,
        setSelectedNotice,
        setSelectedFile,
        setSelectedLecture,
        addNoticeToCourse,
        removeNoticeFromCourse,
        removeStaffFromCourse,
        updateStaffAccess,
        selectedExam,
        setSelectedExam,
        addDirectoryToCourse,
        removeDirectoryFromCourse,
        addGroupToCourse,
        removeGroupFromCourse,
        updateGroupInCourse,
        fakeProfiles,
        setFakeProfiles,
        selectedProfile,
        setSelectedProfile,
        toggleFavoriteProfile,
        bookings,
        addBooking,
        updateTbsDocStatus,
        tbsDocs,
        selectedBooking,
        setSelectedBooking,
        removeBooking,
        selectedDoc,
        setSelectedDoc,
        emergencies,
        selectedEmergency,
        setSelectedEmergency,
        issues,
        selectedIssue,
        setSelectedIssue,
        addIssue,
        removeIssue,
        updateServicePref,
        services,
        agendaItems,
        addAgendaItem,
        removeAgendaItem,
        selectCourseByName,
        selectedAgendaItem,
        setSelectedAgendaItem,
        getProfileById,
        getExamFromId,
        selectedStudent,
        setSelectedStudent,
        addStudentsToCourse,
        addStudentsToExam,
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error('useCourses must be used within a CoursesProvider');
  }
  return context;
};
