import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { faCircle, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@polito/lib/ui';

import { StatusBadge } from '../../core/components/StatusBadge';
import { Lesson } from '../../core/contexts/CoursesContext';

type Props = {
  lecture?: Lesson;
  variant?: 'filled' | 'void';
};

export const LectureStatusBadge = ({ lecture, variant = 'filled' }: Props) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState('');
  const { palettes, spacing } = useTheme();
  const backgroundColor = useMemo(() => {
    switch (lecture?.status) {
      case 'compiled':
        setStatus(t('common.compiled'));
        return '#F0FDF4';
      case 'to compile':
        setStatus(t('common.toCompile'));
        return '#E0F2FE';
      case 'draft':
        setStatus(t('common.draft'));
        return '#FFF7ED';
      default:
        return '';
    }
  }, [lecture, t]);

  const foregroundColor = useMemo(() => {
    switch (lecture?.status) {
      case 'compiled':
        return palettes.success[800];
      case 'to compile':
        return palettes.primary[600];
      case 'draft':
        return palettes.warning[800];
      default:
        return '';
    }
  }, [lecture, palettes]);

  const icon = useMemo(() => {
    switch (lecture?.status) {
      case 'compiled':
        return faCircleCheck;
      case 'to compile':
        return faCircle;
      case 'draft':
        return faEyeSlash;
    }
  }, [lecture]);

  return (
    <StatusBadge
      text={status}
      variant={variant}
      backgroundColor={backgroundColor}
      foregroundColor={foregroundColor}
      icon={icon}
      iconColor={foregroundColor}
      style={
        (icon === faCircle || icon === faCircleCheck) && variant === 'void'
          ? { paddingRight: spacing[1], paddingLeft: spacing[1] }
          : { paddingRight: spacing[1.5] }
      }
    />
  );
};
