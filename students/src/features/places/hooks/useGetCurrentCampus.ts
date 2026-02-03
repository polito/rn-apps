import { usePreferencesContext } from '@polito/lib';

import { AppPreferences } from '~/core/types/preferences';

import { useGetSite } from '../../../core/queries/placesHooks';

export const useGetCurrentCampus = () => {
  const { campusId } = usePreferencesContext<AppPreferences>();
  return useGetSite(campusId);
};
