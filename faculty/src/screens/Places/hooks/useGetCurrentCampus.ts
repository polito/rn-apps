import { usePreferencesContext } from '@polito/lib';

import { useGetSite } from '../../../core/queries/placesHooks';

export const useGetCurrentCampus = () => {
  const { campusId } = usePreferencesContext();
  return useGetSite(campusId);
};
