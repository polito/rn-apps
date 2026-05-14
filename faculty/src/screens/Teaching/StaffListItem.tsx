import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableHighlightProps } from 'react-native';

import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { IconButton, ListItem, PersonListItem, useTheme } from '@polito/lib/ui';

import { Staff, useCourses } from '../../core/contexts/CoursesContext';
import {
  STAFF_ACCESS_VALUES,
  isHolderStaff,
  normalizeStaffAccess,
} from './staffAccess';

type Props = TouchableHighlightProps & {
  staff: Staff;
  subtitle?: string | ReactElement;
  navigateEnabled?: boolean;
  onRowPress?: () => void;
  trailingItem?: ReactElement;
};

export const StaffListItem = ({
  staff,
  subtitle,
  navigateEnabled = true,
  onRowPress,
  trailingItem,
  onPress,
  ...touchableProps
}: Props) => {
  const { t } = useTranslation();
  const { user } = useCourses();
  const { palettes, fontSizes } = useTheme();
  const holder = isHolderStaff(staff);

  const staffPerson = {
    id: staff.id,
    role: staff.role,
    firstName: holder
      ? `${t('other.you')}${user?.name ? ` (${user.name.split(' ')[0]}` : ''}`
      : staff.name.split(' ')[0],
    lastName: holder
      ? `${user?.name ? `${user.name.split(' ').slice(1).join(' ')})` : ''}`
      : staff.name.split(' ').slice(1).join(' '),
    picture: '',
    email: '',
    phoneNumbers: [],
    facilityShortName: '',
    profileUrl: '',
    courses: [],
  };

  const normalizedAccess = normalizeStaffAccess(staff.access);
  const accessLabel =
    normalizedAccess === STAFF_ACCESS_VALUES.full
      ? t('other.fullAccess')
      : t('other.partialAccess');

  const displaySubtitle = subtitle ?? (!holder ? accessLabel : undefined);

  return staff ? (
    <PersonListItem
      person={staffPerson}
      subtitle={displaySubtitle}
      navigateEnabled={navigateEnabled && !onRowPress}
      onPress={onRowPress}
      trailingItem={
        trailingItem ||
        (!holder ? (
          <IconButton
            icon={faPencil}
            size={fontSizes.md}
            color={palettes.primary[600]}
            style={{ width: 16, flexShrink: 0, alignItems: 'center' }}
            onPress={!holder ? onPress : undefined}
          />
        ) : undefined)
      }
      holder={holder}
      {...touchableProps}
    />
  ) : (
    <ListItem title=" - " subtitle={displaySubtitle} />
  );
};
