import { PropsWithChildren } from 'react';

import { ApiProvider as SharedApiProvider } from '@polito/lib/core';
import { ResponseError } from '@polito/student-api-client';
import { experimental_createQueryPersister } from '@tanstack/query-persist-client-core';

import { isEnvProduction } from '~/utils/env.ts';

import { SQLiteStorage } from 'expo-sqlite/kv-store';
import SuperJSON from 'superjson';

import { updateGlobalApiConfiguration } from '../../config/api';
import { getCredentials, resetCredentials } from '../../utils/keychain.ts';

export const QueryStorage = new SQLiteStorage('queryClient');

const DATA_MAX_AGE = 1000 * 3600 * 24 * 7;

export const queryPersister = experimental_createQueryPersister({
  storage: QueryStorage,
  serialize: SuperJSON.stringify,
  deserialize: SuperJSON.parse,
  maxAge: DATA_MAX_AGE,
  refetchOnRestore: 'always',
});

const isResponseError = (error: unknown): error is ResponseError =>
  error instanceof ResponseError;

// Plug the student api-client configuration into the shared provider
export const ApiProvider = ({ children }: PropsWithChildren) => {
  return (
    <SharedApiProvider
      updateApiConfiguration={updateGlobalApiConfiguration}
      getCredentials={getCredentials}
      resetCredentials={resetCredentials}
      isResponseError={isResponseError}
      persisterFn={queryPersister.persisterFn}
      isEnvProduction={isEnvProduction}
    >
      {children}
    </SharedApiProvider>
  );
};
