import { useTranslation } from 'react-i18next';

import { ListItem, PersonListItem } from '@polito/lib/ui';

import { Staff } from '../../core/contexts/CoursesContext';

export const StaffListItem = ({ staff }: { staff: Staff }) => {
  const { t } = useTranslation();

  const staffPerson = {
    id: staff.id,
    role: staff.role,
    firstName: staff.name.split(' ')[0],
    lastName: staff.name.split(' ').slice(1).join(' '),
    picture: '',
    email: '',
    phoneNumbers: [],
    facilityShortName: '',
    profileUrl: '',
    courses: [],
  };

  const subtitle = t(
    'common.' + (staff.role === 'Titolare' ? 'roleHolder' : 'roleCollaborator'),
  );
  return staff ? (
    <PersonListItem person={staffPerson} subtitle={subtitle} />
  ) : (
    <ListItem title=" - " subtitle={subtitle} />
  );
};
