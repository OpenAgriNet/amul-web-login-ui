/**
 * Amul API TypeScript SDK - Type Definitions
 * Generated from MITM captured traffic - VERIFIED
 */

// ============== Base Response Types ==============

export interface ApiResponse<T = unknown> {
  Data: T;
  Errors: string[];
  Message: string;
  StatusCode: number;
}

// ============== Authentication Types ==============

export interface GetApiUrlRequest {
  MobileNo: string;
  ApiVersion: string;
  AppType: string;
  APPPlatForm: string;
  AppVersion: string;
}

export interface GetApiUrlResponse {
  Url: string;
  UserType: number;
  AboutUsUrl: string;
  UploadImageUrl: string;
  ItemOrderUrl: string;
}

export interface ValidateMobileRequest {
  AppKey: string;
  APPVerificationSecret: string;
  MobileNo: string;
  DeviceId: string;
  CultureId: string;
  ApiVersion: string;
  AppType: string;
  APPPlatForm: string;
  AppVersion: string;
  OSVersion: string;
  screenresolution: string;
  model: string;
  PushNotificationId: string;
  SocietyId: number;
}

/** Response returns encrypted API credentials */
export interface ValidateMobileResponse {
  APIKey: string;
  APISecret: string;
}

export interface RegisterMobileRequest {
  AppKey: string;
  APPVerificationSecret: string;
  MobileNo: string;
  DeviceId: string;
  ApiVersion: string;
  AppType: string;
  CultureId: string;
  APPPlatForm: string;
  AppVersion: string;
  OTP: string;
}

/** Response is an encrypted token string used for Bearer auth */
export type RegisterMobileResponse = string;

// ============== Farmer Detail Types (VERIFIED) ==============

export interface FarmerDetail {
  FarmerId: string;
  FarmerCode: string;
  FarmerName: string;
  IsMember: boolean;
  Address: string;
  Email: string;
  BankAccountNo: string;
  IFSCCode: string;
  BankBranchCode: string;
  BankName: string;
  ImageUrl: string | null;
  ProfileImage: string;
  CattleBuySellGuid: string;
  WhatsAppNo: string | null;
  Latitude: number;
  Longitude: number;
}

export interface GetFarmerDetailRequest {
  CultureId: string;
}

/** Note: Returns an ARRAY of farmers (multiple farmers can be linked to one mobile) */
export type GetFarmerDetailResponse = FarmerDetail[];

// ============== Society Data Types (VERIFIED) ==============

export interface SocietyData {
  SocietyId: string;
  SocietyName: string;
  SocietyCode: string;
  UnionName: string;
  UnionCode: string;
  UnionId: number;
}

export interface GetSocietyDataRequest {
  CultureId: string;
}

// ============== Farmer Settings Types (VERIFIED) ==============

export interface FarmerSetting {
  SettingKey: string;
  SettingValue: string;
}

export interface GetFarmerSettingRequest {
  CultureId: string;
}

// ============== Cattle Info Types (VERIFIED) ==============

export interface GetCattleInfoRequest {
  CultureId: string;
  RequestData: {
    MobileNo: string;
  };
}

// Response is empty string when no data found (StatusCode: 1010)

// ============== Item Types (VERIFIED) ==============

export interface GetAllItemRequest {
  Cultureid: string;  // Note: lowercase 'id'
  SocietyId: string;
  UpdatedOn: string;
}

// Response Data is empty array when no items

// ============== UOM Types (VERIFIED) ==============

export interface UOMInfo {
  UOMId: string;
  UOMName: string;
}

export interface GetUOMRequest {
  Cultureid: string;  // Note: lowercase 'id'
  SocietyId: string;
  UpdatedOn: string;
}

// ============== App Module Types (VERIFIED) ==============

export interface AppModule {
  AppType: number;
  ModuleId: number;
  AppTypeName: string;
  ModuleName: string;
  CompanyId: number;
  IsActiveInactive: boolean;
  Layout: number;
  SortOrder: number;
  ParentId: number;
}

// Request is empty object {}

// ============== Version Detail Types (VERIFIED) ==============

export interface VersionDetail {
  APPVersion: string;
  IsMandatory: number;
  IsFromGujarat: boolean;
}

// Request is empty object {}

// ============== Pashudhan (Animal Trading) Types (VERIFIED) ==============

export interface PashudhanAuthRequest {
  mobileNo: string;  // lowercase
  WhatsAppNo: string;
  uniqueId: string;
  socityCode: string;  // Note: typo in API
  unionName: string;
  unionCode: string;
  farmercode: string;  // lowercase
  userName: string;
  emailId: string;
  latitude: number;
  longitude: number;
  cultureId: string;
  PushNotificationFCMId: string;
  amcsToken: string;
  platform: string;
  deviceId: string;
}

export interface PashudhanAuthResponse {
  userName: string;
  socityCode: string;
  unionCode: string;
  deviceId: string;
  userId: number;
  token: string;  // JWT Token
}

export interface PashudhanApiResponse<T = unknown> {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// ============== Status Codes ==============

export const StatusCodes = {
  OK: 200,
  DATA_NOT_FOUND: 1010,
} as const;

export type StatusCode = typeof StatusCodes[keyof typeof StatusCodes];

// ============== SDK Configuration Types ==============

export interface AmulSdkConfig {
  appKey?: string;
  appVerificationSecret?: string;
  appVersion?: string;
  appType?: string;
  appPlatform?: string;
  apiVersion?: string;
  deviceId?: string;
  cultureId?: string;
  debug?: boolean;
}

export interface AuthState {
  /** Encrypted token from RegisterMobileNo - used as Bearer token */
  bearerToken: string;
  /** API credentials from ValidateMobileNo */
  apiKey: string;
  apiSecret: string;
  /** Farmer details (can be multiple) */
  farmers: FarmerDetail[];
  /** Society data */
  society: SocietyData | null;
  /** Pashudhan JWT token */
  pashudhanToken: string | null;
  isAuthenticated: boolean;
}

// ============== PashuGPT API Types (NEW - for Chatbot) ==============

/**
 * Farmer details from PashuGPT API
 * Endpoint: GetFarmerDetailsByMobile
 */
export interface PashuGPTFarmerDetails {
  state: string;
  district: string;
  subDistrict: string;
  village: string;
  unionName: string;
  societyName: string;
  farmerName: string;
  mobileNumber: string;
  farmerCode: string;
  avgMilkPerDayInLiter: number;
  totalAnimals: number;
  cow: number;
  buffalo: number;
  totalMilkingAnimals: number;
}

/**
 * Breeding activity details
 */
export interface BreedingActivity {
  lastAI: string | null;
  lastPD: string | null;
  lastCalving: string | null;
  calfTagNo: string | null;
  calfMale: number;
  calfFemale: number;
}

/**
 * Animal details from PashuGPT API
 * Endpoint: GetAnimalDetailsByTagNo
 */
export interface PashuGPTAnimalDetails {
  tagNumber: string;
  animalType: string;  // "Buffalo" | "Cow"
  breed: string;       // "Mehsana" | "Gir" | "HF Cross" etc.
  milkingStage: string;  // "Milking" | "Dry"
  pregnancyStage: string;  // "Non Pregnant" | "Pregnant"
  dateOfBirth: string;
  lactationNo: number;
  lastBreedingActivity: BreedingActivity;
  lastHealthActivity: unknown | null;
}
