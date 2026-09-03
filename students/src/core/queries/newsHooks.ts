import { getHtmlTextContent, pluckData } from '@polito/lib/core';
import { NewsApi, NewsItemOverview } from '@polito/student-api-client';
import { useQuery } from '@tanstack/react-query';

const NEWS_ITEM_QUERY_PREFIX = 'news';
const NEWS_QUERY_KEY = [NEWS_ITEM_QUERY_PREFIX];

const OPERATIONAL_NOTICE_KEYWORDS = [
  'maintenance',
  'outage',
  'downtime',
  'manutenzione',
  'interruzione',
  'disservizio',
  'indisponibilit',
  'intervento programmato',
  'guasto',
  'blackout',
  'malfunzionamento',
];

const isOperationalNotice = (item: NewsItemOverview) => {
  if (item.isEvent) return false;

  const haystack = getHtmlTextContent(
    `${item.title} ${item.shortDescription}`,
  ).toLowerCase();

  return OPERATIONAL_NOTICE_KEYWORDS.some(keyword =>
    haystack.includes(keyword),
  );
};

export const getOperationalNotices = (items: NewsItemOverview[] = []) =>
  [...items]
    .filter(isOperationalNotice)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

const useNewsClient = (): NewsApi => {
  return new NewsApi();
};

export const useGetNews = () => {
  const newsClient = useNewsClient();

  return useQuery({
    queryKey: NEWS_QUERY_KEY,
    queryFn: () => newsClient.getNews().then(pluckData),
  });
};

export const useGetNewsItem = (newsItemId: number) => {
  const newsClient = useNewsClient();

  return useQuery({
    queryKey: [NEWS_ITEM_QUERY_PREFIX, newsItemId],
    queryFn: () => newsClient.getNewsItem({ newsItemId }).then(pluckData),
  });
};
