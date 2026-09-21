import { ProvisionalGrade } from '@polito/student-api-client';
import { fireEvent, render, screen } from '@testing-library/react-native';

import App from '~/App';
import { server } from '~/testing/msw/server';
import { mockRoute } from '~/testing/utils/mockRoute';

import { __seedCredentials } from '../__mocks__/keychain';

describe('Career flow: Teaching, Transcript, Career tab', () => {
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

  it('pressing the Career tab navigates to CareerScreen and shows the career section', async () => {
    await render(<App />);

    await fireEvent.press(
      await screen.findByText('Weighted average of grades'),
    );
    await fireEvent.press(await screen.findByText('Career'));

    expect(await screen.findByText('Your career')).toBeOnTheScreen();
  });

  it('CareerScreen shows the student weighted average from /student/career data', async () => {
    await render(<App />);

    await fireEvent.press(
      await screen.findByText('Weighted average of grades'),
    );
    await fireEvent.press(await screen.findByText('Career'));

    await screen.findByText('Your career');

    expect(screen.getByText('27.5/30')).toBeOnTheScreen();
  });
});
