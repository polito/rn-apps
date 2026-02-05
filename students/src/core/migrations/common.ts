import { PreferencesContextProps } from '@polito/lib/core';
import { QueryClient } from '@tanstack/react-query';

import { AppPreferences } from '../types/preferences';

export const invalidateCache = async (
  preferences: PreferencesContextProps<AppPreferences>,
  client: QueryClient,
) => {
  client.clear();
};
