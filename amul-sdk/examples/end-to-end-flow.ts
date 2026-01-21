/**
 * Amul API End-to-End Flow Example
 *
 * This example demonstrates the complete authentication and data retrieval flow
 * for the Amul Milk Producer App API.
 *
 * Usage:
 *   npx ts-node examples/end-to-end-flow.ts
 *
 * Or with environment variables:
 *   AMUL_MOBILE=9876543210 AMUL_OTP=123456 npx ts-node examples/end-to-end-flow.ts
 */

import { AmulApiClient, StatusCodes, LANGUAGES } from '../src';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// ============== Configuration ==============

interface Config {
  mobileNo: string;
  otp?: string;
  outputDir: string;
  debug: boolean;
}

const config: Config = {
  mobileNo: process.env.AMUL_MOBILE || '',
  otp: process.env.AMUL_OTP,
  outputDir: './data',
  debug: true,
};

// ============== Data Storage ==============

interface StoredData {
  timestamp: string;
  farmer: unknown;
  society: unknown;
  settings: unknown;
  cattleInfo: unknown;
  modules: unknown;
  items: unknown;
  uom: unknown;
  pashudhan: unknown;
}

function saveData(filename: string, data: unknown): void {
  const outputPath = path.join(config.outputDir, filename);
  fs.mkdirSync(config.outputDir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`Saved: ${outputPath}`);
}

// ============== Interactive OTP Input ==============

async function promptForInput(prompt: string): Promise<string> {
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
  console.log('Amul API End-to-End Flow');
  console.log('='.repeat(60));

  // Initialize client
  const client = new AmulApiClient({
    debug: config.debug,
    deviceId: 'sdk-example-device-001',
  });

  try {
    // Step 1: Get mobile number
    let mobileNo = config.mobileNo;
    if (!mobileNo) {
      mobileNo = await promptForInput('Enter mobile number: ');
    }
    console.log(`\nMobile: ${mobileNo}`);

    // Step 2: Get API URL configuration
    console.log('\n--- Step 1: Getting API Configuration ---');
    const apiUrlResponse = await client.getApiUrl(mobileNo);

    if (apiUrlResponse.StatusCode !== 200) {
      console.error('Failed to get API URL:', apiUrlResponse.Message);
      return;
    }
    console.log('API URL:', apiUrlResponse.Data?.Url);
    console.log('User Type:', apiUrlResponse.Data?.UserType);

    // Step 3: Send OTP
    console.log('\n--- Step 2: Sending OTP ---');
    const otpResponse = await client.sendOtp(mobileNo);

    if (otpResponse.StatusCode !== StatusCodes.SUCCESS) {
      console.error('Failed to send OTP:', otpResponse.Message);
      console.error('Status Code:', otpResponse.StatusCode);
      return;
    }
    console.log('OTP sent successfully!');
    console.log('Farmer ID:', otpResponse.Data?.FarmerId);

    // Step 4: Get OTP from user or env
    let otp = config.otp;
    if (!otp) {
      otp = await promptForInput('Enter OTP received on your phone: ');
    }

    // Step 5: Verify OTP and authenticate
    console.log('\n--- Step 3: Verifying OTP ---');
    const authResponse = await client.verifyOtp(mobileNo, otp, {
      pModel: 'SDK-Example',
      pOSVersion: 'Node.js',
    });

    if (authResponse.StatusCode !== StatusCodes.SUCCESS || !authResponse.Data) {
      console.error('Authentication failed:', authResponse.Message);
      return;
    }

    console.log('Authentication successful!');
    console.log('Farmer Name:', authResponse.Data.FarmerName);
    console.log('Farmer Code:', authResponse.Data.FarmerCode);
    console.log('Society:', authResponse.Data.SocietyName);
    console.log('Token:', authResponse.Data.TokenNo.substring(0, 20) + '...');

    // Step 6: Fetch all farmer data
    console.log('\n--- Step 4: Fetching Farmer Data ---');

    const storedData: StoredData = {
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
    const farmerDetail = await client.getFarmerDetail(LANGUAGES.ENGLISH);
    if (farmerDetail.Data) {
      storedData.farmer = farmerDetail.Data;
      console.log('  - Farmer ID:', farmerDetail.Data.FarmerId);
      console.log('  - Name:', farmerDetail.Data.FarmerName);
      console.log('  - Bank:', farmerDetail.Data.BankName);
      console.log('  - Account:', farmerDetail.Data.BankAccountNo);
    }

    // Get society data
    console.log('Fetching society data...');
    const societyData = await client.getSocietyData(LANGUAGES.ENGLISH);
    if (societyData.Data) {
      storedData.society = societyData.Data;
      console.log('  - Society:', societyData.Data.SocietyName);
      console.log('  - Union:', societyData.Data.UnionName);
      console.log('  - District:', societyData.Data.DistrictName);
      console.log('  - Pashudhan Enabled:', societyData.Data.IsPashudhanEnabled ? 'Yes' : 'No');
    }

    // Get farmer settings
    console.log('Fetching farmer settings...');
    const settings = await client.getFarmerSettings(LANGUAGES.ENGLISH);
    storedData.settings = settings.Data;
    console.log('  - Settings count:', Array.isArray(settings.Data) ? settings.Data.length : 0);

    // Get cattle info
    console.log('Fetching cattle info...');
    const cattleInfo = await client.getCattleInfo(LANGUAGES.ENGLISH);
    storedData.cattleInfo = cattleInfo.Data;
    console.log('  - Cattle count:', Array.isArray(cattleInfo.Data) ? cattleInfo.Data.length : 0);

    // Get app modules
    console.log('Fetching app modules...');
    const modules = await client.getAppModuleList(LANGUAGES.ENGLISH);
    storedData.modules = modules.Data;
    console.log('  - Modules count:', Array.isArray(modules.Data) ? modules.Data.length : 0);

    // Get items
    console.log('Fetching items...');
    const items = await client.getAllItems(LANGUAGES.ENGLISH);
    storedData.items = items.Data;
    console.log('  - Items count:', Array.isArray(items.Data) ? items.Data.length : 0);

    // Get UOM
    console.log('Fetching UOM...');
    const uom = await client.getUOM(LANGUAGES.ENGLISH);
    storedData.uom = uom.Data;
    console.log('  - UOM count:', Array.isArray(uom.Data) ? uom.Data.length : 0);

    // Step 7: Authenticate with Pashudhan API
    console.log('\n--- Step 5: Pashudhan Authentication ---');

    // Check connection first
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

    // Step 8: Save all data
    console.log('\n--- Step 6: Saving Data ---');
    saveData('farmer-data.json', storedData);
    saveData('farmer-detail.json', storedData.farmer);
    saveData('society-data.json', storedData.society);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('Data Collection Complete!');
    console.log('='.repeat(60));
    console.log(`Farmer: ${authResponse.Data.FarmerName}`);
    console.log(`Society: ${authResponse.Data.SocietyName}`);
    console.log(`Output: ${config.outputDir}/`);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run
main().catch(console.error);
