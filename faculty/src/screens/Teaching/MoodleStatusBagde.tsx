import { useTranslation } from 'react-i18next';

import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { StatusBadge } from '@polito/lib/ui';
import { useTheme } from '@polito/lib/ui';

export const MoodleStatusBadge = () => {
  const { t } = useTranslation();
  const { palettes } = useTheme();

  return (
    <StatusBadge
      isAction
      text={t('common.moodle')}
      icon={faGraduationCap}
      backgroundColor={palettes.secondary[50]}
      foregroundColor={palettes.secondary[800]}
      borderColor={palettes.secondary[200]}
      iconColor={palettes.secondary[700]}
    />
  );
};
