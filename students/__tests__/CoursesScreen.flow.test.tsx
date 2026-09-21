import { Course } from '@polito/student-api-client';
import { fireEvent, render, screen } from '@testing-library/react-native';

import App from '~/App';
import {
  PROGRAMMING_MODULE_A_DETAIL,
  WEB_APPS_II_DETAIL,
} from '~/testing/constants';
import { server } from '~/testing/msw/server';
import { mockRoute } from '~/testing/utils/mockRoute';

import { __seedCredentials } from '../__mocks__/keychain';

// Module course flow
describe('Module course flow: expand and navigate into a sub-module', () => {
  beforeEach(() => {
    __seedCredentials({ username: 's123456', password: 'fake-password' });
    server.use(
      mockRoute('/exams'),
      mockRoute('/v2/courses'),
      mockRoute<Course>('/courses/{courseId}', {
        body: { data: PROGRAMMING_MODULE_A_DETAIL },
      }),
      mockRoute('/courses/{courseId}/nextLecture', { body: { data: [] } }),
    );
  });

  it('renders course name on the list screen', async () => {
    await render(<App />);

    expect(
      await screen.findByText('Information systems security'),
    ).toBeOnTheScreen();
  });

  it('renders submodules in the expanded list screen', async () => {
    await render(<App />);

    const buttons = await screen.findAllByRole('button', {
      name: /See all/,
    });

    await fireEvent.press(buttons[0]);

    expect(await screen.findByText('Programming Module A')).toBeOnTheScreen();
  });

  it('pressing a module row navigates to its CourseInfoScreen', async () => {
    await render(<App />);

    const buttons = await screen.findAllByRole('button', {
      name: /See all/,
    });

    await fireEvent.press(buttons[0]);

    await fireEvent.press(await screen.findByText('Programming Module A'));

    // CourseInfoScreen shows the module shortcode in its caption.
    expect(
      await screen.findByText(
        new RegExp(PROGRAMMING_MODULE_A_DETAIL.shortcode),
      ),
    ).toBeOnTheScreen();
  });
});

// Tab navigation flow
describe('Tab navigation: Info, Notices, Files', () => {
  beforeEach(() => {
    __seedCredentials({ username: 's123456', password: 'fake-password' });
    server.use(
      mockRoute('/exams'),
      mockRoute('/v2/courses'),
      mockRoute<Course>('/courses/{courseId}', {
        body: { data: WEB_APPS_II_DETAIL },
      }),
      mockRoute('/courses/{courseId}/nextLecture', { body: { data: [] } }),
      mockRoute('/courses/{courseId}/notices'),
      mockRoute('/courses/{courseId}/files'),
    );
  });

  it('Info tab is active by default and shows the course shortcode', async () => {
    await render(<App />);

    await fireEvent.press(await screen.findByText(WEB_APPS_II_DETAIL.name));

    expect(
      await screen.findByText(new RegExp(WEB_APPS_II_DETAIL.shortcode)),
    ).toBeOnTheScreen();
  });

  it('switching to the Notices tab loads notice content from the API', async () => {
    await render(<App />);

    await fireEvent.press(await screen.findByText(WEB_APPS_II_DETAIL.name));
    await screen.findByText(new RegExp(WEB_APPS_II_DETAIL.shortcode));

    await fireEvent.press(screen.getByText('News'));

    // The spec notice content starts with "<p>Dear students,</p>".
    expect(await screen.findByText(/Dear students/i)).toBeOnTheScreen();
  });

  it('switching to the Files tab renders the root directory listing', async () => {
    await render(<App />);

    await fireEvent.press(await screen.findByText(WEB_APPS_II_DETAIL.name));
    await screen.findByText(new RegExp(WEB_APPS_II_DETAIL.shortcode));

    await fireEvent.press(screen.getByText('Files'));

    // The spec files example has one root directory "videolectures" with 7 files.
    expect(await screen.findByText('videolectures')).toBeOnTheScreen();
  });
});
