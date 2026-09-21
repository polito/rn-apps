import { Exam } from '@polito/student-api-client';
import { fireEvent, render, screen } from '@testing-library/react-native';

import App from '~/App';
import { BOOKED_EXAM } from '~/testing/constants';
import { server } from '~/testing/msw/server';
import { mockConfirmAlert } from '~/testing/utils/mockConfirmAlert';
import { mockRoute } from '~/testing/utils/mockRoute';

import { __seedCredentials } from '../__mocks__/keychain';

describe('Exam flow: cancellation', () => {
  beforeEach(() => {
    __seedCredentials({ username: 's123456', password: 'fake-password' });
    server.use(
      mockRoute('/v2/courses'),
      mockRoute<Exam[]>('/exams', { body: { data: [BOOKED_EXAM] } }),
    );
  });

  it('shows the booked exam on the Teaching screen', async () => {
    await render(<App />);

    expect(
      await screen.findByText('System and device programming (AA-ZZ)'),
    ).toBeOnTheScreen();
  });

  it('pressing a booked exam navigates to ExamScreen with exam type', async () => {
    await render(<App />);

    await fireEvent.press(await screen.findByText(BOOKED_EXAM.courseName));

    expect(await screen.findByText(BOOKED_EXAM.type)).toBeOnTheScreen();
  });

  it('cancelling a booked exam resets navigation to the Teaching screen', async () => {
    server.use(
      mockRoute('/exams/{examId}/booking', { method: 'delete', status: 204 }),
    );

    await render(<App />);

    await fireEvent.press(await screen.findByText(BOOKED_EXAM.courseName));

    await screen.findByText(BOOKED_EXAM.type);

    mockConfirmAlert('This action may not be undoable');

    await fireEvent.press(await screen.findByText('Cancel booking'));

    await screen.findByText(BOOKED_EXAM.courseName);
  });
});
