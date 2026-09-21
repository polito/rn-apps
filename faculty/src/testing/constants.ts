/**
 * `fakeCourses[3]`
 */
export const TEST_COURSE = {
  title: 'Chimica',
  code: 'CHM101',
  /** The only course of its academic year, so the year heading is unique too. */
  academicYear: '2024/2025',
  /** Its single notice. */
  notice: {
    title: 'Avviso',
    content: 'Aggiornamenti sul laboratorio di Chimica disponibili.',
  },
};

/** `managedCourses[0]`*/
export const TEST_MANAGED_COURSE = {
  title: 'Informatica Teorica',
  code: 'INF201',
};

/**
 * `fakeExams[0]`
 */
export const TEST_EXAM_CALL = {
  subject: 'Matematica',
  where: 'Aula 3',
  booked: 89,
  /** The first two of its booked students, both within the initial render. */
  students: [
    { id: 'S317601', fullName: 'Luca Bianchi' },
    { id: 'S317602', fullName: 'Giulia Rossi' },
  ],
};
