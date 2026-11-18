import { __seedCredentials } from '@polito/lib/testing/mocks/keychain';
import { mockRoute } from '@polito/lib/testing/utils/mockRoute';
import { Exam } from '@polito/student-api-client';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';

import App from '~/App';
import { BOOKED_EXAM } from '~/testing/constants';
import { server } from '~/testing/msw/server';
import { mockConfirmAlert } from '~/testing/utils/mockConfirmAlert';

describe('Exam flow: cancellation', () => {
  beforeEach(() => {
    __seedCredentials({ username: 's123456', password: 'fake-password' });
    server.use(mockRoute<Exam[]>('/exams', { body: { data: [BOOKED_EXAM] } }));
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
    const cancelBooking = mockRoute('/exams/{examId}/booking', {
      method: 'delete',
      status: 204,
      params: { examId: BOOKED_EXAM.id },
    });
    server.use(cancelBooking);

    await render(<App />);

    await fireEvent.press(await screen.findByText(BOOKED_EXAM.courseName));

    await screen.findByText(BOOKED_EXAM.type);

    mockConfirmAlert('This action may not be undoable');

    await fireEvent.press(await screen.findByText('Cancel booking'));

    await waitFor(() =>
      expect(screen.queryByText(BOOKED_EXAM.type)).toBeNull(),
    );
    expect(screen.getByText(BOOKED_EXAM.courseName)).toBeOnTheScreen();
    expect(cancelBooking.isUsed).toBe(true);
  });
});
