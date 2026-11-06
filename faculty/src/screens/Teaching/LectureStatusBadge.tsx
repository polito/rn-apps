import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { faCircle, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { StatusBadge, useTheme } from '@polito/lib/ui';

import { Lesson } from '../../core/contexts/CoursesContext';

type Props = {
  lecture?: Lesson;
  variant?: 'filled' | 'void';
};

export const LectureStatusBadge = ({ lecture, variant = 'filled' }: Props) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState('');
  const { dark, palettes, spacing } = useTheme();
  const backgroundColor = useMemo(() => {
    switch (lecture?.status) {
      case 'compiled':
        setStatus(t('common.compiled'));
        return dark ? palettes.success[900] : '#F0FDF4';
      case 'to compile':
        setStatus(t('common.toCompile'));
        return dark ? palettes.primary[700] : '#E0F2FE';
      case 'draft':
        setStatus(t('common.draft'));
        return dark ? palettes.warning[900] : '#FFF7ED';
      default:
        return '';
    }
  }, [dark, lecture, palettes, t]);

  const foregroundColor = useMemo(() => {
    switch (lecture?.status) {
      case 'compiled':
        return dark ? palettes.success[200] : palettes.success[800];
      case 'to compile':
        return dark ? palettes.primary[200] : palettes.primary[600];
      case 'draft':
        return dark ? palettes.warning[200] : palettes.warning[800];
      default:
        return '';
    }
  }, [dark, lecture, palettes]);

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
