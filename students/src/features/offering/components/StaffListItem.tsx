import { useTranslation } from 'react-i18next';

import { ListItem, PersonListItem } from '@polito/lib/ui';
import { CourseAllOfStaff } from '@polito/student-api-client';

import { useAccessibility } from '../../../core/hooks/useAccessibilty';
import { useGetPerson } from '../../../core/queries/peopleHooks';

interface StaffListItemProps {
  staff: CourseAllOfStaff;
  index?: number;
  total?: number;
}

export const StaffListItem = ({ staff, index, total }: StaffListItemProps) => {
  const { t } = useTranslation();
  const { data: person } = useGetPerson(staff.id);
  const { buildCompositeListLabel } = useAccessibility();

  const subtitle = t(
    'common.' + (staff.role === 'Titolare' ? 'roleHolder' : 'roleCollaborator'),
  );

  const baseLabel = person
    ? `${person.firstName} ${person.lastName}, ${subtitle}`
    : `${t('common.staffMemberUnavailable')}, ${subtitle}`;

  const accessibilityLabel = buildCompositeListLabel([baseLabel], index, total);

  return person ? (
    <PersonListItem
      person={person}
      subtitle={subtitle}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint={t('common.tapToViewContact')}
    />
  ) : (
    <ListItem
      title=" - "
      subtitle={subtitle}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="none"
    />
  );
};
