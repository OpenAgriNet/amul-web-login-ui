/**
 * Amul API SDK Constants
 * Extracted from APK decompilation and verified via MITM capture
 */

// ============== API Base URLs ==============

export const BASE_URLS = {
  /** Main Farmer API */
  FARMER_API: 'https://farmer.amulamcs.com/farmer/',

  /** Dynamic Farmer API (from GetAPIUrl) */
  FARMER_DYNAMIC: 'https://farmer.amulamcs.com/',

  /** Item Order API (Production) */
  ITEM_ORDER_PROD: 'https://itemorderapi.amulamcs.com/api/farmer/',

  /** Item Order API (Test) */
  ITEM_ORDER_TEST: 'https://testitemorderapi.amulamcs.com/api/Farmer/',

  /** Pashudhan (Animal Trading) API */
  PASHUDHAN_API: 'https://pashudhanapi.amulamcs.com/v1/api/',

  /** Pashudhan Users API */
  PASHUDHAN_USERS: 'https://pashudhanapi.amulamcs.com/v1/Users/',

  /** Amul Pashudhan Identity API */
  PASHUDHAN_IDENTITY: 'https://api.amulpashudhan.com/identity/v1/AHFarmerUserApp/',

  /** Manual/Docs API */
  MANUAL_API: 'https://api.amulamcs.com/Manual/',
} as const;

// ============== Application Constants ==============

export const APP_CONSTANTS = {
  /** Application Key - Used for API authentication */
  APP_KEY: '20259FF4-9774-4E2D-9542-EAA16752C896',

  /** App Verification Secret (RSA encrypted) */
  APP_VERIFI_SECRET: 'Cdqaecg+MSQkpBAFDl5afOK740u1pL1xD+xrahJgQyKWU7tT0zKnmSrL7CVMDJMJWgS5JqIEgqFEKg0lXkYA03eC+4UO+amo17+93vtR+MarSgEzaEAoClSiNa5AduUWewN7Vv41688ZoeJmr9F3mvMsjJp7S8Z16DQhwz1sSHM004uq9N/iYQm1BsP22zONti/ciP9TuCzVMmjGuslOIPQEo9ubRrox2aDYkhlKjLsqNxC0CUEIpIDCvSkw7+qnTUy3prQ2ID21/W/+ohLuDJVXulRpcIzaqTEVcLsnMCY0vVfvzfqBGPw8lbYstAfcyHvPvaWx1BlTJo6GZAcdgQ==',

  /** API Version */
  API_VERSION: '1.0.1',

  /** App Version (from APK) */
  APP_VERSION: '3.0.4',

  /** Version Code */
  VERSION_CODE: 69,

  /** App Type - Farmer App = 3 */
  APP_TYPE: '3',

  /** App Platform - Farmer App = 3 */
  APP_PLATFORM: '3',

  /** OS Type - Android = 0 */
  OS_TYPE: '0',

  /** Pashudhan App Platform */
  PASHUDHAN_PLATFORM: '2',

  /** Default pagination size */
  PAGE_RECORD_COUNT: 10,
} as const;

// ============== API Endpoints ==============

/**
 * API Endpoints - VERIFIED from MITM capture
 * Note: GetAPIUrl uses /farmer/ path, subsequent calls use dynamic URL
 */
export const ENDPOINTS = {
  // Authentication (uses /farmer/ base)
  GET_API_URL: 'GetAPIUrl',  // Note: Called on BASE_URL with /farmer/

  // Authentication (uses dynamic URL from GetAPIUrl response)
  VALIDATE_MOBILE: 'ValidateMobileNo',
  REGISTER_MOBILE: 'RegisterMobileNo',

  // Farmer Data (authenticated, dynamic URL)
  GET_FARMER_DETAIL: 'GetFarmerDetail',
  GET_SOCIETY_DATA: 'GetSocietyData',
  GET_FARMER_SETTING: 'GetFarmerSetting',
  GET_VERSION_DETAIL: 'GetVersionDetail',
  GET_CATTLE_INFO: 'GetCattleInfo',

  // Items & Orders (authenticated, dynamic URL)
  GET_ALL_ITEM: 'GetAllItem',
  GET_UOM: 'GetUOM',
  GET_APP_MODULE_LIST: 'GetAppModuleList',
} as const;

// ============== Pashudhan Endpoints ==============

export const PASHUDHAN_ENDPOINTS = {
  // Authentication
  CHECK_CONNECTION: 'CheckConnection',
  AUTHENTICATE_FARMER: 'Authentication/authenticateFarmer',

  // Notifications
  GET_NOTIFICATION_LIST: 'Notification/GetNotificationList',
  SET_READ_NOTIFICATION: 'Notification/SetReadNotification',
} as const;

// ============== PashuGPT API (NEW - for Chatbot) ==============

export const PASHUGPT_CONFIG = {
  /** PashuGPT API Base URL */
  BASE_URL: 'https://api.amulpashudhan.com/configman/v1/PashuGPT',

  /** PashuGPT Bearer Token */
  TOKEN: 'REDACTED_PASHUGPT_TOKEN',
} as const;

export const PASHUGPT_ENDPOINTS = {
  /** Get farmer details by mobile number */
  GET_FARMER_BY_MOBILE: 'GetFarmerDetailsByMobile',

  /** Get animal details by tag number */
  GET_ANIMAL_BY_TAG: 'GetAnimalDetailsByTagNo',
} as const;

// ============== Item Order Endpoints ==============

export const ITEM_ORDER_ENDPOINTS = {
  GET_FARMER_ITEM_ORDER_LIST: 'GetFarmerItemOrderList',
  GET_FARMER_ITEM_ORDER_DETAIL: 'GetFarmerItemOrderListDetail',
  INSERT_ITEM_ORDER: 'InsertItemOrder',
} as const;

// ============== Default Headers ==============

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'x-apiversion': APP_CONSTANTS.API_VERSION,
  'AppVersion': APP_CONSTANTS.APP_VERSION,
  'APPPlatForm': APP_CONSTANTS.APP_PLATFORM,
  'AppType': APP_CONSTANTS.APP_TYPE,
} as const;

// ============== Shift Constants ==============

export const SHIFTS = {
  MORNING: 'Morning',
  EVENING: 'Evening',
  BOTH: 'Both',
} as const;

// ============== Chart Data Types ==============

export const CHART_X_AXIS = {
  DAILY: 1,
  MONTHLY: 2,
} as const;

export const CHART_Y_AXIS = {
  QUANTITY: 1,
  AMOUNT: 2,
} as const;

// ============== Language Codes ==============

export const LANGUAGES = {
  ENGLISH: 'en-US',
  GUJARATI: 'gu-IN',
  HINDI: 'hi-IN',
  MARATHI: 'mr-IN',
} as const;
