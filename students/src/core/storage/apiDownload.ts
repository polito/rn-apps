import { Platform } from 'react-native';

import { Configuration, DefaultConfig } from '@polito/student-api-client';

import { cacheDirectory, createResumableDownload } from './fileSystem';

/**
 * Build a Configuration whose `fetchApi` streams the response straight to
 * `toFile` via RNFS instead of buffering it into JS memory. Pair it with a
 * generated client's `*Raw` blob method (which never calls `.blob()`), so large
 * files download natively off-thread without OOM.
 *
 * Base path (incl. `API_BASE_PATH` override), auth token and default headers are
 * inherited from the global `DefaultConfig`, so the client builds the exact same
 * URL/headers as a normal request — nothing is hand-written.
 */
export const createNativeDownloadConfig = (toFile: string): Configuration => {
  const globalConfig = DefaultConfig.config;

  return new Configuration({
    basePath: globalConfig.basePath,
    accessToken: globalConfig.accessToken,
    headers: globalConfig.headers,
    fetchApi: async (input: string, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : String(input);
      const headers: Record<string, string> = {};
      new Headers(init?.headers).forEach((value, key) => {
        headers[key] = value;
      });
      const resumable = createResumableDownload(url, toFile, { headers });
      const result = await resumable.downloadAsync();
      if (result.status !== 200) {
        throw new Error(`Native download failed with status ${result.status}`);
      }
      return new Response(null, { status: 200 });
    },
  });
};

/**
 * Download a blob endpoint natively to the cache directory using any generated
 * API client, and return a local path openable by react-native-file-viewer.
 *
 * @param fileName    destination file name inside the cache directory
 * @param makeClient  builds the API client from the download-diverting config
 * @param request     calls the client's `*Raw` blob method
 */
export const downloadViaClient = async <T>(
  fileName: string,
  makeClient: (config: Configuration) => T,
  request: (client: T) => Promise<unknown>,
): Promise<string> => {
  const toFile = `${cacheDirectory}/${fileName}`;
  await request(makeClient(createNativeDownloadConfig(toFile)));
  return Platform.select({ android: 'file://', ios: '' }) + toFile;
};
