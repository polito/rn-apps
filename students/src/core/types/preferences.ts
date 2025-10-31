import { PersonOverview, PlaceOverview } from '@polito/api-client';

import { AgendaTypesFilterState } from '~/features/agenda/types/AgendaTypesFilterState';

import { HiddenRecurrence } from '../../features/courses/types/Recurrence';

export const editablePreferenceKeys = [
  'accessibility',
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
  'onboardingStep',
  'emailGuideRead',
  'placesSearched',
  'agendaScreen',
  'filesScreen',
  'hideGrades',
  'loginUid',
  'politoAuthnEnrolmentStatus',
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
  onboardingStep?: number;
  emailGuideRead?: boolean;
  placesSearched: PlaceOverview[];
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
};

export const initialAppPreferences: AppPreferences = {
  username: '',
  courses: {},
  favoriteServices: [],
  peopleSearched: [],
  placesSearched: [],
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
