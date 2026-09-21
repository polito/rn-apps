import { EmailBadge, Ticket, TicketOverview } from '@polito/student-api-client';
import { fireEvent, render, screen } from '@testing-library/react-native';

import App from '~/App';
import { TEST_TICKET, TEST_TICKET_OVERVIEW } from '~/testing/constants';
import { server } from '~/testing/msw/server';
import { mockRoute } from '~/testing/utils/mockRoute';

import { __seedCredentials } from '../__mocks__/keychain';

describe('Ticket flow: Services, Ticket, TicketsScreen, TicketScreen', () => {
  beforeEach(() => {
    __seedCredentials({ username: 's123456', password: 'fake-password' });

    server.use(
      mockRoute('/v2/courses'),
      mockRoute('/exams', { body: { data: [] } }),
      mockRoute<EmailBadge>('/unreadEmails', {
        body: { data: { unreadEmails: '0' } },
      }),
      mockRoute<TicketOverview[]>('/student/tickets', {
        body: { data: [TEST_TICKET_OVERVIEW] },
      }),
    );
  });

  it('pressing Ticket navigates to TicketsScreen and shows an open ticket', async () => {
    await render(<App />);

    await fireEvent.press(
      await screen.findByRole('button', { name: /Services, tab/ }),
    );
    await fireEvent.press(await screen.findByText('Ticket'));

    expect(await screen.findByText('My tickets')).toBeOnTheScreen();
    expect(await screen.findByText('Library card renewal')).toBeOnTheScreen();
  });

  it('pressing an open ticket navigates to TicketScreen and shows the ticket details', async () => {
    server.use(
      mockRoute<Ticket>('/student/tickets/{ticketId}', {
        body: { data: TEST_TICKET },
      }),
    );

    await render(<App />);

    await fireEvent.press(
      await screen.findByRole('button', { name: /Services, tab/ }),
    );
    await fireEvent.press(await screen.findByText('Ticket'));
    await fireEvent.press(await screen.findByText('Library card renewal'));

    expect(
      await screen.findByRole('button', { name: 'Ticket details' }),
    ).toBeOnTheScreen();
  });
});
