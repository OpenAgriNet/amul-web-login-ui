/**
 * Amul API End-to-End Flow Example (JavaScript)
 *
 * This standalone JavaScript example demonstrates the complete authentication
 * and data retrieval flow for the Amul Milk Producer App API.
 *
 * Usage:
 *   node examples/end-to-end-flow.js
 *
 * With environment variables:
 *   AMUL_MOBILE=9876543210 AMUL_OTP=123456 node examples/end-to-end-flow.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ============== API Constants ==============

const BASE_URLS = {
  FARMER_API: 'https://farmer.amulamcs.com/farmer/',
  PASHUDHAN_API: 'https://pashudhanapi.amulamcs.com/v1/api/',
  PASHUDHAN_USERS: 'https://pashudhanapi.amulamcs.com/v1/Users/',
};

const APP_CONSTANTS = {
  APP_KEY: '20259FF4-9774-4E2D-9542-EAA16752C896',
  API_VERSION: '1.0.1',
  APP_VERSION: '3.0.4',
  APP_TYPE: '3',
  APP_PLATFORM: '3',
  OS_TYPE: '0',
  PASHUDHAN_PLATFORM: '2',
};

const ENDPOINTS = {
  GET_API_URL: 'GetAPIUrl',
  VALIDATE_MOBILE: 'ValidateMobileNo',
  REGISTER_MOBILE: 'RegisterMobileNo',
  GET_FARMER_DETAIL: 'GetFarmerDetail',
  GET_SOCIETY_DATA: 'GetSocietyData',
  GET_FARMER_SETTING: 'GetFarmerSetting',
  GET_CATTLE_INFO: 'GetCattleInfo',
  GET_ALL_ITEM: 'GetAllItem',
  GET_UOM: 'GetUOM',
  GET_APP_MODULE_LIST: 'GetAppModuleList',
  GET_VERSION_DETAIL: 'GetVersionDetail',
};

// ============== API Client ==============

class AmulApiClient {
  constructor(config = {}) {
    this.config = {
      appKey: config.appKey || APP_CONSTANTS.APP_KEY,
      appVersion: config.appVersion || APP_CONSTANTS.APP_VERSION,
      appType: config.appType || APP_CONSTANTS.APP_TYPE,
      appPlatform: config.appPlatform || APP_CONSTANTS.APP_PLATFORM,
      osType: config.osType || APP_CONSTANTS.OS_TYPE,
      apiVersion: config.apiVersion || APP_CONSTANTS.API_VERSION,
      deviceId: config.deviceId || this.generateDeviceId(),
      fcmToken: config.fcmToken || '',
      debug: config.debug || false,
    };

    this.authState = {
      tokenNo: '',
      farmerDetail: null,
      societyData: null,
      pashudhanToken: null,
      isAuthenticated: false,
    };

    this.baseUrl = BASE_URLS.FARMER_API;
  }

  generateDeviceId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  log(message, data) {
    if (this.config.debug) {
      console.log(`[AmulSDK] ${message}`, data || '');
    }
  }

  getDefaultHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-apiversion': this.config.apiVersion,
      'AppVersion': this.config.appVersion,
      'APPPlatForm': this.config.appPlatform,
      'AppType': this.config.appType,
    };
  }

  async request(endpoint, body, customHeaders = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = { ...this.getDefaultHeaders(), ...customHeaders };

    this.log(`POST ${url}`, body);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    this.log(`Response from ${endpoint}`, data);

    return data;
  }

  async pashudhanRequest(endpoint, body, useUsersApi = false) {
    const baseUrl = useUsersApi ? BASE_URLS.PASHUDHAN_USERS : BASE_URLS.PASHUDHAN_API;
    const url = `${baseUrl}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.authState.pashudhanToken) {
      headers['Authorization'] = `Bearer ${this.authState.pashudhanToken}`;
    }

    this.log(`POST ${url}`, body);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    this.log(`Response from ${endpoint}`, data);

    return data;
  }

  // Authentication Methods

  async getApiUrl(mobileNo) {
    const body = {
      MobileNo: mobileNo,
      ApiVersion: this.config.apiVersion,
      AppType: this.config.appType,
      APPPlatForm: this.config.appPlatform,
      AppVersion: this.config.appVersion,
    };

    const response = await this.request(ENDPOINTS.GET_API_URL, body);

    if (response.StatusCode === 200 && response.Data?.Url) {
      this.baseUrl = response.Data.Url;
      this.log('Base URL updated', this.baseUrl);
    }

    return response;
  }

  async sendOtp(mobileNo) {
    const body = {
      pMobileNo: mobileNo,
      pAppKey: this.config.appKey,
      pAppType: this.config.appType,
      pOsType: this.config.osType,
    };

    return this.request(ENDPOINTS.VALIDATE_MOBILE, body);
  }

  async verifyOtp(mobileNo, otp, deviceInfo = {}) {
    const body = {
      pMobileNo: mobileNo,
      pOTP: otp,
      pDeviceId: this.config.deviceId,
      pAppKey: this.config.appKey,
      pAppNotificationId: this.config.fcmToken,
      pAppType: this.config.appType,
      pOsType: this.config.osType,
      pAppVersion: this.config.appVersion,
      pModel: deviceInfo.pModel || 'Generic',
      pOSVersion: deviceInfo.pOSVersion || 'Android 11',
      pScreenResolution: deviceInfo.pScreenResolution || '1080x1920',
      pOperator: deviceInfo.pOperator || 'Unknown',
      pIMEI: deviceInfo.pIMEI || '',
    };

    const response = await this.request(ENDPOINTS.REGISTER_MOBILE, body);

    if (response.StatusCode === 1 && response.Data) {
      this.authState.tokenNo = response.Data.TokenNo;
      this.authState.isAuthenticated = true;
      this.authState.farmerDetail = response.Data;
      this.log('Authentication successful', { tokenNo: response.Data.TokenNo });
    }

    return response;
  }

  setToken(tokenNo) {
    this.authState.tokenNo = tokenNo;
    this.authState.isAuthenticated = true;
  }

  getAuthState() {
    return { ...this.authState };
  }

  // Data Methods

  async getFarmerDetail(lang = 'en-US') {
    this.requireAuth();

    const response = await this.request(ENDPOINTS.GET_FARMER_DETAIL, {
      pTokenNo: this.authState.tokenNo,
      pLang: lang,
    });

    if (response.StatusCode === 1 && response.Data) {
      this.authState.farmerDetail = response.Data;
    }

    return response;
  }

  async getSocietyData(lang = 'en-US') {
    this.requireAuth();

    const response = await this.request(ENDPOINTS.GET_SOCIETY_DATA, {
      pTokenNo: this.authState.tokenNo,
      pLang: lang,
    });

    if (response.StatusCode === 1 && response.Data) {
      this.authState.societyData = response.Data;
    }

    return response;
  }

  async getFarmerSettings(lang = 'en-US') {
    this.requireAuth();
    return this.request(ENDPOINTS.GET_FARMER_SETTING, {
      pTokenNo: this.authState.tokenNo,
      pLang: lang,
    });
  }

  async getCattleInfo(lang = 'en-US') {
    this.requireAuth();
    return this.request(ENDPOINTS.GET_CATTLE_INFO, {
      pTokenNo: this.authState.tokenNo,
      pLang: lang,
    });
  }

  async getAllItems(lang = 'en-US') {
    this.requireAuth();
    return this.request(ENDPOINTS.GET_ALL_ITEM, {
      pTokenNo: this.authState.tokenNo,
      pLang: lang,
    });
  }

  async getUOM(lang = 'en-US') {
    this.requireAuth();
    return this.request(ENDPOINTS.GET_UOM, {
      pTokenNo: this.authState.tokenNo,
      pLang: lang,
    });
  }

  async getAppModuleList(lang = 'en-US') {
    this.requireAuth();
    return this.request(ENDPOINTS.GET_APP_MODULE_LIST, {
      pTokenNo: this.authState.tokenNo,
      pLang: lang,
    });
  }

  // Pashudhan Methods

  async checkPashudhanConnection() {
    return this.pashudhanRequest('CheckConnection', {}, true);
  }

  async authenticatePashudhan() {
    this.requireAuth();

    if (!this.authState.farmerDetail) {
      throw new Error('Farmer detail not loaded. Call getFarmerDetail first.');
    }

    const farmer = this.authState.farmerDetail;
    const society = this.authState.societyData;

    const body = {
      MobileNo: farmer.MobileNo,
      DeviceId: this.config.deviceId,
      FCMToken: this.config.fcmToken,
      EmailId: farmer.Email || '',
      Platform: APP_CONSTANTS.PASHUDHAN_PLATFORM,
      UniqueId: farmer.FarmerId,
      UserName: farmer.FarmerName,
      AMCSToken: this.authState.tokenNo,
      UnionCode: farmer.UnionCode,
      UnionName: farmer.UnionName,
      FarmerCode: farmer.FarmerCode,
      SocityCode: society?.SocietyCode || farmer.SocietyCode,
      WhatsAppNo: farmer.MobileNo,
      PushNotificationFCMId: this.config.fcmToken,
    };

    const response = await this.pashudhanRequest('Authentication/authenticateFarmer', body);

    if (response.isSuccess && response.data?.Token) {
      this.authState.pashudhanToken = response.data.Token;
      this.log('Pashudhan authentication successful');
    }

    return response;
  }

  // Helpers

  requireAuth() {
    if (!this.authState.isAuthenticated || !this.authState.tokenNo) {
      throw new Error('Authentication required. Call sendOtp and verifyOtp first.');
    }
  }

  isAuthenticated() {
    return this.authState.isAuthenticated;
  }
}

// ============== Data Storage ==============

function saveData(outputDir, filename, data) {
  const outputPath = path.join(outputDir, filename);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`Saved: ${outputPath}`);
}

// ============== Interactive Input ==============

async function promptForInput(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// ============== Main Flow ==============

async function main() {
  console.log('='.repeat(60));
  console.log('Amul API End-to-End Flow (JavaScript)');
  console.log('='.repeat(60));

  const outputDir = './data';
  const debug = true;

  // Initialize client
  const client = new AmulApiClient({
    debug,
    deviceId: 'sdk-example-device-js-001',
  });

  try {
    // Get mobile number
    let mobileNo = process.env.AMUL_MOBILE;
    if (!mobileNo) {
      mobileNo = await promptForInput('Enter mobile number: ');
    }
    console.log(`\nMobile: ${mobileNo}`);

    // Step 1: Get API URL configuration
    console.log('\n--- Step 1: Getting API Configuration ---');
    const apiUrlResponse = await client.getApiUrl(mobileNo);

    if (apiUrlResponse.StatusCode !== 200) {
      console.error('Failed to get API URL:', apiUrlResponse.Message);
      return;
    }
    console.log('API URL:', apiUrlResponse.Data?.Url);
    console.log('User Type:', apiUrlResponse.Data?.UserType);

    // Step 2: Send OTP
    console.log('\n--- Step 2: Sending OTP ---');
    const otpResponse = await client.sendOtp(mobileNo);

    if (otpResponse.StatusCode !== 1) {
      console.error('Failed to send OTP:', otpResponse.Message);
      console.error('Status Code:', otpResponse.StatusCode);
      return;
    }
    console.log('OTP sent successfully!');
    console.log('Farmer ID:', otpResponse.Data?.FarmerId);

    // Step 3: Get OTP from user or env
    let otp = process.env.AMUL_OTP;
    if (!otp) {
      otp = await promptForInput('Enter OTP received on your phone: ');
    }

    // Step 4: Verify OTP and authenticate
    console.log('\n--- Step 3: Verifying OTP ---');
    const authResponse = await client.verifyOtp(mobileNo, otp, {
      pModel: 'SDK-Example-JS',
      pOSVersion: 'Node.js',
    });

    if (authResponse.StatusCode !== 1 || !authResponse.Data) {
      console.error('Authentication failed:', authResponse.Message);
      return;
    }

    console.log('Authentication successful!');
    console.log('Farmer Name:', authResponse.Data.FarmerName);
    console.log('Farmer Code:', authResponse.Data.FarmerCode);
    console.log('Society:', authResponse.Data.SocietyName);
    console.log('Token:', authResponse.Data.TokenNo.substring(0, 20) + '...');

    // Step 5: Fetch all farmer data
    console.log('\n--- Step 4: Fetching Farmer Data ---');

    const storedData = {
      timestamp: new Date().toISOString(),
      farmer: null,
      society: null,
      settings: null,
      cattleInfo: null,
      modules: null,
      items: null,
      uom: null,
      pashudhan: null,
    };

    // Get farmer detail
    console.log('Fetching farmer details...');
    const farmerDetail = await client.getFarmerDetail('en-US');
    if (farmerDetail.Data) {
      storedData.farmer = farmerDetail.Data;
      console.log('  - Farmer ID:', farmerDetail.Data.FarmerId);
      console.log('  - Name:', farmerDetail.Data.FarmerName);
      console.log('  - Bank:', farmerDetail.Data.BankName);
      console.log('  - Account:', farmerDetail.Data.BankAccountNo);
    }

    // Get society data
    console.log('Fetching society data...');
    const societyData = await client.getSocietyData('en-US');
    if (societyData.Data) {
      storedData.society = societyData.Data;
      console.log('  - Society:', societyData.Data.SocietyName);
      console.log('  - Union:', societyData.Data.UnionName);
      console.log('  - District:', societyData.Data.DistrictName);
      console.log('  - Pashudhan Enabled:', societyData.Data.IsPashudhanEnabled ? 'Yes' : 'No');
    }

    // Get farmer settings
    console.log('Fetching farmer settings...');
    const settings = await client.getFarmerSettings('en-US');
    storedData.settings = settings.Data;
    console.log('  - Settings count:', Array.isArray(settings.Data) ? settings.Data.length : 0);

    // Get cattle info
    console.log('Fetching cattle info...');
    const cattleInfo = await client.getCattleInfo('en-US');
    storedData.cattleInfo = cattleInfo.Data;
    console.log('  - Cattle count:', Array.isArray(cattleInfo.Data) ? cattleInfo.Data.length : 0);

    // Get app modules
    console.log('Fetching app modules...');
    const modules = await client.getAppModuleList('en-US');
    storedData.modules = modules.Data;
    console.log('  - Modules count:', Array.isArray(modules.Data) ? modules.Data.length : 0);

    // Get items
    console.log('Fetching items...');
    const items = await client.getAllItems('en-US');
    storedData.items = items.Data;
    console.log('  - Items count:', Array.isArray(items.Data) ? items.Data.length : 0);

    // Get UOM
    console.log('Fetching UOM...');
    const uom = await client.getUOM('en-US');
    storedData.uom = uom.Data;
    console.log('  - UOM count:', Array.isArray(uom.Data) ? uom.Data.length : 0);

    // Step 6: Authenticate with Pashudhan API
    console.log('\n--- Step 5: Pashudhan Authentication ---');

    const pashudhanConn = await client.checkPashudhanConnection();
    console.log('Pashudhan Connection:', pashudhanConn.isSuccess ? 'OK' : 'Failed');

    if (pashudhanConn.isSuccess) {
      const pashudhanAuth = await client.authenticatePashudhan();
      if (pashudhanAuth.isSuccess && pashudhanAuth.data) {
        storedData.pashudhan = pashudhanAuth.data;
        console.log('  - Pashudhan User ID:', pashudhanAuth.data.UserId);
        console.log('  - JWT Token:', pashudhanAuth.data.Token?.substring(0, 30) + '...');
      }
    }

    // Step 7: Save all data
    console.log('\n--- Step 6: Saving Data ---');
    saveData(outputDir, 'farmer-data.json', storedData);
    saveData(outputDir, 'farmer-detail.json', storedData.farmer);
    saveData(outputDir, 'society-data.json', storedData.society);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('Data Collection Complete!');
    console.log('='.repeat(60));
    console.log(`Farmer: ${authResponse.Data.FarmerName}`);
    console.log(`Society: ${authResponse.Data.SocietyName}`);
    console.log(`Output: ${outputDir}/`);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run
main().catch(console.error);
