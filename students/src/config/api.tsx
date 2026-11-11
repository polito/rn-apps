import { API_BASE_PATH, TESTING_API } from '@env';
import {
  Configuration as AuthConfiguration,
  DefaultConfig as AuthDefaultConfig,
} from '@polito/auth-api-client';
import { PlacesApiConfig } from '@polito/lib/features/places';
import {
  BASE_PATH,
  Configuration,
  ConfigurationParameters,
  DefaultConfig,
} from '@polito/student-api-client';

export const testingApiHeaders: Record<string, string> = TESTING_API?.trim()
  ? { 'X-Test-Mode': TESTING_API.trim() }
  : {};

/**
 * Updates the global API configuration used by all clients
 */
export const updateGlobalApiConfiguration = ({
  /**
   * Bearer token
   */
  token,
  /**
   * Preferred language
   */
  language = 'en',
}: {
  token?: string;
  language?: string;
}) => {
  const basePath = API_BASE_PATH ?? BASE_PATH;
  console.debug(`Expecting a running API at ${basePath}`);

  const configurationParameters: ConfigurationParameters = {
    basePath,
    headers: {
      // This currently has no effect but makes sure we don't hit the device
      // http cache, getting results in the wrong language
      'Accept-Language': language,
      ...testingApiHeaders,
    },
  };

  if (token) {
    configurationParameters.accessToken = token;
  }

  AuthDefaultConfig.config = new AuthConfiguration(configurationParameters);
  DefaultConfig.config = new Configuration(configurationParameters);
  PlacesApiConfig.config = new Configuration(configurationParameters);
};
