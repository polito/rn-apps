import { ExamGrade, ProvisionalGrade } from '@polito/student-api-client';
import { fireEvent, render, screen } from '@testing-library/react-native';

import App from '~/App';
import { server } from '~/testing/msw/server';
import { mockRoute } from '~/testing/utils/mockRoute';

import { __seedCredentials } from '../__mocks__/keychain';

describe('Transcript flow: Teaching, Grades', () => {
  beforeEach(() => {
    __seedCredentials({ username: 's123456', password: 'fake-password' });
    server.use(
      mockRoute('/v2/courses'),
      mockRoute('/exams', { body: { data: [] } }),
      mockRoute('/grades', { body: { data: [] } }),
      mockRoute<ProvisionalGrade[]>('/provisional-grades', {
        body: { data: [], states: [] },
      }),
    );
  });

  it('pressing the transcript card navigates to the Grades screen', async () => {
    await render(<App />);

    await fireEvent.press(
      await screen.findByText('Weighted average of grades'),
    );

    expect(await screen.findByText('Provisional')).toBeOnTheScreen();
    expect(screen.getByText('Recorded')).toBeOnTheScreen();
  });

  it('shows empty states when no grades are recorded', async () => {
    await render(<App />);

    await fireEvent.press(
      await screen.findByText('Weighted average of grades'),
    );

    expect(
      await screen.findByText("You haven't taken any exams"),
    ).toBeOnTheScreen();
    expect(
      screen.getByText('There are no provisional grades'),
    ).toBeOnTheScreen();
  });

  it('shows a recorded grade returned by the API', async () => {
    server.use(
      mockRoute<Array<Partial<ExamGrade>>>('/grades', {
        body: {
          data: [
            {
              courseName: 'Operating Systems',
              date: new Date('2025-06-15'),
              credits: 10,
              grade: '28',
            },
          ],
        },
      }),
    );

    await render(<App />);

    await fireEvent.press(
      await screen.findByText('Weighted average of grades'),
    );

    expect(await screen.findByText('Operating Systems')).toBeOnTheScreen();
  });
});
