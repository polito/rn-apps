import { useTranslation } from 'react-i18next';

import { useGetPerson } from '@polito/lib/features/people';
import { ListItem, PersonListItem } from '@polito/lib/ui';
import { CourseAllOfStaff } from '@polito/student-api-client';

export const StaffListItem = ({ staff }: { staff: CourseAllOfStaff }) => {
  const { t } = useTranslation();
  const { data: person } = useGetPerson(staff.id);

  const subtitle = t(
    'common.' + (staff.role === 'Titolare' ? 'roleHolder' : 'roleCollaborator'),
  );
  return person ? (
    <PersonListItem person={person} subtitle={subtitle} />
  ) : (
    <ListItem title=" - " subtitle={subtitle} />
  );
};
