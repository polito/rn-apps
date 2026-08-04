import { PersonOverview } from '@polito/api-client';

import { AgendaTypesFilterState } from '../../screens/Agenda/types/AgendaTypesFilterState';
import { HiddenRecurrence } from './Recurrence';

export const editablePreferenceKeys = [
  // This version is used exclusively for migrations.
  // For all other cases, use DeviceInfo from react-native-device-info.
  'lastInstalledVersion',
  'campusId',
  'colorScheme',
  'courses',
  'language',
  'notifications',
  'favoriteServices',
  'peopleSearched',
  'onboardingStep',
  'emailGuideRead',
  'placesSearched',
  'agendaScreen',
  'filesScreen',
  'hideGrades',
] as const;

// Specify here complex keys, that require serialization/deserialization
export const objectPreferenceKeys = [
  'courses',
  'notifications',
  'favoriteServices',
  'peopleSearched',
  'onboardingStep',
  'emailGuideRead',
  'placesSearched',
  'agendaScreen',
  'filesScreen',
  'hideGrades',
];

interface CoursePreferencesProps {
  color: string;
  icon?: string;
  isHidden: boolean;
  order?: number;
  isHiddenInAgenda: boolean;
  itemsToHideInAgenda?: HiddenRecurrence[];
}

export type CoursesPreferences = {
  [courseId: number | string]: CoursePreferencesProps;
};

/**
 * App-specific preferences that extend the common preferences
 * provided by @polito/lib core (lastInstalledVersion, colorScheme, language, accessibility).
 */
export type AppPreferences = {
  campusId?: string;
  courses: CoursesPreferences;
  notifications?: {
    important: boolean;
    events: boolean;
    presence: boolean;
  };
  favoriteServices: string[];
  peopleSearched: PersonOverview[];
  onboardingStep?: number;
  emailGuideRead?: boolean;
  agendaScreen: {
    layout: 'weekly' | 'daily';
    filters: AgendaTypesFilterState;
  };
  filesScreen: 'filesView' | 'directoryView';
  hideGrades?: boolean;
};

export const initialAppPreferences: AppPreferences = {
  courses: {},
  favoriteServices: [],
  peopleSearched: [],
  agendaScreen: {
    layout: 'daily',
    filters: {
      booking: false,
      deadline: false,
      exam: false,
      lecture: false,
    },
  },
  filesScreen: 'filesView',
};
