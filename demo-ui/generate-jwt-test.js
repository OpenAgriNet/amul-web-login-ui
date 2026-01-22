import * as jose from 'jose';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { maskSensitiveFinancialData } from './api/utils/mask-sensitive-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the response files
const farmerByMobile = JSON.parse(
  readFileSync(join(__dirname, '../getFarmerByMobileResponse.json'), 'utf-8')
);
const animalByTag = JSON.parse(
  readFileSync(join(__dirname, '../getAnimalByTagResponse.json'), 'utf-8')
);
const amulFarmerDetail = JSON.parse(
  readFileSync(join(__dirname, '../getFarmerDetailResponse.json'), 'utf-8')
);
const amulSocietyData = JSON.parse(
  readFileSync(join(__dirname, '../getSocietyDataResponse.json'), 'utf-8')
);

// Structure the payload according to our JWT format
// Note: farmerByMobile is an array - one mobile number can have multiple farmer registrations
// We collate all data (PashuGPT, Amul, Society, Animal) per farmer by matching farmerCode
// IMPORTANT: We include ALL fields from API responses to avoid data loss
const farmers = Array.isArray(farmerByMobile) ? farmerByMobile : (farmerByMobile ? [farmerByMobile] : []);
const amulFarmers = Array.isArray(amulFarmerDetail.Data) ? amulFarmerDetail.Data : (amulFarmerDetail.Data ? [amulFarmerDetail.Data] : []);
const societyData = amulSocietyData.Data || null;

// Collate all data per farmer by matching farmerCode
const collatedFarmers = farmers.map((pashuFarmer) => {
  // Find matching Amul farmer data by farmerCode
  const amulFarmer = amulFarmers.find((af) => af.FarmerCode === pashuFarmer.farmerCode);
  
  // Mask sensitive financial information before including in JWT
  // Based on OpenAPI spec: BankAccountNo, IFSCCode, BankBranchCode are sensitive
  // BankName is kept unmasked as it's not sensitive
  const maskedAmulFarmer = amulFarmer ? maskSensitiveFinancialData(amulFarmer) : null;
  
  return {
    // PashuGPT data - include ALL fields from the response
    pashuGPTData: pashuFarmer,
    // Amul farmer data (matched by farmerCode) - sensitive financial fields are masked
    amulData: maskedAmulFarmer,
    // Society data (shared, but included per farmer for convenience) - include ALL fields
    society: societyData || null,
    // Animal details (single animal by tag - included in all farmers since it's tag-based query) - include ALL fields
    animalDetails: animalByTag || null,
  };
});

const payload = {
  sub: collatedFarmers[0]?.pashuGPTData?.farmerCode || 'unknown',
  data: {
    farmers: collatedFarmers,
  },
};

console.log('JWT Payload:');
console.log(JSON.stringify(payload, null, 2));
console.log('\n---\n');

// Use actual private key from environment variable, or generate test key
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

let privateKey;

if (JWT_PRIVATE_KEY) {
  console.log('Using JWT_PRIVATE_KEY from environment...');
  // Parse the private key (should be in PEM format with proper newlines)
  privateKey = await jose.importPKCS8(JWT_PRIVATE_KEY.replace(/\\n/g, '\n'), 'RS256');
} else {
  console.log('⚠️  No JWT_PRIVATE_KEY found in environment.');
  console.log('Generating a temporary test key pair (token will NOT be valid for production)...');
  const keyPair = await jose.generateKeyPair('RS256');
  privateKey = keyPair.privateKey;
  
  // Export the test key so user can see it
  const exportedKey = await jose.exportPKCS8(keyPair.privateKey);
  console.log('\nTest Private Key (for reference only):');
  console.log(exportedKey);
  console.log('\n---\n');
}

// Sign the JWT
const token = await new jose.SignJWT(payload)
  .setProtectedHeader({ alg: 'RS256' })
  .setIssuedAt()
  .setExpirationTime('24h')
  .sign(privateKey);

console.log('Generated JWT Token:');
console.log(token);
console.log('\n---\n');

// Decode to verify (without verification, just to show the payload)
const decoded = jose.decodeJwt(token);
console.log('Decoded JWT (for verification):');
console.log(JSON.stringify(decoded, null, 2));
