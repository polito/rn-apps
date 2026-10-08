import { CachesDirectoryPath, writeFile } from 'react-native-fs';

import { isAvailableAsync, shareAsync } from 'expo-sharing';
import { DateTime } from 'luxon';

import { AgendaItem } from '../types/AgendaItem';

const CRLF = '\r\n';

const escapeText = (s: string = '') =>
  s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');

// start/end are Luxon DateTimes in memory (console.log shows them as ISO strings).
// Accept both, just in case.
const toDateTime = (value: DateTime | string) =>
  typeof value === 'string' ? DateTime.fromISO(value) : value;

const formatDate = (dt: DateTime) =>
  dt.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");

// Fold lines longer than 75 chars (RFC 5545). Counts chars, not bytes: good enough.
const fold = (line: string) => {
  const parts: string[] = [];
  let rest = line;
  while (rest.length > 75) {
    parts.push(rest.slice(0, 75));
    rest = ' ' + rest.slice(75);
  }
  parts.push(rest);
  return parts.join(CRLF);
};

// AgendaItem is a union (lecture, exam, booking, deadline): not every type
// has every field, so read the optional ones defensively.
type LooseItem = AgendaItem & {
  end?: DateTime | string;
  place?: { name?: string } | null;
  description?: string;
  uniqueShortcode?: string;
};

const buildDescription = (item: LooseItem) =>
  [item.uniqueShortcode, item.description?.trim()].filter(Boolean).join('\n');

const buildEvent = (item: LooseItem, now: string): string[] => {
  const start = toDateTime(item.start);
  const rawEnd = item.end ? toDateTime(item.end) : undefined;
  // Deadlines may have no end, or end === start: give them one hour
  const end = rawEnd && rawEnd > start ? rawEnd : start.plus({ hours: 1 });

  const location = item.place?.name;
  const description = buildDescription(item);

  return [
    'BEGIN:VEVENT',
    `UID:${item.key}@polito.it`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    `SUMMARY:${escapeText(item.title || item.type)}`,
    ...(location ? [`LOCATION:${escapeText(location)}`] : []),
    ...(description ? [`DESCRIPTION:${escapeText(description)}`] : []),
    `CATEGORIES:${item.type.toUpperCase()}`,
    'END:VEVENT',
  ];
};

export const buildIcs = (items: AgendaItem[]): string => {
  const now = formatDate(DateTime.now());
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PoliTO//Students App//IT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...items.flatMap(item => buildEvent(item as LooseItem, now)),
    'END:VCALENDAR',
  ];
  return lines.map(fold).join(CRLF) + CRLF;
};

export const shareIcs = async (items: AgendaItem[], fileName: string) => {
  const path = `${CachesDirectoryPath}/${fileName}`;
  await writeFile(path, buildIcs(items), 'utf8');
  if (!(await isAvailableAsync())) {
    throw new Error('Sharing is not available on this device');
  }
  await shareAsync(`file://${path}`, {
    mimeType: 'text/calendar',
    UTI: 'com.apple.ical.ics',
    dialogTitle: fileName,
  });
};
