import { __seedCredentials } from '@polito/lib/testing/mocks/keychain';
import { mockRoute } from '@polito/lib/testing/utils/mockRoute';
import { CourseOverview } from '@polito/student-api-client';
import { fireEvent, render, screen } from '@testing-library/react-native';

import App from '~/App';
import {
  TEST_API_COURSE,
  TEST_COURSE,
  TEST_MANAGED_COURSE,
} from '~/testing/constants';
import { server } from '~/testing/msw/server';

describe('Teaching flow: home sections and the My Courses list', () => {
  beforeEach(() => {
    __seedCredentials({ username: 'd123456', password: 'fake-password' });
  });

  it('boots into the Teaching tab listing assigned and managed courses', async () => {
    // Assigned courses come from the API, managed courses from CoursesContext.
    server.use(
      mockRoute<CourseOverview[]>('/v2/courses', {
        body: { data: [TEST_API_COURSE] },
      }),
    );

    await render(<App />);

    expect(await screen.findByText(TEST_API_COURSE.name)).toBeOnTheScreen();
    expect(screen.getByText(TEST_MANAGED_COURSE.title)).toBeOnTheScreen();
  });

  it('the Exam calls section lists the upcoming exam calls', async () => {
    await render(<App />);

    expect(await screen.findByText('Today')).toBeOnTheScreen();
  });

  it('pressing the My Courses section header opens the full course list', async () => {
    await render(<App />);

    await fireEvent.press(await screen.findByText('My Courses'));

    // CoursesScreen groups the courses by academic year and shows each course code
    expect(
      await screen.findByText(`A.Y. ${TEST_COURSE.academicYear}`),
    ).toBeOnTheScreen();
    expect(screen.getByText(TEST_COURSE.code)).toBeOnTheScreen();
  });
});
