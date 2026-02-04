import { Exam as ApiExam } from '@polito/api-client/models/Exam';

export interface Exam extends ApiExam {
  isTimeToBeDefined: boolean;
  uniqueShortcode: string;
}
