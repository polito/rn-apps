import { API_BASE_PATH } from '@env';
import { PlacesApiConfig } from '@polito/lib/features/places';
import {
  BASE_PATH,
  Configuration,
  ConfigurationParameters,
  DefaultConfig,
} from '@polito/student-api-client';

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
    },
  };

  if (token) {
    configurationParameters.accessToken = token;
  }

  // TODO(shared-api): Configure the future shared auth client's DefaultConfig here alongside the Students-specific client.
  DefaultConfig.config = new Configuration(configurationParameters);
  PlacesApiConfig.config = new Configuration(configurationParameters);
};
