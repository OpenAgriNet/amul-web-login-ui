import * as jose from 'jose';
import { Request, Response } from 'express';
import { maskSensitiveFinancialData } from '../../api/utils/mask-sensitive-data';

export async function generateTokenHandler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Combined API data structure: { farmerData, animalData, amulFarmerDetail, amulSocietyData }
    // This matches the structure from the frontend combined API call
    const data = req.body;
    const { farmerData, animalData, amulFarmerDetail, amulSocietyData } = data;

    // Get JWT private key from environment variable
    const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

    if (!JWT_PRIVATE_KEY) {
      return res.status(500).json({ error: 'Server configuration error: JWT_PRIVATE_KEY not set' });
    }

    // Compile all farmer and animal information into JWT payload
    // All data goes into a "data" field so backend can easily filter out standard JWT claims
    // Note: farmerData is an array - one mobile number can have multiple farmer registrations
    // We collate all data (PashuGPT, Amul, Society, Animal) per farmer by matching farmerCode
    const farmers = Array.isArray(farmerData) ? farmerData : (farmerData ? [farmerData] : []);
    const amulFarmers = Array.isArray(amulFarmerDetail?.Data) ? amulFarmerDetail.Data : (amulFarmerDetail?.Data ? [amulFarmerDetail.Data] : []);
    const societyData = amulSocietyData?.Data || null;
    
    // Collate all data per farmer by matching farmerCode
    const collatedFarmers = farmers.map((pashuFarmer: any) => {
      // Find matching Amul farmer data by farmerCode
      const amulFarmer = amulFarmers.find((af: any) => af.FarmerCode === pashuFarmer.farmerCode);
      
      // Mask sensitive financial information before including in JWT
      const maskedAmulFarmer = amulFarmer ? maskSensitiveFinancialData(amulFarmer) : null;
      
      return {
        // PashuGPT data - include ALL fields from the response
        pashuGPTData: pashuFarmer,
        // Amul farmer data (matched by farmerCode) - sensitive financial fields are masked
        amulData: maskedAmulFarmer,
        // Society data (shared, but included per farmer for convenience)
        society: societyData || null,
        // Animal details (single animal by tag - included in all farmers since it's tag-based query)
        animalDetails: animalData || null,
      };
    });
    
    const payload = {
      sub: collatedFarmers[0]?.pashuGPTData?.farmerCode || 'unknown',
      data: {
        farmers: collatedFarmers,
      },
    };

    // Generate JWT token using jose library
    const privateKey = await jose.importPKCS8(JWT_PRIVATE_KEY.replace(/\\n/g, '\n'), 'RS256');

    // Sign the JWT with 24h expiration
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(privateKey);

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
