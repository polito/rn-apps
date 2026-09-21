import { fireEvent, render, screen } from '@testing-library/react-native';

import App from '~/App';
import { TEST_COURSE } from '~/testing/constants';

const openCourse = async () => {
  await render(<App />);

  await fireEvent.press(await screen.findByText(TEST_COURSE.title));

  // The Info tab is the first of the course top tabs and renders the course
  // code in its caption, so it doubles as "the course screen is up".
  return screen.findByText(new RegExp(TEST_COURSE.code));
};

describe('Course flow: opening a course and browsing its tabs', () => {
  it('pressing a course on the Teaching home opens it on the Info tab', async () => {
    expect(await openCourse()).toBeOnTheScreen();
  });

  it('switching to the Notices tab lists the course notices', async () => {
    await openCourse();

    await fireEvent.press(screen.getByText('Notices'));

    // The notices tab lists each notice by its body, not its title.
    expect(
      await screen.findByText(TEST_COURSE.notice.content),
    ).toBeOnTheScreen();
  });

  it('pressing a notice opens it with its visibility setting', async () => {
    await openCourse();

    await fireEvent.press(screen.getByText('Notices'));
    await fireEvent.press(await screen.findByText(TEST_COURSE.notice.content));

    // NoticeScreen is the first screen to render the notice's title.
    expect(await screen.findByText(TEST_COURSE.notice.title)).toBeOnTheScreen();
    expect(screen.getByText('Visibility')).toBeOnTheScreen();
  });
});
