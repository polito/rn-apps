import { dateFormatter, formatDate } from '@polito/lib/core';

import { TFunction } from 'i18next';

import { ExamPlace } from '../types/exams';

const formatHHmm = dateFormatter('HH:mm');

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

export const formatExamDay = (date: Date, t: TFunction) =>
  isToday(date) ? t('common.today') : formatDate(date);

export const formatExamTimeRange = (startsAt: Date, endsAt: Date) =>
  `${formatHHmm(startsAt)} - ${formatHHmm(endsAt)}`;

export const formatExamPlaces = (places: ExamPlace[]) =>
  places.map(place => place.name).join(', ');
