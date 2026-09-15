export { ContactsScreen } from './screens/ContactsScreen';
export { PersonScreen } from './screens/PersonScreen';
export { StaticContactScreenContent } from './screens/StaticContactScreenContent';
export { UsefulContactScreen } from './screens/UsefulContactScreen';
export { HighlightedText } from './components/HighlightedText';
export { PersonOverviewListItem } from './components/PersonOverviewListItem';
export { RecentSearch } from './components/RecentSearch';
export { UsefulContactsSection } from './components/UsefulContactsSection';
export {
  CONSIGLIERA_FIDUCIA_ID,
  GARANTE_STUDENTI_ID,
  SPORTELLO_ANTIVIOLENZA_ID,
  defaultUsefulContactsContent,
  defaultUsefulContactsList,
  studentsUsefulContactsList,
} from './data/defaultUsefulContacts';
export {
  getPersonKey,
  useGetPeople,
  useGetPerson,
  useGetPersons,
} from './queries/peopleHooks';
export type {
  PeoplePreferences,
  PeopleStackParamList,
  UsefulContactsVisibility,
  UsefulContact,
  UsefulContactAction,
  UsefulContactDetail,
  UsefulContactItem,
  UsefulContactSectionDescription,
  UsefulContactSectionInfo,
} from './types';
