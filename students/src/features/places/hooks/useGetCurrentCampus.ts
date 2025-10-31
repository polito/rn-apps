import { usePreferencesContext } from '@lib/core/contexts/PreferencesContext';

import { AppPreferences } from '~/core/types/preferences';

import { useGetSite } from '../../../core/queries/placesHooks';

export const useGetCurrentCampus = () => {
  const { campusId } = usePreferencesContext<AppPreferences>();
  return useGetSite(campusId);
};
