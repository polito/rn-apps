import { useMemo } from 'react';

import { ignoreNotFound, pluckData } from '@polito/lib/core';
import { PeopleApi } from '@polito/student-api-client';
import { useQueries } from '@tanstack/react-query';

const PERSON_QUERY_PREFIX = 'person';

const usePeopleClient = (): PeopleApi => {
  return new PeopleApi();
};

export const useGetPersons = (personIds: number[] | undefined) => {
  const peopleClient = usePeopleClient();

  const queries = useQueries({
    queries: (personIds ?? []).map(personId => ({
      queryKey: [PERSON_QUERY_PREFIX, personId],
      queryFn: () =>
        peopleClient
          .getPerson({ personId })
          .then(pluckData)
          .catch(ignoreNotFound),
      staleTime: Infinity,
    })),
  });

  const isLoading = useMemo(() => {
    if (!personIds) return true;
    return queries.some(q => q.isLoading);
  }, [personIds, queries]);

  return { isLoading, queries };
};
