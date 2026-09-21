import { ExamGrade, ProvisionalGrade } from '@polito/student-api-client';
import { fireEvent, render, screen } from '@testing-library/react-native';

import App from '~/App';
import { TEST_RECORDED_GRADE } from '~/testing/constants';
import { server } from '~/testing/msw/server';
import { mockRoute } from '~/testing/utils/mockRoute';

import { __seedCredentials } from '../__mocks__/keychain';

describe('Recorded grade detail flow: Teaching, Grades, RecordedGradeScreen', () => {
  beforeEach(() => {
    __seedCredentials({ username: 's123456', password: 'fake-password' });
    server.use(
      mockRoute('/v2/courses'),
      mockRoute('/exams', { body: { data: [] } }),
      mockRoute<ProvisionalGrade[]>('/provisional-grades', {
        body: { data: [], states: [] },
      }),
      mockRoute<ExamGrade[]>('/grades', {
        body: { data: [TEST_RECORDED_GRADE] },
      }),
    );
  });

  it('pressing the transcript card shows the recorded grade in the list', async () => {
    await render(<App />);
    await fireEvent.press(
      await screen.findByText('Weighted average of grades'),
    );

    expect(await screen.findByText('Operating Systems')).toBeOnTheScreen();
  });

  it('pressing a recorded grade navigates to RecordedGradeScreen and shows the staff section', async () => {
    await render(<App />);
    await fireEvent.press(
      await screen.findByText('Weighted average of grades'),
    );

    await fireEvent.press(await screen.findByText('Operating Systems'));

    expect(await screen.findByText('Staff')).toBeOnTheScreen();
  });

  it('pressing a recorded grade shows the grade value on the detail screen', async () => {
    await render(<App />);
    await fireEvent.press(
      await screen.findByText('Weighted average of grades'),
    );

    await fireEvent.press(await screen.findByText('Operating Systems'));

    expect(await screen.findByText('Staff')).toBeOnTheScreen();
    expect(screen.getByText('28')).toBeOnTheScreen();
  });
});
