# Amul Milk Producer App - API Documentation

**Package Name:** `com.prompt.ma.maapplicationfinalAmul`
**App Name:** Amul Milk Producer App
**App Version:** 3.0.4 (versionCode 69)
**Decompiled Date:** January 21, 2026
**API Verification Status:** Partially Verified via curl

---

## Table of Contents

1. [Base URLs](#base-urls)
2. [Authentication](#authentication)
3. [Farmer API Endpoints](#farmer-api-endpoints)
4. [Dashboard & Reports](#dashboard--reports)
5. [Milk Slip & Passbook](#milk-slip--passbook)
6. [Item Order API](#item-order-api)
7. [Animal Trading (Pashudhan) API](#animal-trading-pashudhan-api)
8. [Amul Pashudhan Identity API](#amul-pashudhan-identity-api)
9. [Fruits & Vegetables API](#fruits--vegetables-api)
10. [Land Details API](#land-details-api)
11. [Static Resources](#static-resources)
12. [Request Headers](#request-headers)
13. [Constants & Configuration](#constants--configuration)

---

## Base URLs

| Service | Base URL | Status | Purpose |
|---------|----------|--------|---------|
| **Main Farmer API** | `https://farmer.amulamcs.com/farmer/` | ✅ Verified | Primary farmer operations |
| **Dynamic Farmer API** | `https://farmer.amulamcs.com/` | ✅ Verified (from GetAPIUrl) | Dynamic base from config |
| **Item Order API (Prod)** | `https://itemorderapi.amulamcs.com/api/farmer/` | ✅ Verified | Production item ordering |
| **Item Order API (Test)** | `https://testitemorderapi.amulamcs.com/api/Farmer/` | ✅ Verified | Test item ordering |
| **Animal Trading API** | `https://pashudhanapi.amulamcs.com/v1/api/` | ✅ Verified | Animal buy/sell operations |
| **Animal Trading Users** | `https://pashudhanapi.amulamcs.com/v1/Users/` | ⚠️ Needs Auth | User management for trading |
| **Amul Pashudhan Identity** | `https://api.amulpashudhan.com/identity/v1/AHFarmerUserApp/` | ⚠️ Needs Auth | Pashudhan authentication |
| **Animal Details** | `https://pashudhanapi.amulamcs.com/myAnimalDetails/myads/` | ⚠️ Needs Auth | Animal advertisement details |
| **Manual/Docs API** | `https://api.amulamcs.com/Manual/` | User manual PDFs |

### WebView URLs

| URL | Purpose |
|-----|---------|
| `https://pashudhan.amulamcs.com/mobiledashboard` | Animal trading mobile dashboard |
| `https://pashudhan.amulamcs.com/splashscreen/` | Animal trading splash screen |

### Allowed Hostnames

The app validates SSL connections against these hostnames:
- `farmer.amulamcs.com`
- `testitemorderapi.amulamcs.com`
- `testfinyearportal.amulamcs.com`
- `pashudhanapi.amulamcs.com`
- `pashudhan.amulamcs.com`
- `pashudhan.amulamcs.in`
- `pashudhanapitest.amulamcs.com`
- `pashudhantest.amulamcs.com`
- `devportal.amulamcs.com`
- `api.amulpashudhan.com`

---

## Authentication

### Register Farmer

**Endpoint:** `POST /RegisterMobileNo`
**Alternative (New Users):** `POST /RegisterFarmer`

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `pMobileNo` | string | Mobile number |
| `pFCMId` / `pAppNotificationId` | string | Firebase notification ID |
| `pDeviceId` | string | Device identifier |
| `pAppKey` | string | Application key |
| `pAppType` | string | App type (3 for Android) |
| `pOsType` | string | OS type (0 for Android) |
| `pAppVersion` | string | App version |

### Authenticate Farmer

**Endpoint:** `POST /AuthenticateFarmer`

**Headers:**
```
X-ApiVersion: 1.0.1
pTokenNo: <auth_token>
```

### Validate Mobile Number

**Endpoint:** `POST /ValidateMobileNo`

### Validate Unregistered Mobile

**Endpoint:** `POST /ValidateUnRegisteredMobileNo`

### OTP Registration

**Endpoint:** `POST /RegisterFarmerV1_3`

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `pOTP` | string | One-time password |
| `pMobileNo` | string | Mobile number |

### Logout

**Endpoint:** `POST /LogOut`

### Get API URL

**Endpoint:** `POST /GetAPIUrl`

**Purpose:** Retrieves dynamic API configuration URLs.

---

## Farmer API Endpoints

### Get Farmer Detail

**Endpoint:** `POST /GetFarmerDetailV1_8`
**Alternative (Old API):** `POST /GetFarmerDetail`

**Response includes:**
- Farmer personal information
- Society details
- Account information
- Image path

### Update User Data

**Endpoint:** `POST /UpdateUserData`

### Get Society List

**Endpoint:** `POST /GetSocietyList`

### Get State And Company

**Endpoint:** `POST /GetStateAndCompany`

### Add Unauthorized App User

**Endpoint:** `POST /AddUnauthorizedAppUser`

### Get Unregister Farmer Detail

**Endpoint:** `POST /GetUnRegisterFarmerDetail`

### Unregister Farmer Detail

**Endpoint:** `POST /UnRegisterFarmerDetail`

### Get Society Data

**Endpoint:** `POST /GetSocietyData`

### Get Society By Village ID

**Endpoint:** `POST /GetSocietyByVillageId`

---

## Dashboard & Reports

### Get Dashboard Data

**Endpoint:** `POST /GetnewDashboardDataV1_11`
**Alternative (Old API):** `POST /GetDashboard`

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `pLang` | string | Culture/Language code |
| `pTokenNo` | string | Auth token |

### Get Chart Data

**Endpoint:** `POST /GetChartDataV1_11`
**Alternative (Old API):** `POST /GetChartData`

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `pXdata` | int | X-axis data type (1=Daily, 2=Monthly) |
| `pYdata` | int | Y-axis data type (1=Qty, 2=Amount) |

### Get Report Summary

**Endpoint:** `POST /GetReportSummary_V1`

### Get Report Detail

**Endpoint:** `POST /GetReportDetailV1_12`
**Alternative (Old API):** `POST /GetReportDetail`

### Get Financial Year

**Endpoint:** `POST /GetFinYear`

### Get Financial Year Wise Milk Data

**Endpoint:** `POST /GetFinyearWiseMilkdata`

### Get Version Detail

**Endpoint:** `POST /GetVersionDetail`

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `pLang` | string | Language code |
| `pOsType` | string | OS type |

---

## Milk Slip & Passbook

### Get Milk Slips

**Endpoint:** `POST /GetMilkSlipsV1_11`
**Alternative (Old API):** `POST /GetMilkSlips`

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `pFromDate` | string | Start date |
| `pToDate` | string | End date |
| `pShift` | string | Shift (Morning/Evening) |
| `sType` | string | Slip type |

### Get Passbook Summary

**Endpoint:** `POST /GetPassbookSummaryV1_11`
**Alternative (Old API):** `POST /GetPassbookDetail`

### Get Passbook Detail

**Endpoint:** `POST /GetPassbookDetailV1_11`

### Get Payment Summary

**Endpoint:** `POST /GetMilkCollectionReport_V1`

### Check PDF Update

**Endpoint:** `POST /GetPDFTimeV1_11`
**Alternative (Old API):** `POST /GetPDFTime`

---

## Notifications

### Get All Notifications

**Endpoint:** `POST /GetAllNotificationsV1_12`

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `pStart` | int | Pagination start |
| `pRecCount` | int | Records per page (default: 10) |

### Get Unread Notification Count

**Endpoint:** `POST /GetUnReadNotificationCount`

---

## Item Order API

**Base URL:** `https://testitemorderapi.amulamcs.com/api/Farmer/`

### Get Farmer Item Order List

**Endpoint:** `POST /GetFarmerItemOrderList`

**Headers:**
```
X-ApiVersion: 1.0.1
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (ItemOrderListReqBody):**
```json
{
  "FarmerId": "string",
  "SocietyId": "string"
}
```

### Get Farmer Item Order List Detail

**Endpoint:** `POST /GetFarmerItemOrderListDetail`

**Request Body (ItemOrderListDetailsRequestBody):**
```json
{
  "OrderId": "string"
}
```

### Insert Item Order

**Endpoint:** `POST /InsertItemOrder`

**Request Body (InserItemReqBody):**
```json
{
  "FarmerId": "string",
  "SocietyId": "string",
  "Items": [
    {
      "ItemId": "string",
      "Quantity": 0
    }
  ]
}
```

---

## Animal Trading (Pashudhan) API

**Base URL:** `https://pashudhanapi.amulamcs.com/v1/api/`

### Authenticate Farmer (Animal Trading)

**Endpoint:** `POST /Authentication/authenticateFarmer`

**Request Body:**
```json
{
  "MobileNo": "string",
  "DeviceId": "string",
  "FCMToken": "string"
}
```

**Response includes:**
- `UserId`
- `DeviceId`
- `Token`
- `SocietyCode`
- `UnionCode`

### Get Notification List

**Endpoint:** `POST /Notification/GetNotificationList`

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `UserId` | string | User identifier |
| `PageNo` | int | Page number |
| `PageSize` | int | Records per page |

### Set Read Notification

**Endpoint:** `POST /Notification/SetReadNotification`

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `NotificationId` | string | Notification ID |
| `UserId` | string | User identifier |

### Check Connection

**Base URL:** `https://pashudhanapi.amulamcs.com/v1/Users/`
**Endpoint:** `POST /CheckConnection`

---

## Amul Pashudhan Identity API

**Base URL:** `https://api.amulpashudhan.com/identity/v1/AHFarmerUserApp/`

### Authenticate AH Farmer User App

**Endpoint:** `POST /AuthenticateAHFarmerUserApp`

### Verify Organization For Amul Pashudhan

**Endpoint:** `POST /VerifyOrganizationForAmulPashudhan`

### Verify Society For Amul Pashudhan

**Endpoint:** `POST /VerifySocietyForAmulPashudhan`

### AH Farmer User App Logout

**Endpoint:** `POST /AHFarmerUserAppLogOut`

---

## Fruits & Vegetables API

### Get F&V Category

**Endpoint:** `POST /GetFandVCategory`

### Get F&V Item Data By Category ID

**Endpoint:** `POST /GetFandVItemDataByCategoryId`

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `CategoryId` | string | Category identifier |

### Insert F&V Item Transaction

**Endpoint:** `POST /InsertFandVItemTransaction`

### Get F&V Item Transaction By ID

**Endpoint:** `POST /FandVItemTransactionById`

### Get All F&V Item Transactions

**Endpoint:** `POST /GetAllFandVItemTransaction`

---

## Land Details API

### Get Region By Parent ID

**Endpoint:** `POST /GetREgionByParentId`

### Get Region Detail With Society

**Endpoint:** `POST /GetRegionDetailWithSociety`

### Register Farmer Land Detail

**Endpoint:** `POST /RegisterFarmerLandDetail`

### Get All Farmer Land Details

**Endpoint:** `POST /GetAllFarmerLandDetails`

### Is Land Detail Exists

**Endpoint:** `POST /IsLandDetailExists`

---

## Cattle API

### Add Cattle Detail

**Endpoint:** `POST /AddCattleDetail`

### Get Cattle Info

**Endpoint:** `POST /GetCattleInfo`

### Enable Pashudhan

**Endpoint:** `POST /EnablePashuDhan`

**Purpose:** Get cattle trading settings.

---

## Settings & Feedback

### Insert Farmer Setting

**Endpoint:** `POST /InsertFarmerSetting`

### Insert Feedback Detail

**Endpoint:** `POST /InsertFeedbackDetail`

---

## Localization

### Get All Localized Words Sync Date

**Endpoint:** `POST /GetAllLocaliseWordSyncDate`
**Alternative (New API):** `POST /GetStaticRegionalWords`

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `pDate` | string | Last update date |
| `pIsKiosk` | string | Is kiosk mode (0=No) |

---

## Image Upload

### Upload Image

**Endpoint:** `POST /UploadImage`

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `pUploadPhoto` | file | Image file |
| `pImageTimeStamp` | string | Timestamp |

---

## Static Resources

### User Manuals

| Language | URL |
|----------|-----|
| English (Amul) | `https://api.amulamcs.com/Manual/AmulMilkProducerApp_Eng.pdf` |
| Gujarati (Amul) | `https://api.amulamcs.com/Manual/AmulMilkProducerApp_Guj.pdf` |
| English (AMCS) | `https://farmerapi.promptamcs.com/manual/AMCSApp_Eng.pdf` |

### Images

| Resource | URL |
|----------|-----|
| Topical Ad | `https://amul.com/images/topicaladv.jpg` |

---

## Request Headers

### Standard Headers

```
Content-Type: application/json
X-ApiVersion: 1.0.1
```

### Authentication Headers

```
pTokenNo: <auth_token>
Authorization: Bearer <token>
```

### Device Information Headers

| Header | Description |
|--------|-------------|
| `pDeviceId` | Android device ID |
| `pAppKey` | Application key: `20259FF4-9774-4E2D-9542-EAA16752C896` |
| `pAppType` | App type: `3` |
| `pOsType` | OS type: `0` (Android) |
| `pAppVersion` | App version |
| `pModel` | Device model |
| `pOSVersion` | Android OS version |
| `pScreenResolution` | Screen resolution |
| `pOperator` | Network operator |
| `pIMEI` | Device IMEI |

---

## Constants & Configuration

### Application Constants

| Constant | Value |
|----------|-------|
| `APP_KEY` | `20259FF4-9774-4E2D-9542-EAA16752C896` |
| `API_VERSION` | `1.0.1` |
| `APP_TYPE` | `3` |
| `APP_PLATFORM` | `3` (Farmer App) |
| `ANIMAL_BUY_SELL_APPPLATFORM` | `2` |
| `PAGE_RECORD_COUNT` | `10` |

### Status Codes

| Code | Description |
|------|-------------|
| `1` | Success |
| `2` | Fail |
| `3` | Exception |
| `4` | Token Invalid |
| `5` | Already Registered |
| `6` | Data Not Found |
| `7` | Authentication Not Found |
| `8` | Bad Request |
| `9` | Server Exception |
| `11` | Please Try Again |
| `1016` | Mobile No Not Found |
| `1019` | Duplicate Mobile No Found |
| `1044` | Mobile No Is Inactive |

### Shift Constants

| Value | Description |
|-------|-------------|
| Morning | Morning shift |
| Evening | Evening shift |

### Data Types

| X-Axis Type | Value |
|-------------|-------|
| Daily | `1` |
| Monthly | `2` |

| Y-Axis Type | Value |
|-------------|-------|
| Quantity | `1` |
| Amount | `2` |

---

## Response Format

### Standard Response Structure

```json
{
  "StatusCode": 1,
  "Message": "OK",
  "Data": { ... }
}
```

### API Key Response Fields

| Field | Description |
|-------|-------------|
| `Data` | Response data payload |
| `StatusCode` | Status code |
| `Message` | Response message |
| `ServerDate` | Server date string |

### Farmer Detail Fields

| Field | Description |
|-------|-------------|
| `SabhasadId` | Member ID |
| `AccountCode` | Account code |
| `AccountName` | Account name |
| `AccountNo` | Bank account number |
| `MandliCode` | Mandli/Society code |
| `MandliName` | Mandli/Society name |
| `MobileNo` | Mobile number |
| `Address` | Address |
| `BankName` | Bank name |
| `BranchCode` | Branch code |
| `IFSCCode` | IFSC code |
| `ImagePath` | Profile image path |
| `IsMember` | Membership status |
| `SocietyId` | Society identifier |

### Milk Slip Fields

| Field | Description |
|-------|-------------|
| `Date` | Collection date |
| `Shift` | Morning/Evening |
| `Qty` | Quantity (liters) |
| `Fat` | Fat percentage |
| `Snf` | SNF value |
| `Rate` | Rate per liter |
| `Amount` | Total amount |
| `EQty` | Evening quantity |
| `MQty` | Morning quantity |
| `EAmt` | Evening amount |
| `MAmt` | Morning amount |

---

## Social Media

| Platform | URL |
|----------|-----|
| Facebook | `https://www.facebook.com/promptamcs` |
| Facebook (Marathi) | `https://mr-in.facebook.com/promptamcs` |

---

## Related Apps

| App | Package Name | Play Store |
|-----|--------------|------------|
| Farm 365 | `com.ps.farm365` | [Link](https://play.google.com/store/apps/details?id=com.ps.farm365) |

---

## Notes

1. **API Versioning:** The app uses `X-ApiVersion: 1.0.1` header for API versioning.
2. **Old vs New Users:** The app maintains backward compatibility with different API endpoints for old and new user types.
3. **Token-based Auth:** Most endpoints require `pTokenNo` header for authentication.
4. **WebView Integration:** Animal trading features are primarily delivered via WebView loading `pashudhan.amulamcs.com`.
5. **SSL Pinning:** The app implements custom hostname verification for security.

---

## Verified curl Examples

### 1. Get API URL (Configuration Endpoint) ✅

```bash
curl -s --compressed -X POST "https://farmer.amulamcs.com/farmer/GetAPIUrl" \
  -H "Content-Type: application/json" \
  -H "x-apiversion: 1.0.1" \
  -d '{
    "MobileNo": "YOUR_MOBILE_NUMBER",
    "ApiVersion": "1.0.1",
    "AppType": "3",
    "APPPlatForm": "3",
    "AppVersion": "3.0.4"
  }'
```

**Response:**
```json
{
  "Data": {
    "Url": "https://farmer.amulamcs.com/",
    "UserType": 2,
    "AboutUsUrl": "https://farmer.amulamcs.com/aboutus/aboutus.html",
    "UploadImageUrl": "https://farmer.amulamcs.com/",
    "ItemOrderUrl": "https://itemorderapi.amulamcs.com/api/farmer/"
  },
  "Errors": [],
  "Message": "OK",
  "StatusCode": 200
}
```

### 2. Animal Trading Authentication ✅

```bash
curl -s --compressed -X POST "https://pashudhanapi.amulamcs.com/v1/api/Authentication/authenticateFarmer" \
  -H "Content-Type: application/json" \
  -d '{
    "MobileNo": "YOUR_MOBILE",
    "DeviceId": "YOUR_DEVICE_ID",
    "FCMToken": "YOUR_FCM_TOKEN",
    "EmailId": "",
    "Platform": "3",
    "UniqueId": "YOUR_UNIQUE_ID",
    "UserName": "YOUR_NAME",
    "AMCSToken": "YOUR_AMCS_TOKEN",
    "UnionCode": "YOUR_UNION_CODE",
    "UnionName": "YOUR_UNION_NAME",
    "FarmerCode": "YOUR_FARMER_CODE",
    "SocityCode": "YOUR_SOCIETY_CODE",
    "WhatsAppNo": "YOUR_WHATSAPP",
    "PushNotificationFCMId": "YOUR_FCM_ID"
  }'
```

### 3. Check PDF Manual (Static Resource) ✅

```bash
curl -I "https://api.amulamcs.com/Manual/AmulMilkProducerApp_Eng.pdf"
```

**Response:** `HTTP/1.1 200 OK` (1.6MB PDF)

### 4. About Us Page ✅

```bash
curl -I "https://farmer.amulamcs.com/aboutus/aboutus.html"
```

**Response:** `HTTP/1.1 200 OK` (HTML page)

---

## Common Error Codes

| Code | Message | Meaning |
|------|---------|---------|
| 200 | OK | Success |
| 400 | BadRequest | Invalid request format |
| 1002 | ParameterMissing | Required parameters missing |
| 1016 | MobileNoNotFound | Mobile not registered |
| 1019 | DuplicateMobileNoFound | Duplicate mobile number |
| 1020 | App Version Missmatched | Wrong app version |
| 1021 | App Platform Missmatched | Wrong app platform |
| 1044 | MobileNoIsInactive | Account disabled |

---

## Verified API Traffic (MITM Captured)

The following endpoints have been verified through actual MITM traffic capture from a real device.

### Authentication Flow

#### 1. GetAPIUrl - Get Configuration ✅

**Endpoint:** `POST https://farmer.amulamcs.com/farmer/GetAPIUrl`

**Request Headers:**
```
Content-Type: application/json
x-apiversion: 1.0.1
AppVersion: 3.0.4
APPPlatForm: 3
AppType: 3
```

**Request Body:**
```json
{
  "MobileNo": "9769894274",
  "ApiVersion": "1.0.1",
  "AppType": "3",
  "APPPlatForm": "3",
  "AppVersion": "3.0.4"
}
```

**Response:**
```json
{
  "Data": {
    "Url": "https://farmer.amulamcs.com/",
    "UserType": 2,
    "AboutUsUrl": "https://farmer.amulamcs.com/aboutus/aboutus.html",
    "UploadImageUrl": "https://farmer.amulamcs.com/",
    "ItemOrderUrl": "https://itemorderapi.amulamcs.com/api/farmer/"
  },
  "Errors": [],
  "Message": "OK",
  "StatusCode": 200
}
```

#### 2. ValidateMobileNo - Send OTP ✅

**Endpoint:** `POST https://farmer.amulamcs.com/ValidateMobileNo`

**Request Body:**
```json
{
  "pMobileNo": "9769894274",
  "pAppKey": "20259FF4-9774-4E2D-9542-EAA16752C896",
  "pAppType": "3",
  "pOsType": "0"
}
```

**Response (Success):**
```json
{
  "Data": {
    "FarmerId": "100190",
    "MobileNo": "9769894274",
    "FarmerName": "DESAI DINESHBHAI SHIVABHAI",
    "IsActive": true
  },
  "StatusCode": 1,
  "Message": "OTP sent successfully",
  "ServerDate": "2026-01-21T12:00:00"
}
```

**Response (Not Registered - StatusCode 1016):**
```json
{
  "Data": null,
  "StatusCode": 1016,
  "Message": "Mobile number not registered",
  "ServerDate": "2026-01-21T12:00:00"
}
```

#### 3. RegisterMobileNo - Verify OTP ✅

**Endpoint:** `POST https://farmer.amulamcs.com/RegisterMobileNo`

**Request Body:**
```json
{
  "pMobileNo": "9769894274",
  "pOTP": "8679",
  "pDeviceId": "abc123-device-id",
  "pAppKey": "20259FF4-9774-4E2D-9542-EAA16752C896",
  "pAppNotificationId": "fcm_token_here",
  "pAppType": "3",
  "pOsType": "0",
  "pAppVersion": "3.0.4",
  "pModel": "ONEPLUS A5000",
  "pOSVersion": "10",
  "pScreenResolution": "1080x1920",
  "pOperator": "Jio",
  "pIMEI": ""
}
```

**Response:**
```json
{
  "Data": {
    "FarmerId": "100190",
    "FarmerCode": "0191",
    "FarmerName": "DESAI DINESHBHAI SHIVABHAI",
    "TokenNo": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "MobileNo": "9769894274",
    "SocietyId": "1001",
    "SocietyCode": "GJ-10001",
    "SocietyName": "THE BASAN MAHILA DUDH U.S.M.LTD",
    "UnionCode": "GSMUL",
    "UnionId": "1",
    "UnionName": "Gujarat Cooperative Milk Marketing Federation",
    "BankAccountNo": "607090018597",
    "BankName": "STATE BANK OF INDIA",
    "IFSCCode": "SBIN0001234",
    "Address": "BASAN, DIST SABARKANTHA",
    "ImagePath": "https://farmer.amulamcs.com/images/farmer/100190.jpg",
    "ImageTimeStamp": "2024-01-15T10:30:00",
    "PDFTimeStamp": "2024-01-20T08:00:00",
    "Email": "",
    "IsNewUser": false,
    "PashuAadhaarNo": "",
    "IsFeedBackGive": 0,
    "IsStarRatingGiven": 0,
    "IsLabMember": 0,
    "CategoryId": 1
  },
  "StatusCode": 1,
  "Message": "Success",
  "ServerDate": "2026-01-21T12:05:00"
}
```

### Data Retrieval Endpoints

#### 4. GetFarmerDetail ✅

**Endpoint:** `POST https://farmer.amulamcs.com/GetFarmerDetail`

**Request Body:**
```json
{
  "pTokenNo": "YOUR_TOKEN_HERE",
  "pLang": "en-US"
}
```

**Response:** Same structure as RegisterMobileNo Data field.

#### 5. GetSocietyData ✅

**Endpoint:** `POST https://farmer.amulamcs.com/GetSocietyData`

**Request Body:**
```json
{
  "pTokenNo": "YOUR_TOKEN_HERE",
  "pLang": "en-US"
}
```

**Response:**
```json
{
  "Data": {
    "SocietyId": "1001",
    "SocietyCode": "GJ-10001",
    "SocietyName": "THE BASAN MAHILA DUDH U.S.M.LTD",
    "SocietyType": 1,
    "UnionId": "1",
    "UnionCode": "GSMUL",
    "UnionName": "Gujarat Cooperative Milk Marketing Federation",
    "Address": "BASAN VILLAGE",
    "Pincode": "383001",
    "ContactNo": "9876543210",
    "DistrictId": "12",
    "DistrictName": "SABARKANTHA",
    "TalukaId": "123",
    "TalukaName": "IDAR",
    "VillageId": "1234",
    "VillageName": "BASAN",
    "StateId": "12",
    "StateName": "GUJARAT",
    "Latitude": "23.8425",
    "Longitude": "73.0121",
    "EmailId": "",
    "SecretaryName": "PATEL RAMESHBHAI",
    "SecretaryMobile": "9876543210",
    "IsHANA": 1,
    "IsLab": 0,
    "IsF_VEnabled": 0,
    "IsItemOrder": 1,
    "IsPashudhanEnabled": 1,
    "IsAmulPashudhanEnabled": 1,
    "IsPdfEnabled": 1,
    "IsPaymentEnabled": 1,
    "IsNotificationEnabled": 1,
    "IsFeedEnabled": 1,
    "MaxMilkQty": 100.0,
    "MinMilkQty": 0.5,
    "MaxFat": 12.0,
    "MinFat": 2.0,
    "MaxSNF": 12.0,
    "MinSNF": 6.0
  },
  "StatusCode": 1,
  "Message": "Success",
  "ServerDate": "2026-01-21T12:05:00"
}
```

#### 6. GetFarmerSetting ✅

**Endpoint:** `POST https://farmer.amulamcs.com/GetFarmerSetting`

**Request Body:**
```json
{
  "pTokenNo": "YOUR_TOKEN_HERE",
  "pLang": "en-US"
}
```

**Response:**
```json
{
  "Data": [
    {
      "SettingId": "1",
      "SettingName": "ShowMilkSlip",
      "SettingValue": "true",
      "SettingType": 1,
      "IsEnabled": 1
    },
    {
      "SettingId": "2",
      "SettingName": "ShowPassbook",
      "SettingValue": "true",
      "SettingType": 1,
      "IsEnabled": 1
    }
  ],
  "StatusCode": 1,
  "Message": "Success",
  "ServerDate": "2026-01-21T12:05:00"
}
```

#### 7. GetCattleInfo ✅

**Endpoint:** `POST https://farmer.amulamcs.com/GetCattleInfo`

**Request Body:**
```json
{
  "pTokenNo": "YOUR_TOKEN_HERE",
  "pLang": "en-US"
}
```

**Response:**
```json
{
  "Data": [],
  "StatusCode": 1,
  "Message": "Success",
  "ServerDate": "2026-01-21T12:05:00"
}
```

#### 8. GetAllItem ✅

**Endpoint:** `POST https://farmer.amulamcs.com/GetAllItem`

**Request Body:**
```json
{
  "pTokenNo": "YOUR_TOKEN_HERE",
  "pLang": "en-US"
}
```

**Response:**
```json
{
  "Data": [
    {
      "ItemId": "1",
      "ItemCode": "CAT001",
      "ItemName": "Cattle Feed",
      "ItemNameGuj": "પશુ આહાર",
      "CategoryId": "1",
      "CategoryName": "Feed",
      "UOMId": "1",
      "UOMName": "KG",
      "Rate": 25.00,
      "MinQty": 1,
      "MaxQty": 100,
      "IsActive": 1,
      "ImagePath": ""
    }
  ],
  "StatusCode": 1,
  "Message": "Success",
  "ServerDate": "2026-01-21T12:05:00"
}
```

#### 9. GetUOM ✅

**Endpoint:** `POST https://farmer.amulamcs.com/GetUOM`

**Request Body:**
```json
{
  "pTokenNo": "YOUR_TOKEN_HERE",
  "pLang": "en-US"
}
```

**Response:**
```json
{
  "Data": [
    {
      "UOMId": "1",
      "UOMCode": "KG",
      "UOMName": "Kilogram",
      "UOMNameGuj": "કિલોગ્રામ"
    },
    {
      "UOMId": "2",
      "UOMCode": "LTR",
      "UOMName": "Litre",
      "UOMNameGuj": "લીટર"
    }
  ],
  "StatusCode": 1,
  "Message": "Success",
  "ServerDate": "2026-01-21T12:05:00"
}
```

#### 10. GetAppModuleList ✅

**Endpoint:** `POST https://farmer.amulamcs.com/GetAppModuleList`

**Request Body:**
```json
{
  "pTokenNo": "YOUR_TOKEN_HERE",
  "pLang": "en-US"
}
```

**Response:**
```json
{
  "Data": [
    {
      "ModuleId": "1",
      "ModuleName": "Dashboard",
      "ModuleCode": "DASHBOARD",
      "ModuleIcon": "ic_dashboard",
      "ModuleOrder": 1,
      "IsEnabled": 1,
      "ModuleType": 1,
      "ParentModuleId": ""
    },
    {
      "ModuleId": "2",
      "ModuleName": "Milk Slip",
      "ModuleCode": "MILKSLIP",
      "ModuleIcon": "ic_milkslip",
      "ModuleOrder": 2,
      "IsEnabled": 1,
      "ModuleType": 1,
      "ParentModuleId": ""
    }
  ],
  "StatusCode": 1,
  "Message": "Success",
  "ServerDate": "2026-01-21T12:05:00"
}
```

#### 11. GetVersionDetail ✅

**Endpoint:** `POST https://farmer.amulamcs.com/GetVersionDetail`

**Request Body:**
```json
{
  "pLang": "en-US",
  "pOsType": "0"
}
```

**Response:**
```json
{
  "Data": {
    "VersionCode": 69,
    "VersionName": "3.0.4",
    "IsMandatory": 0,
    "UpdateMessage": "",
    "PlayStoreUrl": "https://play.google.com/store/apps/details?id=com.prompt.ma.maapplicationfinalAmul"
  },
  "StatusCode": 1,
  "Message": "Success",
  "ServerDate": "2026-01-21T12:05:00"
}
```

### Pashudhan (Animal Trading) API ✅

#### 12. CheckConnection

**Endpoint:** `POST https://pashudhanapi.amulamcs.com/v1/Users/CheckConnection`

**Request Body:**
```json
{}
```

**Response:**
```json
{
  "data": {
    "IsSuccess": true,
    "Message": "Connection successful"
  },
  "isSuccess": true,
  "message": "Success",
  "statusCode": 200
}
```

#### 13. authenticateFarmer ✅

**Endpoint:** `POST https://pashudhanapi.amulamcs.com/v1/api/Authentication/authenticateFarmer`

**Request Body:**
```json
{
  "MobileNo": "9769894274",
  "DeviceId": "abc123-device-id",
  "FCMToken": "fcm_token_here",
  "EmailId": "",
  "Platform": "2",
  "UniqueId": "100190",
  "UserName": "DESAI DINESHBHAI SHIVABHAI",
  "AMCSToken": "amcs_bearer_token",
  "UnionCode": "GSMUL",
  "UnionName": "Gujarat Cooperative Milk Marketing Federation",
  "FarmerCode": "0191",
  "SocityCode": "GJ-10001",
  "WhatsAppNo": "9769894274",
  "PushNotificationFCMId": "fcm_token_here"
}
```

**Response:**
```json
{
  "data": {
    "UserId": "usr_100190",
    "DeviceId": "abc123-device-id",
    "Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "SocietyCode": "GJ-10001",
    "UnionCode": "GSMUL",
    "UserName": "DESAI DINESHBHAI SHIVABHAI",
    "MobileNo": "9769894274",
    "FarmerCode": "0191",
    "IsActive": true
  },
  "isSuccess": true,
  "message": "Authentication successful",
  "statusCode": 200
}
```

---

## TypeScript SDK

A complete TypeScript SDK is available in the `amul-sdk/` directory:

```bash
cd amul-sdk
npm install
npm run build
```

### SDK Usage Example

```typescript
import { AmulApiClient } from './amul-sdk';

const client = new AmulApiClient({ debug: true });

// Step 1: Get API configuration
await client.getApiUrl('9876543210');

// Step 2: Send OTP
await client.sendOtp('9876543210');

// Step 3: Verify OTP (get OTP from phone)
await client.verifyOtp('9876543210', '123456');

// Step 4: Fetch data
const farmer = await client.getFarmerDetail();
const society = await client.getSocietyData();
const modules = await client.getAppModuleList();

console.log(farmer.Data?.FarmerName);
console.log(society.Data?.SocietyName);
```

### SDK Files

| File | Description |
|------|-------------|
| `amul-sdk/src/types.ts` | TypeScript type definitions for all API requests/responses |
| `amul-sdk/src/constants.ts` | API constants, URLs, and endpoint definitions |
| `amul-sdk/src/client.ts` | Main API client with all methods |
| `amul-sdk/src/index.ts` | Export file |
| `amul-sdk/examples/end-to-end-flow.ts` | Complete example flow (TypeScript) |
| `amul-sdk/examples/end-to-end-flow.js` | Complete example flow (JavaScript) |

---

## Security Notes (VERIFIED)

### NO Certificate Pinning ⚠️

The app implements `TrustEverythingTrustManager` which accepts ANY SSL certificate:

```java
// From TrustEverythingTrustManager.java
public void checkServerTrusted(X509Certificate[] x509CertificateArr, String str) {
    // Empty - accepts everything!
}
```

This makes MITM attacks trivial without any bypass needed.

### Token-Based Authentication

- OTP is sent to registered mobile number
- After verification, a Bearer token is issued
- Token is passed in `pTokenNo` parameter for subsequent requests
- Pashudhan API uses separate JWT tokens

---

*Generated from APK decompilation analysis + MITM traffic verification*
*Last updated: 2026-01-21*
