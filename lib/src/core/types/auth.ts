import type { AuthApi, Identity } from '@polito/auth-api-client';

export type {
  AppInfoRequest,
  Client,
  Device,
  EnrolMfaRequest,
  Identity,
  LoginCredentialsBasic,
  LoginCredentialsSSO,
  LoginRequest,
  MfaChallenge,
  MfaStatusResponse,
  MfaStatusResponseStatusEnum,
  UpdatePreferencesRequest,
  ValidateMfaRequest,
} from '@polito/auth-api-client';

export type AuthApiClient = Pick<
  AuthApi,
  | 'appInfo'
  | 'enrolMfa'
  | 'fetchChallenge'
  | 'getMfaStatus'
  | 'login'
  | 'logout'
  | 'validateMfa'
>;

export type PushTokenProvider = () => Promise<string | undefined>;

export type AuthLogoutSuccessHandler = (
  username: string,
) => void | Promise<void>;

export type AuthIdentityValidator = (
  identity: Identity,
) => void | Promise<void>;
