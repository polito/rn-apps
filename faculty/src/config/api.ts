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

export const updateGlobalApiConfiguration = ({
  token,
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
