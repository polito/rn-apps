import { ReactNode } from 'react';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { PersonOverview } from '@polito/student-api-client';

export type PeoplePreferences = {
  peopleSearched: PersonOverview[];
  peoplePreferred: PersonOverview[];
};

export type UsefulContactsVisibility = 'always' | 'onSearchFocus';

export type UsefulContact = {
  id: string;
  title: string;
};

export type UsefulContactAction =
  | { kind: 'email'; target: string }
  | { kind: 'tel'; target: string }
  | { kind: 'link'; target: string };

export type UsefulContactItem = {
  icon: IconDefinition;
  title: string;
  value: string;
  action: UsefulContactAction;
};

export type UsefulContactSectionDescription = {
  paragraphs: ReactNode[];
  warning?: ReactNode;
};

export type UsefulContactSectionInfo = {
  title: string;
  body: ReactNode;
};

export type UsefulContactDetail = {
  title: string;
  description: UsefulContactSectionDescription;
  info?: UsefulContactSectionInfo;
  contacts: UsefulContactItem[];
};

export type PeopleStackParamList = {
  Contacts: undefined;
  Person: { id: number };
  UsefulContact: { id: string };
};
