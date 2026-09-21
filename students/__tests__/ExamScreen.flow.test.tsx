import { Exam } from '@polito/student-api-client';
import { fireEvent, render, screen } from '@testing-library/react-native';

import App from '~/App';
import { AVAILABLE_EXAM } from '~/testing/constants';
import { server } from '~/testing/msw/server';
import { mockRoute } from '~/testing/utils/mockRoute';

import { __seedCredentials } from '../__mocks__/keychain';

describe('Exam flow: list, detail, and booking', () => {
  beforeEach(() => {
    __seedCredentials({ username: 's123456', password: 'fake-password' });
    server.use(
      mockRoute('/v2/courses'),
      mockRoute<Exam[]>('/exams', { body: { data: [AVAILABLE_EXAM] } }),
    );
  });

  it('shows the exam on the Teaching screen', async () => {
    await render(<App />);

    expect(
      await screen.findByText('System and device programming (AA-ZZ)'),
    ).toBeOnTheScreen();
  });

  it('pressing an exam navigates to ExamScreen with course name and type', async () => {
    await render(<App />);

    await fireEvent.press(await screen.findByText(AVAILABLE_EXAM.courseName));

    expect(
      await screen.findByText('System and device programming (AA-ZZ)'),
    ).toBeOnTheScreen();
    expect(screen.getByText(AVAILABLE_EXAM.type)).toBeOnTheScreen();
  });

  it('booking an available exam resets navigation to the Teaching screen', async () => {
    server.use(
      mockRoute('/exams/{examId}/booking', { method: 'post', status: 204 }),
    );

    await render(<App />);

    await fireEvent.press(await screen.findByText(AVAILABLE_EXAM.courseName));

    await screen.findByText(AVAILABLE_EXAM.type);

    await fireEvent.press(await screen.findByText('Book exam'));

    await screen.findByText(AVAILABLE_EXAM.courseName);
  });
});
