import { EmergenciesApi } from '@polito/student-api-client';
import { useQuery } from '@tanstack/react-query';

import { usePreferencesContext } from '../../../core/contexts/PreferencesContext';
import { pluckData } from '../../../core/utils/queries';

const EMERGENCIES_QUERY_PREFIX = 'emergencies';

const useEmergenciesClient = (): EmergenciesApi => {
  return new EmergenciesApi();
};

export const useGetEmergencies = () => {
  const emergenciesClient = useEmergenciesClient();
  const { language } = usePreferencesContext();

  return useQuery({
    queryKey: [EMERGENCIES_QUERY_PREFIX, language],
    queryFn: () => emergenciesClient.getEmergencies().then(pluckData),
  });
};
