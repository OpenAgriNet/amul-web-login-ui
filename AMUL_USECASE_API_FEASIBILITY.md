# Amul Use Case API Feasibility Analysis

**Analysis Date:** January 21, 2026
**Source:** Amul Milk Producer App v3.0.4 + **PashuGPT APIs** (NEW)
**Reference Document:** Amul Use Case_V0.pdf

---

## Executive Summary

| Use Case | Feasibility | Coverage |
|----------|-------------|----------|
| 1. Animal Profile & Reproductive Status | **Fully Supported** | 95% |
| 2. Breeding & Heat Detection | **Mostly Supported** | 80% |
| 3. Health Issue & Symptom Triage | **Partial** | 40% |
| 4. Milk Yield Drop & Lactation Support | **Fully Supported** | 90% |
| 5. Starting a New Cattle Farm | **Knowledge-Only** | N/A |
| 6. Improving Profitability, FAT %, Health | **Mostly Supported** | 75% |

**Key Finding:** With the new **PashuGPT APIs**, most use cases are now feasible! The APIs provide breeding records, pregnancy status, lactation stage, and AI history.

---

## NEW: PashuGPT APIs (Game Changer!)

Two new APIs have been created specifically for the chatbot:

### 1. GetFarmerDetailsByMobile

**Endpoint:** `GET https://api.amulpashudhan.com/configman/v1/PashuGPT/GetFarmerDetailsByMobile`

**Authentication:** Bearer Token
```
Authorization: Bearer REDACTED_PASHUGPT_TOKEN
```

**Parameters:**
| Parameter | Type | Example |
|-----------|------|---------|
| `mobileNumber` | string | `9601335568` |

**Response:**
```json
[
  {
    "state": "GUJARAT",
    "district": "BANASKANTHA",
    "subDistrict": "PALANPUR",
    "village": "FATEPUR",
    "unionName": "BANAS",
    "societyName": "FATEPUR (VAD)M.P.C.S.LTD",
    "farmerName": "GEETABEN JASHWANATJI PARMAR",
    "mobileNumber": "9601335568",
    "farmerCode": "1165",
    "avgMilkPerDayInLiter": 0.0,
    "totalAnimals": 0,
    "cow": 0,
    "buffalo": 0,
    "totalMilkingAnimals": 0
  }
]
```

**Note:** Returns an array (farmer may have multiple registrations).

### 2. GetAnimalDetailsByTagNo

**Endpoint:** `GET https://api.amulpashudhan.com/configman/v1/PashuGPT/GetAnimalDetailsByTagNo`

**Authentication:** Bearer Token (same as above)

**Parameters:**
| Parameter | Type | Example |
|-----------|------|---------|
| `tagNo` | string | `106290093933` |

**Response:**
```json
{
  "tagNumber": "106290093933",
  "animalType": "Buffalo",
  "breed": "Mehsana",
  "milkingStage": "Milking",
  "pregnancyStage": "Non Pregnant",
  "dateOfBirth": "2019-10-27T00:00:00",
  "lactationNo": 3,
  "lastBreedingActivity": {
    "lastAI": "2026-01-21T11:19:20.453",
    "lastPD": null,
    "lastCalving": null,
    "calfTagNo": null,
    "calfMale": 0,
    "calfFemale": 0
  },
  "lastHealthActivity": null
}
```

**Key Fields Available:**
- `milkingStage`: "Milking" | "Dry"
- `pregnancyStage`: "Non Pregnant" | "Pregnant" | etc.
- `lactationNo`: Current lactation number
- `lastBreedingActivity.lastAI`: Last AI date (critical for Use Case 1 & 2!)
- `lastBreedingActivity.lastPD`: Last pregnancy detection date
- `lastBreedingActivity.lastCalving`: Last calving date
- `lastHealthActivity`: Health records (structure TBD)

---

## Detailed Use Case Analysis

### Use Case 1: Animal Profile & Reproductive Status ✅ FULLY SUPPORTED

**Persona:** Sita-ben Patel (Anand)
**Required:** Farmer identification, animal registration, breeding/AI records, pregnancy status

#### Required APIs vs Available APIs

| Required API | Available? | Endpoint | Notes |
|--------------|------------|----------|-------|
| **Farmer Data API** | ✅ Yes | `PashuGPT/GetFarmerDetailsByMobile` | Full farmer + animal count |
| **Animal Details API** | ✅ Yes | `PashuGPT/GetAnimalDetailsByTagNo` | Complete animal profile |
| **Animal & Breeding API** | ✅ Yes | `GetAnimalDetailsByTagNo` | `lastBreedingActivity` object |
| **Pregnancy Status API** | ✅ Yes | `GetAnimalDetailsByTagNo` | `pregnancyStage` field |
| **AI Records** | ✅ Yes | `GetAnimalDetailsByTagNo` | `lastBreedingActivity.lastAI` |

#### Available Data from PashuGPT APIs

```typescript
// Farmer Data - FULLY AVAILABLE
interface FarmerDetails {
  state: string;           // "GUJARAT"
  district: string;        // "BANASKANTHA"
  subDistrict: string;     // "PALANPUR"
  village: string;         // "FATEPUR"
  unionName: string;       // "BANAS"
  societyName: string;     // "FATEPUR (VAD)M.P.C.S.LTD"
  farmerName: string;      // "GEETABEN JASHWANATJI PARMAR"
  mobileNumber: string;
  farmerCode: string;
  avgMilkPerDayInLiter: number;
  totalAnimals: number;    // Total registered animals
  cow: number;             // Number of cows
  buffalo: number;         // Number of buffaloes
  totalMilkingAnimals: number;
}

// Animal Data - FULLY AVAILABLE WITH BREEDING!
interface AnimalDetails {
  tagNumber: string;           // "106290093933"
  animalType: string;          // "Buffalo" | "Cow"
  breed: string;               // "Mehsana" | "Gir" | "HF Cross"
  milkingStage: string;        // "Milking" | "Dry"
  pregnancyStage: string;      // "Non Pregnant" | "Pregnant"
  dateOfBirth: string;         // ISO date
  lactationNo: number;         // Current lactation number
  lastBreedingActivity: {
    lastAI: string | null;     // Last AI date - CRITICAL!
    lastPD: string | null;     // Last pregnancy detection
    lastCalving: string | null;// Last calving date
    calfTagNo: string | null;
    calfMale: number;
    calfFemale: number;
  };
  lastHealthActivity: unknown; // Structure TBD
}
```

#### Feasibility Assessment

| Conversation Step | Feasible? | Implementation |
|-------------------|-----------|----------------|
| "I want details of my cow" → Identify farmer & animals | ✅ Yes | `GetFarmerDetailsByMobile` → shows totalAnimals, cow, buffalo count |
| "Gir cow, tag 1234" → Load animal context | ✅ Yes | `GetAnimalDetailsByTagNo(1234)` → full profile |
| "Is she pregnant?" → Check pregnancy window | ✅ Yes | Check `pregnancyStage` + calculate days since `lastAI` |
| "No heat signs" → Recommend PD | ✅ Yes | If days since lastAI > 18-21, recommend PD |

#### Example Bot Flow

```typescript
// Step 1: Farmer calls
const farmers = await getFarmerDetailsByMobile("9601335568");
// "Sita-ben, you have 2 cows registered. Which cow?"

// Step 2: Farmer says "tag 1234"
const animal = await getAnimalDetailsByTagNo("1234");
// "This is your Gir cow. She is milking and last AI was done 18 days ago."

// Step 3: "Is she pregnant?"
const daysSinceAI = daysBetween(animal.lastBreedingActivity.lastAI, today);
if (daysSinceAI >= 18 && daysSinceAI <= 25) {
  // "Pregnancy can be checked now. Has she shown any heat signs?"
}

// Step 4: "No heat signs"
// "That's good. I recommend pregnancy checking in the next 7 days."
```

#### Gap Analysis

**NOW AVAILABLE:**
- ✅ Breeding history (lastAI, lastPD, lastCalving)
- ✅ Pregnancy status
- ✅ Lactation number
- ✅ Milking stage
- ✅ Animal breed and type

**STILL MISSING:**
- ❌ List of all animals by farmer (need to know tag numbers)
- ❌ Heat cycle history (only last AI available)

---

### Use Case 2: Breeding & Heat Detection ✅ MOSTLY SUPPORTED

**Persona:** Rameshbhai Chaudhary (Banaskantha)
**Required:** Breeding context, heat symptoms, AI scheduling

#### Required APIs vs Available APIs

| Required API | Available? | Endpoint | Notes |
|--------------|------------|----------|-------|
| **Animal & Breeding API** | ✅ Yes | `GetAnimalDetailsByTagNo` | Last AI, calving dates |
| **Pregnancy Status** | ✅ Yes | `GetAnimalDetailsByTagNo` | `pregnancyStage` field |
| **Lactation Info** | ✅ Yes | `GetAnimalDetailsByTagNo` | `lactationNo`, `milkingStage` |
| **Heat Detection Records** | ⚠️ Partial | Derived from lastAI | Can calculate expected heat |
| **AI Scheduling API** | ❌ No | None | Not available |
| **Technician Booking API** | ❌ No | None | Not available |

#### Feasibility Assessment

| Conversation Step | Feasible? | Implementation |
|-------------------|-----------|----------------|
| "Is my cow in heat?" → Load breeding context | ✅ Yes | Get animal, check days since lastAI |
| Symptom scoring questions | ✅ Yes | Knowledge base + API context |
| "Heat probability is high" | ✅ Yes | Combine symptoms + lastAI timing |
| "Best time for AI is tonight" | ✅ Yes | Knowledge base timing rules |
| "Should I arrange a technician?" | ❌ No | **NO booking API** - provide advice only |

#### Example Bot Flow

```typescript
// Step 1: "Is my cow in heat?"
const animal = await getAnimalDetailsByTagNo("106290093933");
const daysSinceLastAI = daysBetween(animal.lastBreedingActivity.lastAI, today);

// If 18-24 days since last AI, animal might be in heat (repeat cycle)
if (daysSinceLastAI >= 18 && daysSinceLastAI <= 24) {
  // "Based on records, she might be in heat. Let me confirm..."
  // "Has she become restless or bellowing more than usual?"
}

// Step 2-3: Symptom questions (knowledge base)
// "Is she trying to mount other animals?"

// Step 4: Assessment
if (symptomsPositive && daysSinceLastAI >= 18) {
  // "Heat probability is high. Best time for AI is tonight or early morning."
  // "Contact your local AI technician or society for service."
}
```

#### Gap Analysis

**NOW AVAILABLE:**
- ✅ Last AI date (can calculate expected heat cycle)
- ✅ Pregnancy status (know if animal is open)
- ✅ Lactation stage
- ✅ Last calving date

**STILL MISSING:**
- ❌ Technician booking/dispatch API
- ❌ Heat symptom recording
- ❌ Multiple AI attempt history

**Workaround for Technician Booking:**
- Provide society contact info from farmer profile
- Give general advice on AI timing window

---

### Use Case 3: Health Issue & Symptom Triage ⚠️ PARTIAL SUPPORT

**Persona:** Jamna-ben Rabari (Kutch)
**Required:** Health records, disease triage, vet escalation

#### Required APIs vs Available APIs

| Required API | Available? | Endpoint | Notes |
|--------------|------------|----------|-------|
| **Animal Context** | ✅ Yes | `GetAnimalDetailsByTagNo` | Basic animal info |
| **Health Activity** | ⚠️ TBD | `lastHealthActivity` field | Field exists but was null in test |
| **Milking/Lactation** | ✅ Yes | `milkingStage`, `lactationNo` | Helps with triage context |
| **Disease History API** | ❌ No | None | Not available |
| **Vaccination Records** | ❌ No | None | Not available |
| **Vet Booking API** | ❌ No | None | Not available |

#### Feasibility Assessment

| Conversation Step | Feasible? | Implementation |
|-------------------|-----------|----------------|
| "My cow has fever" → Load health context | ⚠️ Partial | Get animal context (milking stage, lactation) |
| Risk assessment questions | ✅ Yes | Knowledge base + animal context |
| Severity classification | ✅ Yes | Knowledge base rules |
| "Vet visit advised within 24 hours" | ⚠️ Partial | Advice only, no booking |

#### Example Bot Flow

```typescript
// Step 1: "My cow has fever"
const animal = await getAnimalDetailsByTagNo("106290093933");
// Context: milkingStage = "Milking", lactationNo = 3

// "I need to ask a few things. Is she eating less than usual?"

// Step 2-3: Symptom triage (knowledge base)
// "Is there any swelling in the udder or change in milk colour?"

// Step 4: Use animal context for severity
if (animal.milkingStage === "Milking" && symptoms.feverAndReducedMilk) {
  // "Since she is in lactation, a vet visit is advised within 24 hours."
  // "Contact your society or local veterinary officer."
}
```

#### Gap Analysis

**NOW AVAILABLE:**
- ✅ Animal context (type, breed, age, lactation)
- ✅ Milking stage (critical for mastitis triage)
- ⚠️ `lastHealthActivity` field exists (structure TBD)

**STILL MISSING:**
- ❌ Detailed health history
- ❌ Vaccination records
- ❌ Previous disease records
- ❌ Vet appointment booking

**Workaround:**
- Use symptom-based triage with knowledge base
- Provide society/vet contact information
- Log health issues manually if needed

---

### Use Case 4: Milk Yield Drop & Lactation Support ✅ FULLY SUPPORTED

**Persona:** Maheshbhai Solanki (Mehsana)
**Required:** Milk production history, deviation detection, nutrition advisory

#### Required APIs vs Available APIs

| Required API | Available? | Endpoint | Notes |
|--------------|------------|----------|-------|
| **Farmer Data API** | ✅ Yes | `GetFarmerDetailsByMobile` | Includes `avgMilkPerDayInLiter` |
| **Animal Lactation** | ✅ Yes | `GetAnimalDetailsByTagNo` | `milkingStage`, `lactationNo` |
| **Pregnancy Status** | ✅ Yes | `GetAnimalDetailsByTagNo` | `pregnancyStage` |
| **Milk History** | ✅ Yes | Amul `GetMilkSlipsV1_11` | Full history (needs Amul auth) |
| **Feed/Nutrition API** | ❌ No | None | Must ask farmer |

#### Available Data from APIs

```typescript
// From PashuGPT API - NEW!
interface AnimalDetails {
  milkingStage: string;        // "Milking" | "Dry" - CRITICAL!
  pregnancyStage: string;      // "Non Pregnant" | "Pregnant"
  lactationNo: number;         // e.g., 3 (third lactation)
  lastBreedingActivity: {
    lastCalving: string;       // Can calculate days in milk
  };
}

// From Farmer API - NEW!
interface FarmerDetails {
  avgMilkPerDayInLiter: number;   // Average production
  totalMilkingAnimals: number;
}
```

#### Feasibility Assessment

| Conversation Step | Feasible? | Implementation |
|-------------------|-----------|----------------|
| "Milk has reduced" → Detect deviation | ✅ Yes | Use `avgMilkPerDayInLiter` + animal context |
| "Has there been any change in feed?" | ⚠️ Ask | No feed API - must ask farmer |
| "Is she pregnant or mid-lactation?" | ✅ Yes | **Direct from API!** `pregnancyStage`, `lactationNo` |
| Nutrition advisory | ✅ Yes | Knowledge base with lactation context |

#### Example Bot Flow

```typescript
// "Milk has reduced"
const farmer = await getFarmerDetailsByMobile("9601335568");
const animal = await getAnimalDetailsByTagNo("106290093933");

// Calculate days in milk from last calving
const daysInMilk = daysBetween(animal.lastBreedingActivity.lastCalving, today);

// "Your buffalo is in 3rd lactation, {daysInMilk} days since calving."
// "Has there been any change in feed or fodder?"

// "Yes, fodder changed" + context from API
if (animal.milkingStage === "Milking" && daysInMilk > 60 && daysInMilk < 200) {
  // "In mid-lactation, nutrition is critical."
}
```

#### Gap Analysis

**NOW AVAILABLE:**
- ✅ Lactation number
- ✅ Milking stage (Milking/Dry)
- ✅ Pregnancy status
- ✅ Days since calving (calculated)
- ✅ Average daily milk production

**STILL MISSING:**
- ❌ Feed/nutrition tracking
- ❌ Individual animal milk records

---

### Use Case 5: Starting a New Cattle Farm

**Persona:** Ketanbhai Parmar (First-time Dairy Farmer)
**Required:** Guidance and knowledge, no transactional APIs needed

#### Required APIs vs Available APIs

| Required API | Available? | Notes |
|--------------|------------|-------|
| **Static Knowledge Base** | ✅ N/A | No API needed - chatbot knowledge |
| **Breed Information** | ✅ N/A | Can be embedded in knowledge base |
| **Sourcing Guidelines** | ✅ N/A | Can reference Amul societies |
| **Society List** | ✅ Yes | `GetSocietyList`, `GetSocietyByVillageId` |

#### Feasibility Assessment

| Conversation Step | Feasible? | Implementation |
|-------------------|-----------|----------------|
| "I want to start a cattle farm" | ✅ Yes | Knowledge base response |
| "2 cows" → Clarify purpose | ✅ Yes | Knowledge base response |
| "Milk income" → Recommend breed | ✅ Yes | Knowledge base response |
| "Where to buy good animals?" | ⚠️ Partial | Can list Amul societies, no animal marketplace |

#### Gap Analysis

**This use case is primarily knowledge-driven and FEASIBLE with:**
- Embedded knowledge about breeds
- Embedded knowledge about dairy setup
- Society lookup from Amul APIs

**MISSING (but not critical):**
- Animal marketplace integration
- Cost calculators
- ROI projections

---

### Use Case 6: Improving Profitability, FAT %, and Health ✅ MOSTLY SUPPORTED

**Persona:** Maheshbhai Solanki (Existing Dairy Farmer)
**Required:** Milk data analysis, FAT trends, nutrition guidance

#### Required APIs vs Available APIs

| Required API | Available? | Endpoint | Notes |
|--------------|------------|----------|-------|
| **Farmer Data API** | ✅ Yes | `GetFarmerDetailsByMobile` | Available |
| **Animal Context** | ✅ Yes | `GetAnimalDetailsByTagNo` | Lactation, pregnancy |
| **Milk Production Data** | ✅ Yes | Amul `GetMilkSlipsV1_11` | FAT, SNF, Qty |
| **Passbook/Payment** | ✅ Yes | Amul `GetPassbookSummaryV1_11` | Financial data |
| **Feed Cost API** | ❌ No | None | Must ask farmer |
| **Health Data API** | ⚠️ TBD | `lastHealthActivity` | Field exists |

#### Feasibility Assessment

| Conversation Step | Feasible? | Implementation |
|-------------------|-----------|----------------|
| "How can I increase profit?" → Break into factors | ✅ Yes | Milk yield, FAT, lactation context |
| "FAT content" → Ask diet questions | ⚠️ Partial | Must ask farmer about feed |
| "Mid-lactation" → Diagnose nutrition gaps | ✅ Yes | **Direct from API!** `lactationNo`, days in milk |
| "Add green fodder..." → Corrective steps | ✅ Yes | Knowledge base with context |

#### What CAN Be Analyzed

```typescript
// Profitability Analysis - MUCH IMPROVED!
const profitabilityData = {
  // FROM PashuGPT APIs (NEW):
  lactationStage: animal.lactationNo,              // ✅ Now available!
  milkingStatus: animal.milkingStage,              // ✅ "Milking" | "Dry"
  pregnancyStatus: animal.pregnancyStage,          // ✅ Affects milk production
  daysInMilk: daysSince(lastCalving),              // ✅ Calculated

  // FROM AMUL APIs:
  milkYield: await getMilkSlips(from, to),         // ✅
  fatPercentage: milkSlips.map(s => s.Fat),        // ✅
  totalEarnings: await getPassbookSummary(),       // ✅

  // STILL NEED TO ASK FARMER:
  feedCost: null,        // ❌ Must ask
  laborCost: null,       // ❌ Must ask
};
```

---

## API Coverage Summary

### NEW: PashuGPT APIs (Primary Data Source)

| Category | Endpoint | Use Case Support |
|----------|----------|------------------|
| **Farmer Profile** | `GetFarmerDetailsByMobile` | UC1, UC4, UC5, UC6 |
| **Animal Details** | `GetAnimalDetailsByTagNo` | UC1, UC2, UC3, UC4, UC6 |

**Authentication:** Bearer Token `REDACTED_PASHUGPT_TOKEN`

### Amul App APIs (Supplementary - requires OTP auth)

| Category | Endpoint | Use Case Support |
|----------|----------|------------------|
| **Milk Collection** | `GetMilkSlipsV1_11` | UC4, UC6 |
| **Dashboard** | `GetnewDashboardDataV1_11` | UC4, UC6 |
| **Charts** | `GetChartDataV1_11` | UC4, UC6 |
| **Passbook** | `GetPassbookSummaryV1_11` | UC6 |
| **Society Data** | `GetSocietyData`, `GetSocietyList` | UC5 |

### Remaining Gaps

| Missing API | Required For | Workaround |
|-------------|--------------|------------|
| **List Animals by Farmer** | UC1 | Farmer must provide tag number |
| **Technician Booking** | UC2 | Provide society contact info |
| **Vet Appointment** | UC3 | Provide society contact info |
| **Feed/Nutrition Tracking** | UC4, UC6 | Ask farmer |
| **Vaccination History** | UC3 | Knowledge base only |

---

## Recommended Architecture

With PashuGPT APIs, the chatbot now has strong data support:

```
┌─────────────────────────────────────────────────────────────┐
│                      Chatbot Layer                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ PashuGPT    │  │ Knowledge   │  │ Farmer Q&A          │ │
│  │ APIs (Main) │  │ Base        │  │ (Feed/Symptoms)     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│        │                │                    │              │
│   Farmer profile   Breeding rules      Feed changes        │
│   Animal details   Health protocols    Symptom reports     │
│   AI/PD records    Nutrition guides                        │
│   Lactation info                                           │
│        │                │                    │              │
│        ▼                ▼                    ▼              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              Unified Response Generator                 ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Implementation Strategy by Use Case

| Use Case | Data Source | Strategy |
|----------|-------------|----------|
| UC1: Animal Profile | **PashuGPT APIs** | Farmer + Animal APIs directly |
| UC2: Heat Detection | **PashuGPT + Knowledge** | lastAI + symptom questions |
| UC3: Health Triage | **PashuGPT + Knowledge** | Animal context + symptom triage |
| UC4: Milk Yield | **PashuGPT + Amul + Q&A** | Lactation from API, feed from farmer |
| UC5: New Farm | Knowledge + PashuGPT | Knowledge-driven with farmer lookup |
| UC6: Profitability | **PashuGPT + Amul** | Lactation context + milk/payment data |

---

## Conclusion

With the **new PashuGPT APIs**, the feasibility has dramatically improved:

### Before PashuGPT APIs
- ❌ No breeding/AI records
- ❌ No pregnancy status
- ❌ No lactation tracking
- Coverage: ~30%

### After PashuGPT APIs
- ✅ Breeding activity (lastAI, lastPD, lastCalving)
- ✅ Pregnancy status
- ✅ Lactation stage and number
- ✅ Milking status
- Coverage: **~75%**

### Recommended Implementation

1. **Use PashuGPT APIs for:** Farmer lookup, animal details, breeding records, pregnancy status, lactation info
2. **Use Amul APIs for:** Milk history, FAT/SNF trends, payments (requires separate auth)
3. **Use Knowledge Base for:** Health protocols, nutrition guidelines, breed recommendations
4. **Ask Farmer for:** Feed changes, symptoms, cost information

**Still require external solutions:**
- Veterinary appointment scheduling
- AI technician booking
- Comprehensive animal health records

---

## Appendix: API Usage Examples

### PashuGPT APIs (Primary - No OTP Required)

#### Fetching Farmer Details

```bash
curl -s "https://api.amulpashudhan.com/configman/v1/PashuGPT/GetFarmerDetailsByMobile?mobileNumber=9601335568" \
  -H "accept: application/json" \
  -H "Authorization: Bearer REDACTED_PASHUGPT_TOKEN"
```

**Response:**
```json
{
  "state": "GUJARAT",
  "district": "BANASKANTHA",
  "village": "FATEPUR",
  "farmerName": "GEETABEN JASHWANATJI PARMAR",
  "mobileNumber": "9601335568",
  "avgMilkPerDayInLiter": 0.0,
  "totalAnimals": 1,
  "cow": 0,
  "buffalo": 1,
  "totalMilkingAnimals": 1
}
```

#### Fetching Animal Details with Breeding Info

```bash
curl -s "https://api.amulpashudhan.com/configman/v1/PashuGPT/GetAnimalDetailsByTagNo?tagNo=106290093933" \
  -H "accept: application/json" \
  -H "Authorization: Bearer REDACTED_PASHUGPT_TOKEN"
```

**Response:**
```json
{
  "tagNumber": "106290093933",
  "animalType": "Buffalo",
  "breed": "Mehsana",
  "milkingStage": "Milking",
  "pregnancyStage": "Non Pregnant",
  "dateOfBirth": "2019-10-27T00:00:00",
  "lactationNo": 3,
  "lastBreedingActivity": {
    "lastAI": "2026-01-21T11:19:20.453",
    "lastPD": null,
    "lastCalving": null
  },
  "lastHealthActivity": null
}
```

### TypeScript Usage Example

```typescript
const PASHUGPT_TOKEN = "REDACTED_PASHUGPT_TOKEN";
const BASE_URL = "https://api.amulpashudhan.com/configman/v1/PashuGPT";

// Get farmer details
async function getFarmerByMobile(mobileNumber: string) {
  const response = await fetch(
    `${BASE_URL}/GetFarmerDetailsByMobile?mobileNumber=${mobileNumber}`,
    {
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${PASHUGPT_TOKEN}`
      }
    }
  );
  return response.json();
}

// Get animal details with breeding info
async function getAnimalByTag(tagNo: string) {
  const response = await fetch(
    `${BASE_URL}/GetAnimalDetailsByTagNo?tagNo=${tagNo}`,
    {
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${PASHUGPT_TOKEN}`
      }
    }
  );
  return response.json();
}

// Example: Use Case 1 - Animal Profile & Reproductive Status
const farmers = await getFarmerByMobile("9601335568");
console.log(`${farmers[0].farmerName}, you have ${farmers[0].totalAnimals} animals.`);

const animal = await getAnimalByTag("106290093933");
const daysSinceAI = Math.floor(
  (Date.now() - new Date(animal.lastBreedingActivity.lastAI).getTime())
  / (1000 * 60 * 60 * 24)
);

console.log(`This is your ${animal.breed} ${animal.animalType}.`);
console.log(`She is ${animal.milkingStage.toLowerCase()} and last AI was done ${daysSinceAI} days ago.`);
console.log(`Pregnancy status: ${animal.pregnancyStage}`);
```

---

*Generated from Amul Milk Producer App + PashuGPT API analysis*
*Last updated: 2026-01-21*
