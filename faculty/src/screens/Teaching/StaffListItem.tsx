import { useTranslation } from 'react-i18next';

import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { Icon, ListItem, useTheme } from '@polito/lib/ui';

import { Staff, useCourses } from '../../core/contexts/CoursesContext';
import {
  STAFF_ACCESS_VALUES,
  isHolderStaff,
  normalizeStaffAccess,
} from './staffAccess';

type Props = {
  staff: Staff;
  onPress: (staff: Staff) => void;
};

export const StaffListItem = ({ staff, onPress }: Props) => {
  const { t } = useTranslation();
  const { getProfileById, user } = useCourses();
  const { palettes } = useTheme();
  const holder = isHolderStaff(staff);

  const profile = staff.idProfile ? getProfileById(staff.idProfile) : undefined;
  const fullName = holder
    ? `${t('other.you')}${user?.name ? ` (${user.name})` : ''}`
    : profile
      ? `${profile.name} ${profile.surname}`
      : staff.name;

  const normalizedAccess = normalizeStaffAccess(staff.access);
  const accessLabel =
    normalizedAccess === STAFF_ACCESS_VALUES.full
      ? t('other.fullAccess')
      : t('other.partialAccess');

  return (
    <ListItem
      title={fullName}
      subtitle={!holder ? accessLabel : undefined}
      titleStyle={{
        color: holder ? palettes.gray[700] : palettes.gray[900],
      }}
      subtitleStyle={{
        color: palettes.gray[500],
      }}
      leadingItem={
        <Icon
          icon={faCircleUser}
          size={26}
          color={holder ? palettes.gray[500] : palettes.primary[800]}
        />
      }
      trailingItem={
        !holder ? (
          <Icon
            icon={faPencil}
            size={16}
            color={palettes.primary[600]}
            style={{ width: 16, flexShrink: 0, alignItems: 'center' }}
          />
        ) : undefined
      }
      onPress={!holder ? () => onPress(staff) : undefined}
    />
  );
};
