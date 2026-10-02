import { createContext, useContext } from 'react';

//TODO: switch to @polito/map-client when published
import { PlaceOverview } from '@polito/api-client';

import { Accessibility } from '../types/Accessibility';

export const editablePreferenceKeys = [
  // This version is used exclusively for migrations.
  // For all other cases, use DeviceInfo from react-native-device-info.
  'lastInstalledVersion',
  'username',
  'loginUid',
  'politoAuthnEnrolmentStatus',
  'accessibility',
] as const;

// Runtime list of editable keys (kept for migrations / runtime checks)
export type PreferenceKey = (typeof editablePreferenceKeys)[number];
export type CoursesPreferences = {
  [courseId: number | string]: CoursePreferencesProps;
};
export type HiddenRecurrence = {
  day: number;
  start: string;
  end: string;
  room: string;
};
export interface CoursePreferencesProps {
  color: string;
  icon?: string;
  isHidden: boolean;
  order?: number;
  isHiddenInAgenda: boolean;
  isExamCallsHidden?: boolean;
  itemsToHideInAgenda?: HiddenRecurrence[];
}

export type PolitoAuthnEnrolmentStatus = {
  inSettings?: boolean;
  insertedDeviceName?: string;
  hideInitialPrompt?: boolean;
};

// Core/common preferences that every app should provide
export type CommonPreferences = {
  lastInstalledVersion: string | null;
  username: string;
  loginUid?: string | null;
  politoAuthnEnrolmentStatus?: PolitoAuthnEnrolmentStatus;
  colorScheme: 'light' | 'dark' | 'system';
  language: 'it' | 'en';
  accessibility: Accessibility;
  campusId?: string;
  placesSearched: PlaceOverview[];
  courses: CoursesPreferences;
};

// Specify here complex keys, that require serialization/deserialization
export const objectPreferenceKeys = [
  'accessibility',
  'placesSearched',
  'politoAuthnEnrolmentStatus',
];

// Make the full preferences shape generic so callers can pass app-specific keys
// Default Extra type keeps previous shape for backward compatibility
export type PreferencesContextBase<Extra = {}> = CommonPreferences & Extra;

export type UpdatePreference<Extra = {}> = {
  <K extends keyof CommonPreferences>(
    key: K,
    value: CommonPreferences[K],
  ): void;
  <K extends keyof Extra>(key: K, value: Extra[K]): void;
};

export type PreferencesContextProps<Extra = {}> =
  PreferencesContextBase<Extra> & {
    updatePreference: UpdatePreference<Extra>;
  };

export const PreferencesContext = createContext<
  PreferencesContextProps<any> | undefined
>(undefined);

export const usePreferencesContext = <Extra = {}>() => {
  const preferencesContext = useContext(PreferencesContext) as
    | PreferencesContextProps<Extra>
    | undefined;
  if (!preferencesContext)
    throw new Error(
      'No PreferencesContext.Provider found when calling usePreferencesContext.',
    );
  return preferencesContext;
};
