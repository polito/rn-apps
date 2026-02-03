import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  PreferencesContext,
  PreferencesContextProps,
  editablePreferenceKeys as commonEditablePreferenceKeys,
  objectPreferenceKeys as commonObjectPreferenceKeys,
} from '../contexts/PreferencesContext';
import { useDeviceLanguage } from '../hooks/useDeviceLanguage';

type PreferencesProviderProps<
  Extra,
  EditableKeys extends readonly string[] = readonly string[],
  ObjectKeys extends readonly string[] = readonly string[],
> = PropsWithChildren<{
  /** All additional preference keys that the app wants persisted */
  extraEditableKeys?: EditableKeys;
  /** Subset of extraEditableKeys that should be treated as objects (JSON) */
  extraObjectKeys?: ObjectKeys;
  /** Optional initial partial preferences to seed the context */
  initialPreferences?: Partial<PreferencesContextProps<Extra>>;
}>;

/**
 * Generic provider: Extra is the app-specific preferences shape that will be
 * merged with the common preferences. The provider accepts arrays of extra
 * keys so it can read/write them from AsyncStorage without depending on
 * app code at the common package level.
 */
export const PreferencesProvider = <Extra extends Record<string, any> = {}>({
  children,
  extraEditableKeys = [],
  extraObjectKeys = [],
  initialPreferences,
}: PreferencesProviderProps<Extra>) => {
  const deviceLanguage = useDeviceLanguage();

  const editableKeys = useMemo(
    () => [...commonEditablePreferenceKeys, ...extraEditableKeys],
    [extraEditableKeys],
  );

  const objectKeysSet = useMemo(() => {
    const set = new Set<string>([
      ...commonObjectPreferenceKeys,
      ...extraObjectKeys,
    ]);
    return set;
  }, [extraObjectKeys]);

  const [preferencesContext, setPreferencesContext] = useState<
    PreferencesContextProps<Extra>
  >(
    () =>
      ({
        // basic defaults
        lastInstalledVersion: null,
        colorScheme: 'system',
        language: deviceLanguage,
        accessibility: {},
        updatePreference: () => {},
        ...initialPreferences,
      }) as unknown as PreferencesContextProps<Extra>,
  );

  const preferencesInitialized = useRef<boolean>(false);

  const updatePreference = useCallback(
    (key: keyof PreferencesContextProps<Extra> | string, value: unknown) => {
      const stringKey = String(key);
      if (value === null) {
        AsyncStorage.removeItem(stringKey).then(() =>
          setPreferencesContext((oldP: PreferencesContextProps<Extra>) => ({
            ...oldP,
            [stringKey]: value,
          })),
        );
        return;
      }

      let storageValue: string;
      if (objectKeysSet.has(stringKey)) {
        storageValue = JSON.stringify(value);
      } else if (typeof value === 'boolean') {
        storageValue = value.toString();
      } else {
        storageValue = value as string;
      }

      AsyncStorage.setItem(stringKey, storageValue).then(() =>
        setPreferencesContext((oldP: PreferencesContextProps<Extra>) => ({
          ...oldP,
          [stringKey]: value,
        })),
      );
    },
    [objectKeysSet],
  );

  // Initialize preferences from AsyncStorage
  useEffect(() => {
    AsyncStorage.multiGet(editableKeys).then(storagePreferences => {
      const preferences: Record<string, unknown> = {
        updatePreference,
      };

      storagePreferences.forEach(([key, value]) => {
        if (value === null) return;

        if (objectKeysSet.has(key)) {
          try {
            preferences[key] = JSON.parse(value) ?? {};
          } catch (e) {
            preferences[key] = {};
          }
        } else {
          // language === 'system' is mapped to device language
          if (key === 'language' && value === 'system') {
            preferences[key] = deviceLanguage;
          } else {
            preferences[key] = value;
          }
        }
      });

      setPreferencesContext(oldP => ({
        ...oldP,
        ...(preferences as Partial<PreferencesContextProps<Extra>>),
      }));
    });
  }, [editableKeys, objectKeysSet, deviceLanguage, updatePreference]);

  // Preferences are loaded
  useEffect(() => {
    preferencesInitialized.current = true;
  }, [preferencesContext]);

  return (
    <PreferencesContext.Provider value={preferencesContext}>
      {preferencesInitialized.current && children}
    </PreferencesContext.Provider>
  );
};
