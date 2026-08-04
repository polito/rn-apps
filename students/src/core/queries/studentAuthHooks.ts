import { useCallback } from 'react';

import {
  pluckData,
  useApiContext,
  usePolitoAppKeychainServices,
  usePreferencesContext,
} from '@polito/lib/core';
import { AuthApi, SwitchCareerRequest } from '@polito/student-api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const WEBMAIL_LINK_QUERY_KEY = ['webmailLink'];

// switching careers and opening webmail are Students-only flows.
const useStudentAuthClient = () => new AuthApi();

export const useSwitchCareer = () => {
  const authClient = useStudentAuthClient();
  const { refreshContext } = useApiContext();
  const { updatePreference } = usePreferencesContext();
  const queryClient = useQueryClient();
  const { credentials: credentialsKeychain } = usePolitoAppKeychainServices();

  return useMutation({
    mutationFn: (dto: SwitchCareerRequest) =>
      authClient.switchCareer({ switchCareerRequest: dto }).then(pluckData),
    onSuccess: async data => {
      const { token, username, clientId } = data;
      refreshContext({ token, username });
      queryClient.invalidateQueries();

      await credentialsKeychain.setCredentials(clientId, token);
      updatePreference('username', username);
    },
  });
};

export const useGetWebmailLink = () => {
  const authClient = useStudentAuthClient();

  return useCallback(
    () => authClient.getMailLink().then(pluckData),
    [authClient],
  );
};
