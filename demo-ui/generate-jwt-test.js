import * as jose from 'jose';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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
const farmers = Array.isArray(farmerByMobile) ? farmerByMobile : (farmerByMobile ? [farmerByMobile] : []);
const amulFarmers = Array.isArray(amulFarmerDetail.Data) ? amulFarmerDetail.Data : (amulFarmerDetail.Data ? [amulFarmerDetail.Data] : []);
const societyData = amulSocietyData.Data || null;

// Collate all data per farmer by matching farmerCode
const collatedFarmers = farmers.map((pashuFarmer) => {
  // Find matching Amul farmer data by farmerCode
  const amulFarmer = amulFarmers.find((af) => af.FarmerCode === pashuFarmer.farmerCode);
  
  return {
    // PashuGPT data
    farmerCode: pashuFarmer.farmerCode,
    farmerName: pashuFarmer.farmerName,
    mobileNumber: pashuFarmer.mobileNumber,
    village: pashuFarmer.village,
    district: pashuFarmer.district,
    subDistrict: pashuFarmer.subDistrict,
    state: pashuFarmer.state,
    animalCount: {
      cow: pashuFarmer.cow || 0,
      buffalo: pashuFarmer.buffalo || 0,
      totalAnimals: pashuFarmer.totalAnimals || 0,
      totalMilkingAnimals: pashuFarmer.totalMilkingAnimals || 0,
    },
    avgMilkPerDayInLiter: pashuFarmer.avgMilkPerDayInLiter,
    // Amul farmer data (matched by farmerCode)
    amulData: amulFarmer ? {
      farmerId: amulFarmer.FarmerId,
      bankName: amulFarmer.BankName,
      bankAccountNo: amulFarmer.BankAccountNo,
      ifscCode: amulFarmer.IFSCCode,
      bankBranchCode: amulFarmer.BankBranchCode,
      isMember: amulFarmer.IsMember,
      address: amulFarmer.Address,
      email: amulFarmer.Email,
      whatsAppNo: amulFarmer.WhatsAppNo,
      cattleBuySellGuid: amulFarmer.CattleBuySellGuid,
      latitude: amulFarmer.Latitude,
      longitude: amulFarmer.Longitude,
    } : null,
    // Society data (shared, but included per farmer for convenience)
    society: societyData ? {
      societyId: societyData.SocietyId,
      societyName: societyData.SocietyName,
      societyCode: societyData.SocietyCode,
      unionName: societyData.UnionName,
      unionCode: societyData.UnionCode,
      unionId: societyData.UnionId,
    } : null,
    // Animal details (single animal by tag - included in all farmers since it's tag-based query)
    animalDetails: animalByTag ? {
      tagNumber: animalByTag.tagNumber,
      animalType: animalByTag.animalType,
      breed: animalByTag.breed,
      lactationNo: animalByTag.lactationNo,
      milkingStage: animalByTag.milkingStage,
      pregnancyStage: animalByTag.pregnancyStage,
      dateOfBirth: animalByTag.dateOfBirth,
      lastBreedingActivity: animalByTag.lastBreedingActivity,
      lastHealthActivity: animalByTag.lastHealthActivity,
    } : null,
  };
});

const payload = {
  sub: collatedFarmers[0]?.farmerCode || 'unknown',
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
