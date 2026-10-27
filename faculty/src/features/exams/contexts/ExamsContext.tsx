import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { mockCourseStudents, mockExams } from '../data/mockExams';
import { Exam, ExamStudent } from '../types/exams';

type ExamsContextProps = {
  exams: Exam[];
  getCourseStudents: (courseId: number) => ExamStudent[];
  saveAttendance: (examId: number, absentStudentIds: string[]) => void;
  addBookedStudents: (examId: number, studentIds: string[]) => void;
};

const ExamsContext = createContext<ExamsContextProps | undefined>(undefined);

export const ExamsProvider = ({ children }: PropsWithChildren) => {
  const [exams, setExams] = useState<Exam[]>(mockExams);

  const getCourseStudents = useCallback(
    (courseId: number) => mockCourseStudents[courseId] ?? [],
    [],
  );

  const saveAttendance = useCallback(
    (examId: number, absentStudentIds: string[]) =>
      setExams(prev =>
        prev.map(exam =>
          exam.id === examId ? { ...exam, absentStudentIds } : exam,
        ),
      ),
    [],
  );

  const addBookedStudents = useCallback(
    (examId: number, studentIds: string[]) =>
      setExams(prev =>
        prev.map(exam =>
          exam.id === examId
            ? {
                ...exam,
                bookedStudentIds: [
                  ...exam.bookedStudentIds,
                  ...studentIds.filter(
                    id => !exam.bookedStudentIds.includes(id),
                  ),
                ],
              }
            : exam,
        ),
      ),
    [],
  );

  const value = useMemo(
    () => ({
      exams,
      getCourseStudents,
      saveAttendance,
      addBookedStudents,
    }),
    [exams, getCourseStudents, saveAttendance, addBookedStudents],
  );

  return (
    <ExamsContext.Provider value={value}>{children}</ExamsContext.Provider>
  );
};

export const useExams = () => {
  const context = useContext(ExamsContext);
  if (!context) {
    throw new Error('useExams must be used within an ExamsProvider');
  }
  return context;
};

export const useExam = (examId: number) => {
  const { exams, getCourseStudents } = useExams();
  const exam = exams.find(item => item.id === examId);

  const courseStudents = useMemo(
    () => (exam ? getCourseStudents(exam.courseId) : []),
    [exam, getCourseStudents],
  );

  const bookedStudents = useMemo(
    () =>
      exam
        ? courseStudents.filter(student =>
            exam.bookedStudentIds.includes(student.id),
          )
        : [],
    [courseStudents, exam],
  );

  return { exam, courseStudents, bookedStudents };
};
