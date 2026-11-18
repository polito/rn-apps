import { __seedCredentials } from '@polito/lib/testing/mocks/keychain';
import { mockRoute } from '@polito/lib/testing/utils/mockRoute';
import { Message } from '@polito/student-api-client';
import { fireEvent, render, screen } from '@testing-library/react-native';

import App from '~/App';
import { TEST_MESSAGE } from '~/testing/constants';
import { server } from '~/testing/msw/server';

describe('Messages flow: Profile, Messages', () => {
  beforeEach(() => {
    __seedCredentials({ username: 's123456', password: 'fake-password' });
  });

  it('navigating to the Profile tab shows the Messages entry', async () => {
    await render(<App />);

    await fireEvent.press(
      await screen.findByRole('button', { name: /Profile, tab/ }),
    );

    expect(await screen.findByText('Messages archive')).toBeOnTheScreen();
  });

  it('pressing Messages navigates to MessagesScreen with empty state', async () => {
    await render(<App />);

    await fireEvent.press(
      await screen.findByRole('button', { name: /Profile, tab/ }),
    );
    await fireEvent.press(await screen.findByText('Messages archive'));

    expect(await screen.findByText('You have no messages')).toBeOnTheScreen();
  });

  it('MessagesScreen lists messages returned by the API', async () => {
    server.use(
      mockRoute<Message[]>('/messages', { body: { data: [TEST_MESSAGE] } }),
    );

    await render(<App />);

    await fireEvent.press(
      await screen.findByRole('button', { name: /Profile, tab/ }),
    );
    await fireEvent.press(await screen.findByText('Messages archive'));

    expect(
      await screen.findByText('Welcome to Politecnico di Torino'),
    ).toBeOnTheScreen();
  });
});
