import { ProvisionalGrade } from '@polito/student-api-client';
import { fireEvent, render, screen } from '@testing-library/react-native';

import App from '~/App';
import { PROVISIONAL_GRADE_CONFIRMABLE } from '~/testing/constants';
import { server } from '~/testing/msw/server';
import { mockConfirmAlert } from '~/testing/utils/mockConfirmAlert';
import { mockRoute } from '~/testing/utils/mockRoute';

import { __seedCredentials } from '../__mocks__/keychain';

describe('Provisional grade flow: acceptance', () => {
  beforeEach(() => {
    __seedCredentials({ username: 's123456', password: 'fake-password' });
    server.use(
      mockRoute('/v2/courses'),
      mockRoute('/exams', { body: { data: [] } }),
      mockRoute('/grades', { body: { data: [] } }),
      mockRoute<ProvisionalGrade[]>('/provisional-grades', {
        body: { data: [PROVISIONAL_GRADE_CONFIRMABLE], states: [] },
      }),
    );
  });

  it('pressing a provisional grade navigates to ProvisionalGradeScreen', async () => {
    await render(<App />);

    await fireEvent.press(
      await screen.findByText('Weighted average of grades'),
    );

    await fireEvent.press(
      await screen.findByText('System and device programming (AA-ZZ)'),
    );

    // Accept CTA is unique to ProvisionalGradeScreen (Confirmed + canBeAccepted).
    expect(
      await screen.findByRole('button', {
        name: 'Request immediate registration',
      }),
    ).toBeOnTheScreen();
  });

  it('accepting a confirmed grade returns to the Grades screen', async () => {
    server.use(
      mockRoute('/provisional-grades/{provisionalGradeId}/accept', {
        method: 'post',
        status: 204,
      }),
    );

    await render(<App />);

    await fireEvent.press(
      await screen.findByText('Weighted average of grades'),
    );

    await fireEvent.press(
      await screen.findByText('System and device programming (AA-ZZ)'),
    );

    await screen.findByRole('button', {
      name: 'Request immediate registration',
    });

    mockConfirmAlert(
      'By requesting immediate registration, the evaluation will be recorded in your transcript and you will no longer be able to change your decision',
    );

    await fireEvent.press(
      screen.getByRole('button', { name: 'Request immediate registration' }),
    );

    expect(await screen.findByText('Provisional')).toBeOnTheScreen();
  });
});

describe('Provisional grade flow: rejection', () => {
  beforeEach(() => {
    __seedCredentials({ username: 's123456', password: 'fake-password' });
    server.use(
      mockRoute('/v2/courses'),
      mockRoute('/exams', { body: { data: [] } }),
      mockRoute('/grades', { body: { data: [] } }),
      // The API client parses both `data` and `states` — omitting `states`
      // causes an uncaught .map() on undefined that silently fails the query.
      mockRoute<ProvisionalGrade[]>('/provisional-grades', {
        body: { data: [PROVISIONAL_GRADE_CONFIRMABLE], states: [] },
      }),
    );
  });

  it('rejecting a confirmed grade returns to the Grades screen', async () => {
    server.use(
      mockRoute('/provisional-grades/{provisionalGradeId}/reject', {
        method: 'post',
        status: 204,
      }),
    );

    await render(<App />);

    await fireEvent.press(
      await screen.findByText('Weighted average of grades'),
    );

    await fireEvent.press(
      await screen.findByText('System and device programming (AA-ZZ)'),
    );

    await screen.findByRole('button', {
      name: 'Request immediate registration',
    });

    mockConfirmAlert(
      'By rejecting this evaluation you will no longer be able to change your decision',
    );

    await fireEvent.press(
      screen.getByRole('button', { name: /Reject the evaluation/ }),
    );

    expect(await screen.findByText('Provisional')).toBeOnTheScreen();
  });
});
