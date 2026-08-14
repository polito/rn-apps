import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Theme } from '@polito/lib/ui';

export const getBadgeStyle = (
  status: string,
  dark: boolean,
  palettes: Theme['palettes'],
) => {
  const darkBgOpacity = 'CC';
  switch (status) {
    case 'in attesa':
      return {
        backgroundColor: dark
          ? palettes.warning[800] + darkBgOpacity
          : '#FFEDD4',
        foregroundColor: dark ? palettes.warning[200] : '#CA3500',
        icon: faSpinner,
      };
    case 'accettata':
      return {
        backgroundColor: dark
          ? palettes.success[800] + darkBgOpacity
          : '#DCFCE7',
        foregroundColor: dark ? palettes.success[200] : '#008236',
        icon: faCircleCheck,
      };
    case 'respinta':
      return {
        backgroundColor: dark
          ? palettes.danger[800] + darkBgOpacity
          : '#FFE4E6',
        foregroundColor: dark ? palettes.danger[200] : '#C70036',
        icon: faCircleXmark,
      };
    default:
      return {
        backgroundColor: dark
          ? palettes.muted[600] + darkBgOpacity
          : palettes.muted[200],
        foregroundColor: dark ? palettes.muted[200] : palettes.muted[600],
        icon: undefined,
      };
  }
};

export const getStatusLabel = (status: string, t: (key: string) => string) => {
  switch (status) {
    case 'in attesa':
      return t('bookingsScreen.status.pending');
    case 'accettata':
      return t('bookingsScreen.status.accepted');
    case 'respinta':
      return t('bookingsScreen.status.rejected');
    default:
      return status;
  }
};

export const getBookingDetailRoute = (type: number): 'RequestDetails' | null => {
  switch (type) {
    case 0:
    case 1:
    case 2:
      return 'RequestDetails';
    default:
      return null;
  }
};

export const formatBookingTitle = (
  title: string,
  t: (key: string) => string,
): string =>
  title
    .replace(/^Richiesta aula/, t('other.request'))
    .replace(/^Richiesta eventi/, t('other.request'))
    .replace(/^Richiesta spazio/, t('other.request'))
    .replace(/^Prenotazione spazio/, t('other.booking'));

export const parseBookingDescription = (
  details: string,
  eventType?: string,
) => {
  if (!details) return '';
  if (eventType && details.startsWith(`${eventType} — `)) {
    return details.slice(eventType.length + 3);
  }
  if (eventType && details === eventType) return '';
  return details;
};
