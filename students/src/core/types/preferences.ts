import { PersonOverview } from '@polito/student-api-client';

import { AgendaTypesFilterState } from '~/features/agenda/types/AgendaTypesFilterState';
import {
  HiddenRecurrence,
  SingleEvent,
} from '~/features/courses/types/Recurrence';

export const editablePreferenceKeys = [
  // This version is used exclusively for migrations.
  // For all other cases, use DeviceInfo from react-native-device-info.
  'lastInstalledVersion',
  'username',
  'campusId',
  'colorScheme',
  'showColorWarning',
  'courses',
  'language',
  'notifications',
  'favoriteServices',
  'peopleSearched',
  'peoplePreferred',
  'emailGuideRead',
  'placesSearched',
  'agendaScreen',
  'filesScreen',
  'hideGrades',
  'loginUid',
  'politoAuthnEnrolmentStatus',
  'fileStorageLocation',
  'customStoragePath',
  'customStorageDisplayPath',
] as const;

// Specify here complex keys, that require serialization/deserialization
export const objectPreferenceKeys = [
  'courses',
  'notifications',
  'favoriteServices',
  'peopleSearched',
  'peoplePreferred',
  'emailGuideRead',
  'placesSearched',
  'agendaScreen',
  'filesScreen',
  'hideGrades',
  'politoAuthnEnrolmentStatus',
];
export interface CoursePreferencesProps {
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
 * App-specific preferences that extend the common preferences.
 * This type is used as the Extra generic parameter in PreferencesProvider.
 */
export type AppPreferences = {
  username: string;
  courses: CoursesPreferences;
  campusId?: string;
  notifications?: {
    important: boolean;
    events: boolean;
    presence: boolean;
  };
  favoriteServices: string[];
  peopleSearched: PersonOverview[];
  peoplePreferred: PersonOverview[];
  emailGuideRead?: boolean;
  agendaScreen: {
    layout: 'weekly' | 'daily';
    filters: AgendaTypesFilterState;
  };
  filesScreen: 'filesView' | 'directoryView';
  showColorWarning?: boolean;
  hideGrades?: boolean;
  loginUid?: string | null;
  politoAuthnEnrolmentStatus?: {
    inSettings?: boolean;
    insertedDeviceName?: string;
    hideInitialPrompt?: boolean;
  };
  fileStorageLocation?: 'internal' | 'custom';
  customStoragePath?: string;
  customStorageDisplayPath?: string;
};

export const initialAppPreferences: AppPreferences = {
  username: '',
  courses: {},
  favoriteServices: [],
  peopleSearched: [],
  peoplePreferred: [],
  agendaScreen: {
    layout: 'daily',
    filters: {
      booking: false,
      deadline: false,
      exam: false,
      lecture: false,
    },
  },
  filesScreen: 'directoryView',
};

export interface CoursePreferencesProps {
  color: string;
  icon?: string;
  isHidden: boolean;
  order?: number;
  isHiddenInAgenda: boolean;
  itemsToHideInAgenda?: HiddenRecurrence[];
  singleItemsToHideInAgenda?: SingleEvent[];
}
