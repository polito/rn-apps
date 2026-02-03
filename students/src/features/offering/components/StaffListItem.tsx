import { useTranslation } from 'react-i18next';

import { CourseStaffInner } from '@polito/api-client/models';
import { ListItem } from '@polito/lib';
import { PersonListItem } from '@polito/lib';

import { useGetPerson } from '../../../core/queries/peopleHooks';

export const StaffListItem = ({ staff }: { staff: CourseStaffInner }) => {
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
