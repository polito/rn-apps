import { useTranslation } from 'react-i18next';

import { faEye, faEyeSlash, faFile } from '@fortawesome/free-regular-svg-icons';
import { StatusBadge, useTheme } from '@polito/lib/ui';

import { Notice } from '../../core/contexts/CoursesContext';

export type NoticeStatus = 'expired' | 'visible' | 'draft';

export const getNoticeStatus = (notice: Notice): NoticeStatus => {
  if (notice.endDate && notice.endDate < new Date().toISOString()) {
    return 'expired';
  }
  return notice.visible ? 'visible' : 'draft';
};

export const useNoticeStatusLabel = () => {
  const { t } = useTranslation();
  return (status: NoticeStatus) =>
    ({
      expired: t('other.expired'),
      visible: t('other.visible'),
      draft: t('other.draft'),
    })[status];
};

type Props = {
  notice: Notice;
};

export const NoticeStatusBadge = ({ notice }: Props) => {
  const { dark, palettes } = useTheme();
  const getLabel = useNoticeStatusLabel();
  const status = getNoticeStatus(notice);

  const appearance = {
    expired: {
      icon: faEyeSlash,
      background: dark ? palettes.gray[700] : palettes.gray[200],
      foreground: dark ? palettes.gray[300] : palettes.gray[400],
    },
    visible: {
      icon: faEye,
      background: dark ? palettes.success[900] : palettes.success[50],
      foreground: dark ? palettes.success[200] : palettes.success[800],
    },
    draft: {
      icon: faFile,
      background: dark ? palettes.warning[900] : palettes.warning[50],
      foreground: dark ? palettes.warning[200] : palettes.warning[800],
    },
  }[status];

  return (
    <StatusBadge
      text={getLabel(status)}
      icon={appearance.icon}
      backgroundColor={appearance.background}
      foregroundColor={appearance.foreground}
      iconColor={appearance.foreground}
    />
  );
};
