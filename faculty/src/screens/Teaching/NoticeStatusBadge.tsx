import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { faEye, faEyeSlash, faFile } from '@fortawesome/free-regular-svg-icons';
import { useTheme } from '@polito/lib/ui';

import { StatusBadge } from '../../../../lib/src/ui/components/StatusBadge';
import { Notice } from '../../core/contexts/CoursesContext';

type Props = {
  notice: Notice;
};

export const NoticeStatusBadge = ({ notice }: Props) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState('');
  const { palettes } = useTheme();
  const backgroundColor = useMemo(() => {
    if (notice.endDate && notice.endDate < new Date().toISOString()) {
      setStatus(t('other.expired'));
      return '#E0E6EB';
    } else if (notice.visible) {
      setStatus(t('other.visible'));
      return '#F0FDF4';
    } else {
      setStatus(t('other.draft'));
      return '#FFF7ED';
    }
  }, [notice, t]);

  const foregroundColor = useMemo(() => {
    if (notice.endDate && notice.endDate < new Date().toISOString()) {
      return palettes.gray[400];
    } else if (notice.visible) {
      return palettes.success[800];
    } else {
      return palettes.warning[800];
    }
  }, [notice, palettes]);

  const icon = useMemo(() => {
    if (notice.endDate && notice.endDate < new Date().toISOString()) {
      return faEyeSlash;
    } else if (notice.visible) {
      return faEye;
    } else return faFile;
  }, [notice]);

  return (
    <StatusBadge
      text={status}
      backgroundColor={backgroundColor}
      foregroundColor={foregroundColor}
      icon={icon}
      iconColor={foregroundColor}
    />
  );
};
