import { useTranslation } from 'react-i18next';

import { useAccessibility } from '@polito/lib/core';
import { useGetPerson } from '@polito/lib/features/people';
import { ListItem, PersonListItem } from '@polito/lib/ui';
import { CourseAllOfStaff } from '@polito/student-api-client';

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
