import { TFunction } from 'i18next';
import { DateTime } from 'luxon';

export type Announcement = {
  id: string;
  kind: 'news' | 'communication';
  title: string;
  date: Date;
  contents: string;
};

const daysAgo = (days: number) =>
  DateTime.now().minus({ days }).startOf('day').toJSDate();

export const announcements: Announcement[] = [
  {
    id: 'courses-customization',
    kind: 'news',
    title: 'Personalize your courses!',
    date: daysAgo(0),
    contents:
      'Make your home clearer, organized, and... yours. You can choose colors and icons for each course and recognize them in an instant!',
  },
  {
    id: 'exam-statistics',
    kind: 'news',
    title: 'Brand new UI for exam statistics',
    date: daysAgo(2),
    contents:
      'Check out the newest UI that characterizes the section “Exam Statistics”.',
  },
  {
    id: 'multi-files',
    kind: 'news',
    title: 'Upload multi-files',
    date: daysAgo(30),
    contents: 'From now on, users can download multiple files at once.',
  },
  {
    id: 'maintenance',
    kind: 'communication',
    title: 'Scheduled Maintenance',
    date: daysAgo(1),
    contents:
      'A routine maintenance is scheduled for 08/28. The services may be unavailable for a few hours.',
  },
];

export const news = announcements.filter(a => a.kind === 'news');
export const communications = announcements.filter(
  a => a.kind === 'communication',
);

export const formatAnnouncementDate = (
  date: Date,
  language: string,
  t: TFunction,
) => {
  const day = DateTime.fromJSDate(date).startOf('day');
  const days = Math.round(DateTime.now().startOf('day').diff(day, 'days').days);

  if (days === 0) return t('common.today');
  if (days === 1) return t('common.yesterday');
  if (days > 1 && days < 7) return t('appInfoScreen.daysAgo', { count: days });

  return day.setLocale(language).toFormat('d MMMM yyyy');
};
