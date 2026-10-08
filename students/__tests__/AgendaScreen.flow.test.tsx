import { __seedCredentials } from '@polito/lib/testing/mocks/keychain';
import { mockRoute } from '@polito/lib/testing/utils/mockRoute';
import { Lecture } from '@polito/student-api-client';
import { fireEvent, render, screen } from '@testing-library/react-native';

import App from '~/App';
import { TEST_LECTURE } from '~/testing/constants';
import { server } from '~/testing/msw/server';

describe('Agenda flow: Agenda tab, weekly lecture loads', () => {
  beforeEach(() => {
    __seedCredentials({ username: 's123456', password: 'fake-password' });
    server.use(
      mockRoute('/bookings', { body: { data: [] } }),
      mockRoute<Lecture[]>('/lectures', { body: { data: [TEST_LECTURE] } }),
      mockRoute('/deadlines', { body: { data: [] } }),
    );
  });

  it('pressing the Agenda tab renders the lecture card for the week', async () => {
    await render(<App />);

    await fireEvent.press(
      await screen.findByRole('button', { name: /Agenda, tab/ }),
    );

    expect(
      await screen.findByText('Human Computer Interaction'),
    ).toBeOnTheScreen();
  });
});
