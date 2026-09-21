import { Exam } from '@polito/student-api-client';
import { fireEvent, render, screen } from '@testing-library/react-native';

import App from '~/App';
import { AVAILABLE_EXAM, WEB_APPS_II_DETAIL } from '~/testing/constants';
import { server } from '~/testing/msw/server';
import { mockRoute } from '~/testing/utils/mockRoute';

import { __seedCredentials } from '../__mocks__/keychain';

describe('Teacher info flow: exam detail', () => {
  beforeEach(() => {
    __seedCredentials({ username: 's123456', password: 'fake-password' });
    server.use(
      mockRoute('/v2/courses'),
      mockRoute<Exam[]>('/exams', { body: { data: [AVAILABLE_EXAM] } }),
    );
  });

  it('shows the teacher name on the ExamScreen', async () => {
    await render(<App />);

    await fireEvent.press(await screen.findByText(AVAILABLE_EXAM.courseName));

    expect(await screen.findByText('Test Teacher')).toBeOnTheScreen();
  });

  it('labels the teacher with the Teacher subtitle', async () => {
    await render(<App />);

    await fireEvent.press(await screen.findByText(AVAILABLE_EXAM.courseName));

    expect(await screen.findByText('Test Teacher')).toBeOnTheScreen();
  });
});

describe('Teacher info flow: course staff', () => {
  beforeEach(() => {
    __seedCredentials({ username: 's123456', password: 'fake-password' });
    server.use(
      mockRoute('/v2/courses'),
      mockRoute('/exams'),
      mockRoute<typeof WEB_APPS_II_DETAIL>('/courses/{courseId}', {
        body: {
          data: {
            ...WEB_APPS_II_DETAIL,
            staff: [{ id: 2893, role: 'Titolare' }] as any,
          },
        },
      }),
      mockRoute('/courses/{courseId}/nextLecture', { body: { data: [] } }),
      mockRoute('/courses/{courseId}/exams', { body: { data: [] } }),
      mockRoute('/courses/{courseId}/editions', { body: { data: [] } }),
      mockRoute('/courses/{courseId}/notices'),
      mockRoute('/courses/{courseId}/files'),
    );
  });

  it('shows the staff member name on the CourseInfoScreen', async () => {
    await render(<App />);

    await fireEvent.press(await screen.findByText(WEB_APPS_II_DETAIL.name));

    expect(await screen.findByText('Test Teacher')).toBeOnTheScreen();
  });
});
