import { Platform } from 'react-native';

import {
  BaseAPI,
  Configuration,
  DefaultConfig,
} from '@polito/student-api-client';

import { cacheDirectory, createResumableDownload } from './fileSystem';

export const withNativeDownloader = async <T extends BaseAPI>(
  api: new (config: Configuration) => T,
  request: (client: T) => Promise<unknown>,
  fileName: string,
): Promise<string> => {
  const toFile = `${cacheDirectory}/${fileName}`;
  const client = new api(
    new Configuration({
      ...DefaultConfig.config,
      fetchApi: async (input: string, init?: RequestInit) => {
        const url = typeof input === 'string' ? input : String(input);
        const headers: Record<string, string> = {};
        new Headers(init?.headers).forEach((value, key) => {
          headers[key] = value;
        });
        const resumable = createResumableDownload(url, toFile, { headers });
        const result = await resumable.downloadAsync();
        if (result.status !== 200) {
          throw new Error(
            `Native download failed with status ${result.status}`,
          );
        }
        return new Response(new Blob(), { status: result.status });
      },
    }),
  );
  await request(client);
  return Platform.select({ android: 'file://', ios: '' }) + toFile;
};
