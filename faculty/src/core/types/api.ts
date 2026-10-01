import { Exam as ApiExam } from '@polito/student-api-client';

export interface Exam extends ApiExam {
  isTimeToBeDefined: boolean;
  uniqueShortcode: string;
}
