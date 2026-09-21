import {
  EmailBadge,
  NewsItem,
  NewsItemOverview,
} from '@polito/student-api-client';
import { fireEvent, render, screen } from '@testing-library/react-native';

import App from '~/App';
import { TEST_NEWS_ITEM, TEST_NEWS_OVERVIEW } from '~/testing/constants';
import { server } from '~/testing/msw/server';
import { mockRoute } from '~/testing/utils/mockRoute';

import { __seedCredentials } from '../__mocks__/keychain';

describe('News flow: Services, News & Events, NewsItemScreen', () => {
  beforeEach(() => {
    __seedCredentials({ username: 's123456', password: 'fake-password' });
    server.use(
      mockRoute('/v2/courses'),
      mockRoute('/exams', { body: { data: [] } }),
      mockRoute<EmailBadge>('/unreadEmails', {
        body: { data: { unreadEmails: '0' } },
      }),
      mockRoute<NewsItemOverview[]>('/news', {
        body: { data: [TEST_NEWS_OVERVIEW] },
      }),
    );
  });

  it('pressing News & Events navigates to NewsScreen and shows the news title', async () => {
    await render(<App />);

    await fireEvent.press(
      await screen.findByRole('button', { name: /Services, tab/ }),
    );
    await fireEvent.press(await screen.findByText('News & Events'));

    expect(await screen.findByText('Exam session postponed')).toBeOnTheScreen();
  });

  it('pressing a news item navigates to NewsItemScreen and shows the title as a heading', async () => {
    server.use(
      mockRoute<NewsItem>('/news/{newsItemId}', {
        body: { data: TEST_NEWS_ITEM },
      }),
    );

    await render(<App />);

    await fireEvent.press(
      await screen.findByRole('button', { name: /Services, tab/ }),
    );
    await fireEvent.press(await screen.findByText('News & Events'));
    await fireEvent.press(await screen.findByText('Exam session postponed'));

    expect(
      await screen.findByRole('heading', { name: 'Exam session postponed' }),
    ).toBeOnTheScreen();
  });
});
