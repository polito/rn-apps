import { fireEvent, render, screen } from '@testing-library/react-native';

import App from '~/App';
import { TEST_COURSE, TEST_MANAGED_COURSE } from '~/testing/constants';

describe('Teaching flow: home sections and the My Courses list', () => {
  it('boots into the Teaching tab listing assigned and managed courses', async () => {
    await render(<App />);

    expect(await screen.findByText(TEST_COURSE.title)).toBeOnTheScreen();
    expect(screen.getByText(TEST_MANAGED_COURSE.title)).toBeOnTheScreen();
  });

  it('the Exam calls section lists the upcoming exam calls', async () => {
    await render(<App />);

    // The home screen shows the first three exam calls; only the one dated
    // `Oggi` renders the translated "Today" subtitle.
    expect(await screen.findByText('Today')).toBeOnTheScreen();
  });

  it('pressing the My Courses section header opens the full course list', async () => {
    await render(<App />);

    await fireEvent.press(await screen.findByText('My Courses'));

    // CoursesScreen groups the courses by academic year and shows each course
    // code, neither of which the home screen renders.
    expect(
      await screen.findByText(`A.Y. ${TEST_COURSE.academicYear}`),
    ).toBeOnTheScreen();
    expect(screen.getByText(TEST_COURSE.code)).toBeOnTheScreen();
  });
});
