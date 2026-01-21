// Amul API Constants
const APP_KEY = '20259FF4-9774-4E2D-9542-EAA16752C896'
const APP_VERIFI_SECRET = 'Cdqaecg+MSQkpBAFDl5afOK740u1pL1xD+xrahJgQyKWU7tT0zKnmSrL7CVMDJMJWgS5JqIEgqFEKg0lXkYA03eC+4UO+amo17+93vtR+MarSgEzaEAoClSiNa5AduUWewN7Vv41688ZoeJmr9F3mvMsjJp7S8Z16DQhwz1sSHM004uq9N/iYQm1BsP22zONti/ciP9TuCzVMmjGuslOIPQEo9ubRrox2aDYkhlKjLsqNxC0CUEIpIDCvSkw7+qnTUy3prQ2ID21/W/+ohLuDJVXulRpcIzaqTEVcLsnMCY0vVfvzfqBGPw8lbYstAfcyHvPvaWx1BlTJo6GZAcdgQ=='
const API_VERSION = '1.0.1'
const APP_VERSION = '3.0.4'
const APP_TYPE = '3'
const APP_PLATFORM = '3'

// PashuGPT API Constants
const PASHUGPT_BASE_URL = 'https://api.amulpashudhan.com/configman/v1/PashuGPT'
const PASHUGPT_TOKEN = 'REDACTED_PASHUGPT_TOKEN'

// Generate random device ID
export function generateDeviceId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// ============== Main Amul APIs (OTP Required) ==============

export async function getApiUrl(mobileNo: string) {
  const response = await fetch('https://farmer.amulamcs.com/farmer/GetAPIUrl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-apiversion': API_VERSION,
    },
    body: JSON.stringify({
      MobileNo: mobileNo,
      ApiVersion: API_VERSION,
      AppType: APP_TYPE,
      APPPlatForm: APP_PLATFORM,
      AppVersion: APP_VERSION,
    }),
  })
  return response.json()
}

export async function sendOtp(mobileNo: string, deviceId: string) {
  const response = await fetch('https://farmer.amulamcs.com/ValidateMobileNo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-apiversion': API_VERSION,
    },
    body: JSON.stringify({
      AppKey: APP_KEY,
      APPVerificationSecret: APP_VERIFI_SECRET,
      MobileNo: mobileNo,
      DeviceId: deviceId,
      CultureId: '1',
      ApiVersion: API_VERSION,
      AppType: APP_TYPE,
      APPPlatForm: APP_PLATFORM,
      AppVersion: APP_VERSION,
      OSVersion: '10',
      screenresolution: '1080 * 1920',
      model: 'SDK-Client',
      PushNotificationId: '',
      SocietyId: 0,
    }),
  })
  return response.json()
}

export async function verifyOtp(mobileNo: string, otp: string, deviceId: string) {
  const response = await fetch('https://farmer.amulamcs.com/RegisterMobileNo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-apiversion': API_VERSION,
    },
    body: JSON.stringify({
      AppKey: APP_KEY,
      APPVerificationSecret: APP_VERIFI_SECRET,
      MobileNo: mobileNo,
      DeviceId: deviceId,
      ApiVersion: API_VERSION,
      AppType: APP_TYPE,
      CultureId: '1',
      APPPlatForm: APP_PLATFORM,
      AppVersion: APP_VERSION,
      OTP: otp,
    }),
  })
  return response.json()
}

// Authenticated requests helper
function generateRequestId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function generateSignature(): string {
  return btoa(Math.random().toString()).substring(0, 44) + '='
}

export async function authenticatedRequest(
  baseUrl: string,
  endpoint: string,
  bearerToken: string,
  deviceId: string,
  body: object = {}
) {
  const encodedToken = btoa(`${bearerToken}:${deviceId}:${generateRequestId()}:${generateSignature()}`)

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'x-apiversion': API_VERSION,
      'Authorization': `Bearer ${encodedToken}`,
    },
    body: JSON.stringify({ CultureId: '1', ...body }),
  })
  return response.json()
}

// ============== PashuGPT APIs (No OTP Required) ==============

export async function getPashuGPTFarmerByMobile(mobileNumber: string) {
  const response = await fetch(
    `${PASHUGPT_BASE_URL}/GetFarmerDetailsByMobile?mobileNumber=${mobileNumber}`,
    {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${PASHUGPT_TOKEN}`,
      },
    }
  )
  return response.json()
}

export async function getPashuGPTAnimalByTag(tagNo: string) {
  const response = await fetch(
    `${PASHUGPT_BASE_URL}/GetAnimalDetailsByTagNo?tagNo=${tagNo}`,
    {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${PASHUGPT_TOKEN}`,
      },
    }
  )
  return response.json()
}
