import { PreferencesContextProps } from '@polito/lib';
import { QueryClient } from '@tanstack/react-query';

import { AppPreferences } from './preferences';

export type Migration = {
  runBeforeVersion: string;
  run: ((
    p: PreferencesContextProps<AppPreferences>,
    q: QueryClient,
  ) => Promise<void>)[];
};
