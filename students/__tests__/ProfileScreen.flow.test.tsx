import { NotificationPreferences } from '@polito/student-api-client';
import { fireEvent, render, screen } from '@testing-library/react-native';

import App from '~/App';
import { server } from '~/testing/msw/server';
import { mockRoute } from '~/testing/utils/mockRoute';

import { __seedCredentials } from '../__mocks__/keychain';

describe('Profile screen flow', () => {
  beforeEach(() => {
    __seedCredentials({ username: 's123456', password: 'fake-password' });
    server.use(
      mockRoute('/v2/courses'),
      mockRoute('/exams', { body: { data: [] } }),
    );
  });

  it('navigating to the Profile tab shows the career degree level', async () => {
    await render(<App />);

    await fireEvent.press(
      await screen.findByRole('button', { name: /Profile, tab/ }),
    );

    expect(
      await screen.findByText('Corso di Laurea Magistrale'),
    ).toBeOnTheScreen();
  });

  it('Profile screen has a link to the Notifications settings', async () => {
    await render(<App />);

    await fireEvent.press(
      await screen.findByRole('button', { name: /Profile, tab/ }),
    );

    expect(await screen.findByText('Notifications')).toBeOnTheScreen();
  });
});

describe('Notifications preferences flow', () => {
  beforeEach(() => {
    __seedCredentials({ username: 's123456', password: 'fake-password' });
    server.use(
      mockRoute('/v2/courses'),
      mockRoute('/exams', { body: { data: [] } }),
      mockRoute<Partial<NotificationPreferences>>(
        '/notifications/preferences',
        { body: { data: { tickets: true, bookings: false } } },
      ),
    );
  });

  it('navigating to Notifications shows the preference toggles', async () => {
    await render(<App />);

    await fireEvent.press(
      await screen.findByRole('button', { name: /Profile, tab/ }),
    );

    await fireEvent.press(await screen.findByText('Notifications'));

    expect(await screen.findByText('Tickets')).toBeOnTheScreen();
    expect(screen.getByText('Bookings')).toBeOnTheScreen();
  });

  it('Notifications screen shows the Global section header', async () => {
    await render(<App />);

    await fireEvent.press(
      await screen.findByRole('button', { name: /Profile, tab/ }),
    );

    await fireEvent.press(await screen.findByText('Notifications'));

    expect(await screen.findByText('Global')).toBeOnTheScreen();
  });
});
