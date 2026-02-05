import { usePreferencesContext } from '../../../core/contexts/PreferencesContext';
import { useGetSite } from '../queries/placesHooks';

export const useGetCurrentCampus = () => {
  const { campusId } = usePreferencesContext();
  return useGetSite(campusId);
};
