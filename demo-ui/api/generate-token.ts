import * as jose from 'jose';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const data = await request.json();
    const { farmerData, animalData, amulFarmerDetail, amulSocietyData } = data;

    // Get JWT private key from environment variable
    const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
    
    if (!JWT_PRIVATE_KEY) {
      return new Response(JSON.stringify({ error: 'Server configuration error: JWT_PRIVATE_KEY not set' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Compile all farmer and animal information into JWT payload
    // All data goes into a "data" field so backend can easily filter out standard JWT claims (iss, exp, iat, etc.)
    // Note: farmerData is an array - one mobile number can have multiple farmer registrations
    // We collate all data (PashuGPT, Amul, Society, Animal) per farmer by matching farmerCode
    const farmers = Array.isArray(farmerData) ? farmerData : (farmerData ? [farmerData] : []);
    const amulFarmers = Array.isArray(amulFarmerDetail?.Data) ? amulFarmerDetail.Data : (amulFarmerDetail?.Data ? [amulFarmerDetail.Data] : []);
    const societyData = amulSocietyData?.Data || null;
    
    // Collate all data per farmer by matching farmerCode
    const collatedFarmers = farmers.map((pashuFarmer: any) => {
      // Find matching Amul farmer data by farmerCode
      const amulFarmer = amulFarmers.find((af: any) => af.FarmerCode === pashuFarmer.farmerCode);
      
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
        animalDetails: animalData ? {
          tagNumber: animalData.tagNumber,
          animalType: animalData.animalType,
          breed: animalData.breed,
          lactationNo: animalData.lactationNo,
          milkingStage: animalData.milkingStage,
          pregnancyStage: animalData.pregnancyStage,
          dateOfBirth: animalData.dateOfBirth,
          lastBreedingActivity: animalData.lastBreedingActivity,
          lastHealthActivity: animalData.lastHealthActivity,
        } : null,
      };
    });
    
    const payload = {
      sub: collatedFarmers[0]?.farmerCode || 'unknown',
      data: {
        farmers: collatedFarmers,
      },
    };

    // Generate JWT token using jose library (Edge Runtime compatible)
    // Parse the private key (should be in PEM format with proper newlines)
    // Note: JWT_PRIVATE_KEY should be in PKCS#8 format (starts with -----BEGIN PRIVATE KEY-----)
    // If stored as env var, ensure newlines are preserved (use \n or actual newlines)
    const privateKey = await jose.importPKCS8(JWT_PRIVATE_KEY.replace(/\\n/g, '\n'), 'RS256');
    
    // Sign the JWT
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(privateKey);

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
