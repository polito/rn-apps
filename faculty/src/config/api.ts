import { API_BASE_PATH } from '@env';
import {
  BASE_PATH,
  Configuration,
  ConfigurationParameters,
  DefaultConfig,
} from '@polito/api-client';
import {
  Configuration as AuthConfiguration,
  DefaultConfig as AuthDefaultConfig,
} from '@polito/auth-api-client';

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
    },
  };

  if (token) {
    configurationParameters.accessToken = token;
  }

  AuthDefaultConfig.config = new AuthConfiguration(configurationParameters);
  DefaultConfig.config = new Configuration(configurationParameters);
};
