import { fireEvent, render, screen } from '@testing-library/react-native';

import App from '~/App';
import { TEST_EXAM_CALL } from '~/testing/constants';

const [FIRST_STUDENT, SECOND_STUDENT] = TEST_EXAM_CALL.students;

const openExamCall = async () => {
  await render(<App />);

  // "Today" is the subtitle of the only exam call dated `Oggi`; pressing it
  // opens that call, since the subject alone also names an assigned course.
  await fireEvent.press(await screen.findByText('Today'));

  return screen.findByText('Exam call info');
};

describe('Exam call flow: details and booked students', () => {
  it('pressing an exam call on the Teaching home opens its details', async () => {
    expect(await openExamCall()).toBeOnTheScreen();

    expect(screen.getByText(TEST_EXAM_CALL.where)).toBeOnTheScreen();
    expect(
      screen.getByText(`Number of booked: ${TEST_EXAM_CALL.booked}`),
    ).toBeOnTheScreen();
  });

  it('lists the booked students with their id', async () => {
    await openExamCall();

    expect(await screen.findByText(FIRST_STUDENT.fullName)).toBeOnTheScreen();
    expect(screen.getByText(FIRST_STUDENT.id)).toBeOnTheScreen();
  });

  it('searching by name filters the booked students', async () => {
    await openExamCall();
    await screen.findByText(FIRST_STUDENT.fullName);

    await fireEvent.changeText(
      screen.getByPlaceholderText('Search by Name or ID'),
      SECOND_STUDENT.fullName.split(' ')[0],
    );

    expect(await screen.findByText(SECOND_STUDENT.fullName)).toBeOnTheScreen();
    expect(screen.queryByText(FIRST_STUDENT.fullName)).toBeNull();
  });
});
