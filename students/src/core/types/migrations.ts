import { PreferencesContextProps } from '@lib/core/contexts/PreferencesContext';
import { QueryClient } from '@tanstack/react-query';

import { AppPreferences } from './preferences';

export type Migration = {
  runBeforeVersion: string;
  run: ((
    p: PreferencesContextProps<AppPreferences>,
    q: QueryClient,
  ) => Promise<void>)[];
};
