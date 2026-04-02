import { createContext, useContext } from 'react';

//TODO: switch to @polito/map-client when published
import { PlaceOverview } from '@polito/student-api-client';

import { Accessibility } from '../types/Accessibility';

export const editablePreferenceKeys = [
  // This version is used exclusively for migrations.
  // For all other cases, use DeviceInfo from react-native-device-info.
  'lastInstalledVersion',
  'accessibility',
] as const;

// Runtime list of editable keys (kept for migrations / runtime checks)
export type PreferenceKey = (typeof editablePreferenceKeys)[number];

// Core/common preferences that every app should provide
export type CommonPreferences = {
  lastInstalledVersion: string | null;
  colorScheme: 'light' | 'dark' | 'system';
  language: 'it' | 'en';
  accessibility: Accessibility;
  campusId?: string;
  placesSearched: PlaceOverview[];
};

// Specify here complex keys, that require serialization/deserialization
export const objectPreferenceKeys = ['accessibility', 'placesSearched'];

// Make the full preferences shape generic so callers can pass app-specific keys
// Default Extra type keeps previous shape for backward compatibility
export type PreferencesContextBase<Extra = {}> = CommonPreferences & Extra;

export type PreferencesContextProps<Extra = {}> =
  PreferencesContextBase<Extra> & {
    updatePreference: <K extends keyof PreferencesContextBase<Extra>>(
      key: K,
      value: PreferencesContextBase<Extra>[K],
    ) => void;
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
