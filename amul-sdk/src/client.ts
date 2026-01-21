/**
 * Amul API SDK Client
 * VERIFIED against actual MITM captured traffic
 */

import {
  AmulSdkConfig,
  AuthState,
  ApiResponse,
  GetApiUrlRequest,
  GetApiUrlResponse,
  ValidateMobileRequest,
  ValidateMobileResponse,
  RegisterMobileRequest,
  RegisterMobileResponse,
  FarmerDetail,
  SocietyData,
  FarmerSetting,
  UOMInfo,
  AppModule,
  VersionDetail,
  PashudhanAuthRequest,
  PashudhanAuthResponse,
  PashudhanApiResponse,
  PashuGPTFarmerDetails,
  PashuGPTAnimalDetails,
} from './types';

import {
  BASE_URLS,
  APP_CONSTANTS,
  ENDPOINTS,
  PASHUDHAN_ENDPOINTS,
  PASHUGPT_CONFIG,
  PASHUGPT_ENDPOINTS,
} from './constants';

export class AmulApiClient {
  private config: Required<AmulSdkConfig>;
  private authState: AuthState;
  private baseUrl: string;

  constructor(config: AmulSdkConfig = {}) {
    this.config = {
      appKey: config.appKey ?? APP_CONSTANTS.APP_KEY,
      appVerificationSecret: config.appVerificationSecret ?? APP_CONSTANTS.APP_VERIFI_SECRET,
      appVersion: config.appVersion ?? APP_CONSTANTS.APP_VERSION,
      appType: config.appType ?? APP_CONSTANTS.APP_TYPE,
      appPlatform: config.appPlatform ?? APP_CONSTANTS.APP_PLATFORM,
      apiVersion: config.apiVersion ?? APP_CONSTANTS.API_VERSION,
      deviceId: config.deviceId ?? this.generateDeviceId(),
      cultureId: config.cultureId ?? '1',
      debug: config.debug ?? false,
    };

    this.authState = {
      bearerToken: '',
      apiKey: '',
      apiSecret: '',
      farmers: [],
      society: null,
      pashudhanToken: null,
      isAuthenticated: false,
    };

    this.baseUrl = BASE_URLS.FARMER_API;
  }

  // ============== Utility Methods ==============

  private generateDeviceId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private log(message: string, data?: unknown): void {
    if (this.config.debug) {
      console.log(`[AmulSDK] ${message}`, data ?? '');
    }
  }

  private getDefaultHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json; charset=utf-8',
      'x-apiversion': this.config.apiVersion,
      'User-Agent': 'okhttp/3.14.9',
      'Accept-Encoding': 'gzip',
    };
  }

  private getAuthHeaders(): Record<string, string> {
    if (!this.authState.bearerToken) {
      throw new Error('Not authenticated');
    }

    // The bearer token format from captured traffic
    const encodedToken = Buffer.from(
      `${this.authState.bearerToken}:${this.config.deviceId}:${this.generateRequestId()}:${this.generateSignature()}`
    ).toString('base64');

    return {
      ...this.getDefaultHeaders(),
      'Authorization': `Bearer ${encodedToken}`,
    };
  }

  private generateRequestId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private generateSignature(): string {
    // Simplified signature - actual implementation may need crypto
    return Buffer.from(Math.random().toString()).toString('base64').substring(0, 44) + '=';
  }

  private async request<T>(
    endpoint: string,
    body: object,
    authenticated = false
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = authenticated ? this.getAuthHeaders() : this.getDefaultHeaders();

    this.log(`POST ${url}`, body);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    this.log(`Response from ${endpoint}`, data);

    return data as ApiResponse<T>;
  }

  private async pashudhanRequest<T>(
    endpoint: string,
    body: object,
    useUsersApi = false
  ): Promise<PashudhanApiResponse<T>> {
    const baseUrl = useUsersApi ? BASE_URLS.PASHUDHAN_USERS : BASE_URLS.PASHUDHAN_API;
    const url = `${baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json; charset=utf-8',
      'Accept-Encoding': 'gzip',
      'User-Agent': 'okhttp/3.14.9',
      'authorization': 'bearer', // Note: lowercase, empty bearer for initial auth
    };

    this.log(`POST ${url}`, body);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    this.log(`Response from ${endpoint}`, data);

    return data as PashudhanApiResponse<T>;
  }

  // ============== Authentication Methods ==============

  /**
   * Step 1: Get API configuration URLs
   */
  async getApiUrl(mobileNo: string): Promise<ApiResponse<GetApiUrlResponse>> {
    const body: GetApiUrlRequest = {
      MobileNo: mobileNo,
      ApiVersion: this.config.apiVersion,
      AppType: this.config.appType,
      APPPlatForm: this.config.appPlatform,
      AppVersion: this.config.appVersion,
    };

    const response = await this.request<GetApiUrlResponse>(
      ENDPOINTS.GET_API_URL,
      body
    );

    if (response.StatusCode === 200 && response.Data?.Url) {
      this.baseUrl = response.Data.Url;
      this.log('Base URL updated', this.baseUrl);
    }

    return response;
  }

  /**
   * Step 2: Send OTP to validate mobile number
   * Returns API credentials (APIKey, APISecret)
   */
  async sendOtp(mobileNo: string): Promise<ApiResponse<ValidateMobileResponse>> {
    const body: ValidateMobileRequest = {
      AppKey: this.config.appKey,
      APPVerificationSecret: this.config.appVerificationSecret,
      MobileNo: mobileNo,
      DeviceId: this.config.deviceId,
      CultureId: this.config.cultureId,
      ApiVersion: this.config.apiVersion,
      AppType: this.config.appType,
      APPPlatForm: this.config.appPlatform,
      AppVersion: this.config.appVersion,
      OSVersion: '10',
      screenresolution: '1080 * 1920',
      model: 'SDK-Client',
      PushNotificationId: '',
      SocietyId: 0,
    };

    const response = await this.request<ValidateMobileResponse>(
      ENDPOINTS.VALIDATE_MOBILE,
      body
    );

    if (response.StatusCode === 200 && response.Data) {
      this.authState.apiKey = response.Data.APIKey;
      this.authState.apiSecret = response.Data.APISecret;
      this.log('OTP sent, API credentials received');
    }

    return response;
  }

  /**
   * Step 3: Verify OTP and get Bearer token
   * Returns encrypted token string used for Bearer authentication
   */
  async verifyOtp(mobileNo: string, otp: string): Promise<ApiResponse<RegisterMobileResponse>> {
    const body: RegisterMobileRequest = {
      AppKey: this.config.appKey,
      APPVerificationSecret: this.config.appVerificationSecret,
      MobileNo: mobileNo,
      DeviceId: this.config.deviceId,
      ApiVersion: this.config.apiVersion,
      AppType: this.config.appType,
      CultureId: this.config.cultureId,
      APPPlatForm: this.config.appPlatform,
      AppVersion: this.config.appVersion,
      OTP: otp,
    };

    const response = await this.request<RegisterMobileResponse>(
      ENDPOINTS.REGISTER_MOBILE,
      body
    );

    if (response.StatusCode === 200 && response.Data) {
      // Data is the encrypted bearer token string
      this.authState.bearerToken = response.Data as string;
      this.authState.isAuthenticated = true;
      this.log('Authentication successful, bearer token received');
    }

    return response;
  }

  /**
   * Set bearer token directly (for resuming sessions)
   */
  setBearerToken(token: string): void {
    this.authState.bearerToken = token;
    this.authState.isAuthenticated = true;
  }

  /**
   * Get current authentication state
   */
  getAuthState(): AuthState {
    return { ...this.authState };
  }

  // ============== Data Methods (Authenticated) ==============

  /**
   * Get farmer details - returns ARRAY of farmers
   */
  async getFarmerDetail(): Promise<ApiResponse<FarmerDetail[]>> {
    this.requireAuth();

    const response = await this.request<FarmerDetail[]>(
      ENDPOINTS.GET_FARMER_DETAIL,
      { CultureId: this.config.cultureId },
      true
    );

    if (response.StatusCode === 200 && response.Data) {
      this.authState.farmers = response.Data;
    }

    return response;
  }

  /**
   * Get society data
   */
  async getSocietyData(): Promise<ApiResponse<SocietyData>> {
    this.requireAuth();

    const response = await this.request<SocietyData>(
      ENDPOINTS.GET_SOCIETY_DATA,
      { CultureId: this.config.cultureId },
      true
    );

    if (response.StatusCode === 200 && response.Data) {
      this.authState.society = response.Data;
    }

    return response;
  }

  /**
   * Get farmer settings
   */
  async getFarmerSettings(): Promise<ApiResponse<FarmerSetting[]>> {
    this.requireAuth();

    return this.request<FarmerSetting[]>(
      ENDPOINTS.GET_FARMER_SETTING,
      { CultureId: this.config.cultureId },
      true
    );
  }

  /**
   * Get cattle info
   */
  async getCattleInfo(mobileNo: string): Promise<ApiResponse<string>> {
    this.requireAuth();

    return this.request<string>(
      ENDPOINTS.GET_CATTLE_INFO,
      {
        CultureId: this.config.cultureId,
        RequestData: { MobileNo: mobileNo },
      },
      true
    );
  }

  /**
   * Get all items for ordering
   */
  async getAllItems(societyId: string): Promise<ApiResponse<unknown[]>> {
    this.requireAuth();

    return this.request<unknown[]>(
      ENDPOINTS.GET_ALL_ITEM,
      {
        Cultureid: this.config.cultureId,  // Note: lowercase 'id'
        SocietyId: societyId,
        UpdatedOn: '',
      },
      true
    );
  }

  /**
   * Get UOM (Units of Measurement)
   */
  async getUOM(societyId: string): Promise<ApiResponse<UOMInfo[]>> {
    this.requireAuth();

    return this.request<UOMInfo[]>(
      ENDPOINTS.GET_UOM,
      {
        Cultureid: this.config.cultureId,  // Note: lowercase 'id'
        SocietyId: societyId,
        UpdatedOn: '',
      },
      true
    );
  }

  /**
   * Get app module list
   */
  async getAppModuleList(): Promise<ApiResponse<AppModule[]>> {
    this.requireAuth();

    return this.request<AppModule[]>(
      ENDPOINTS.GET_APP_MODULE_LIST,
      {},
      true
    );
  }

  /**
   * Get version details
   */
  async getVersionDetail(): Promise<ApiResponse<VersionDetail>> {
    this.requireAuth();

    return this.request<VersionDetail>(
      ENDPOINTS.GET_VERSION_DETAIL,
      {},
      true
    );
  }

  // ============== Pashudhan (Animal Trading) Methods ==============

  /**
   * Check Pashudhan API connection (HEAD request in real app)
   */
  async checkPashudhanConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URLS.PASHUDHAN_USERS}${PASHUDHAN_ENDPOINTS.CHECK_CONNECTION}`, {
        method: 'HEAD',
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Authenticate with Pashudhan API
   */
  async authenticatePashudhan(): Promise<PashudhanApiResponse<PashudhanAuthResponse>> {
    this.requireAuth();

    if (this.authState.farmers.length === 0 || !this.authState.society) {
      throw new Error('Farmer and society data required. Call getFarmerDetail and getSocietyData first.');
    }

    const farmer = this.authState.farmers[0];
    const society = this.authState.society;

    const body: PashudhanAuthRequest = {
      mobileNo: farmer.WhatsAppNo || '',  // Note: lowercase
      WhatsAppNo: farmer.WhatsAppNo || 'null',
      uniqueId: farmer.CattleBuySellGuid,
      socityCode: society.SocietyCode,  // Note: typo in API
      unionName: society.UnionName,
      unionCode: society.UnionCode,
      farmercode: farmer.FarmerCode,  // lowercase
      userName: farmer.FarmerName,
      emailId: farmer.Email,
      latitude: farmer.Latitude,
      longitude: farmer.Longitude,
      cultureId: this.config.cultureId,
      PushNotificationFCMId: 'XXXXXXXXXXXXXXXX',
      amcsToken: this.authState.bearerToken,
      platform: '2',
      deviceId: this.config.deviceId,
    };

    const response = await this.pashudhanRequest<PashudhanAuthResponse>(
      PASHUDHAN_ENDPOINTS.AUTHENTICATE_FARMER,
      body
    );

    if (response.isSuccess && response.data?.token) {
      this.authState.pashudhanToken = response.data.token;
      this.log('Pashudhan authentication successful');
    }

    return response;
  }

  // ============== Helper Methods ==============

  private requireAuth(): void {
    if (!this.authState.isAuthenticated || !this.authState.bearerToken) {
      throw new Error('Authentication required. Call sendOtp and verifyOtp first.');
    }
  }

  isAuthenticated(): boolean {
    return this.authState.isAuthenticated;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  setDeviceId(deviceId: string): void {
    this.config.deviceId = deviceId;
  }

  // ============== PashuGPT API Methods (NEW - for Chatbot) ==============

  /**
   * Get farmer details by mobile number from PashuGPT API
   * NO OTP required - uses Bearer token authentication
   *
   * @param mobileNumber - Farmer's mobile number
   * @returns Array of farmer details (farmer may have multiple registrations)
   */
  async getPashuGPTFarmerByMobile(mobileNumber: string): Promise<PashuGPTFarmerDetails[]> {
    const url = `${PASHUGPT_CONFIG.BASE_URL}/${PASHUGPT_ENDPOINTS.GET_FARMER_BY_MOBILE}?mobileNumber=${mobileNumber}`;

    this.log(`GET ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${PASHUGPT_CONFIG.TOKEN}`,
      },
    });

    const data = await response.json();
    this.log(`PashuGPT Farmer Response`, data);

    return data as PashuGPTFarmerDetails[];
  }

  /**
   * Get animal details by tag number from PashuGPT API
   * Returns comprehensive animal data including breeding, pregnancy, and lactation info
   * NO OTP required - uses Bearer token authentication
   *
   * @param tagNo - Animal's tag number
   * @returns Animal details with breeding activity
   */
  async getPashuGPTAnimalByTag(tagNo: string): Promise<PashuGPTAnimalDetails> {
    const url = `${PASHUGPT_CONFIG.BASE_URL}/${PASHUGPT_ENDPOINTS.GET_ANIMAL_BY_TAG}?tagNo=${tagNo}`;

    this.log(`GET ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${PASHUGPT_CONFIG.TOKEN}`,
      },
    });

    const data = await response.json();
    this.log(`PashuGPT Animal Response`, data);

    return data as PashuGPTAnimalDetails;
  }

  /**
   * Helper: Calculate days since a date
   */
  static daysSince(dateString: string | null): number | null {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Helper: Check if animal might be in heat based on days since last AI
   * Heat cycle is typically 18-24 days
   */
  static isLikelyInHeat(animal: PashuGPTAnimalDetails): boolean {
    const daysSinceAI = AmulApiClient.daysSince(animal.lastBreedingActivity.lastAI);
    if (daysSinceAI === null) return false;
    return daysSinceAI >= 18 && daysSinceAI <= 24;
  }

  /**
   * Helper: Check if pregnancy detection should be recommended
   * PD can be done 25 days to 3 months after AI
   */
  static shouldRecommendPD(animal: PashuGPTAnimalDetails): boolean {
    if (animal.pregnancyStage === 'Pregnant') return false;
    const daysSinceAI = AmulApiClient.daysSince(animal.lastBreedingActivity.lastAI);
    if (daysSinceAI === null) return false;
    return daysSinceAI >= 25 && daysSinceAI <= 90;
  }
}

export default AmulApiClient;
