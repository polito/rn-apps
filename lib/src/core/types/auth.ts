import { SuccessResponse } from './api';

// TODO(shared-api): Replace the hand-written auth DTOs
export type AuthPreferences = {
  language?: 'it' | 'en';
};

export type AuthDevice = {
  name?: string;
  platform: string;
  version?: string;
  model?: string;
  manufacturer?: string;
  toothPicCompatible: boolean;
};

export type AuthClientInfo = {
  buildNumber: string;
  appVersion: string;
  fcmRegistrationToken?: string;
  name: string;
  id?: string;
};

type LoginRequestBase = {
  client?: AuthClientInfo;
  device?: AuthDevice;
  preferences: AuthPreferences;
};

export type BasicLoginRequest = LoginRequestBase & {
  loginType: 'basic';
  username: string;
  password: string;
};

export type SsoLoginRequest = LoginRequestBase & {
  loginType: 'sso';
  uid: string;
  key: string;
};

export type LoginRequest = BasicLoginRequest | SsoLoginRequest;

export type AuthIdentity = {
  username: string;
  type: string;
  clientId: string;
  token: string;
};

export type AppInfoRequest = {
  buildNumber: string;
  appVersion: string;
  fcmRegistrationToken?: string;
};

export type MfaStatus =
  | 'active'
  | 'locked'
  | 'available'
  | 'unavailable'
  | 'needsReauth';

export type MfaStatusResponse = {
  status: MfaStatus;
  details: {
    lastAuth: Date;
    authCount: number;
    serial?: string;
    description?: string;
  } | null;
};

export type EnrolMfaRequest = {
  description: string;
  pubkey: string;
};

export type MfaChallenge = {
  serial: string;
  challenge: string;
  requestTs: Date;
  expirationTs: Date;
};

export type ValidateMfaRequest = {
  serial: string;
  nonce: string;
  signature: string;
  decline?: boolean;
};

/**
 * Structural boundary implemented by both generated API clients.
 * Keeping it in the shared library lets auth code remain client-agnostic while
 * each app continues configuring and instantiating its own generated client.
 */
export interface AuthApiClient {
  appInfo(request: {
    appInfoRequest: AppInfoRequest;
  }): Promise<SuccessResponse<{ suggestUpdate: boolean }>>;
  enrolMfa(request: {
    enrolMfaRequest: EnrolMfaRequest;
  }): Promise<SuccessResponse<{ serial: string }>>;
  fetchChallenge(): Promise<SuccessResponse<MfaChallenge | null>>;
  getMfaStatus(): Promise<SuccessResponse<MfaStatusResponse>>;
  login(request: {
    loginRequest: LoginRequest;
  }): Promise<SuccessResponse<AuthIdentity>>;
  logout(): Promise<void>;
  validateMfa(request: {
    validateMfaRequest: ValidateMfaRequest;
  }): Promise<SuccessResponse<{ success: boolean }>>;
}

export type PushTokenProvider = () => Promise<string | undefined>;

export type AuthLogoutSuccessHandler = (
  username: string,
) => void | Promise<void>;

export type AuthIdentityValidator = (
  identity: AuthIdentity,
) => void | Promise<void>;
