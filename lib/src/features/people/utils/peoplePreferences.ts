import { Person, PersonOverview } from '@polito/student-api-client';

import { PeoplePreferences } from '../types';

export const toPersonOverview = (person: Person): PersonOverview => ({
  id: person.id,
  firstName: person.firstName,
  lastName: person.lastName,
  picture: person.picture,
  role: person.role,
});

export const togglePersonPreferred = (
  peoplePreferred: PersonOverview[],
  person: PersonOverview,
): PersonOverview[] => {
  const exists = peoplePreferred.some(p => p.id === person.id);
  if (exists) {
    return peoplePreferred.filter(p => p.id !== person.id);
  }
  return [person, ...peoplePreferred];
};

export const isPersonPreferred = (
  peoplePreferred: PeoplePreferences['peoplePreferred'],
  personId: number,
) => peoplePreferred.some(p => p.id === personId);
