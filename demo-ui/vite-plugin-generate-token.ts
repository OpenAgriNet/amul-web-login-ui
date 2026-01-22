import type { Plugin } from 'vite'
import * as jose from 'jose'
import { maskSensitiveFinancialData } from './api/utils/mask-sensitive-data'

// Local dev handler for /api/generate-token
export function generateTokenPlugin(): Plugin {
  return {
    name: 'generate-token',
    configureServer(server) {
      // Use early middleware to catch the request before other handlers
      server.middlewares.use((req, res, next) => {
        // Only handle /api/generate-token requests
        if (req.url !== '/api/generate-token') {
          next()
          return
        }

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

        // Handle OPTIONS preflight
        if (req.method === 'OPTIONS') {
          res.writeHead(200)
          res.end()
          return
        }

        // Only handle POST requests
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        try {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk.toString()
          })

          req.on('end', async () => {
            try {
              if (!body) {
                res.writeHead(400, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Request body is required' }))
                return
              }

              const data = JSON.parse(body)
              const { farmerData, animalData, amulFarmerDetail, amulSocietyData } = data

              // Get JWT private key from environment variable
              // For local dev, use a test key or require env var
              const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY

              if (!JWT_PRIVATE_KEY) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ 
                  error: 'Server configuration error: JWT_PRIVATE_KEY not set. Please set it in your .env file or environment.' 
                }))
                return
              }

              // Compile all farmer and animal information into JWT payload
              // All data goes into a "data" field so backend can easily filter out standard JWT claims (iss, exp, iat, etc.)
              // Note: farmerData is an array - one mobile number can have multiple farmer registrations
              // We collate all data (PashuGPT, Amul, Society, Animal) per farmer by matching farmerCode
              // IMPORTANT: We include ALL fields from API responses to avoid data loss
              const farmers = Array.isArray(farmerData) ? farmerData : (farmerData ? [farmerData] : []);
              const amulFarmers = Array.isArray(amulFarmerDetail?.Data) ? amulFarmerDetail.Data : (amulFarmerDetail?.Data ? [amulFarmerDetail.Data] : []);
              const societyData = amulSocietyData?.Data || null;
              
              // Collate all data per farmer by matching farmerCode
              const collatedFarmers = farmers.map((pashuFarmer: any) => {
                // Find matching Amul farmer data by farmerCode
                const amulFarmer = amulFarmers.find((af: any) => af.FarmerCode === pashuFarmer.farmerCode);
                
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
                  animalDetails: animalData || null,
                };
              });
              
              const payload = {
                sub: collatedFarmers[0]?.pashuGPTData?.farmerCode || 'unknown',
                data: {
                  farmers: collatedFarmers,
                },
              }

              // Generate JWT token using jose library
              // Parse the private key (should be in PEM format with proper newlines)
              const privateKey = await jose.importPKCS8(JWT_PRIVATE_KEY.replace(/\\n/g, '\n'), 'RS256')

              // Sign the JWT
              const token = await new jose.SignJWT(payload)
                .setProtectedHeader({ alg: 'RS256' })
                .setIssuedAt()
                .setExpirationTime('24h')
                .sign(privateKey)

              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ token }))
            } catch (error) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: (error as Error).message }))
            }
          })
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: (error as Error).message }))
        }
      })
    },
  }
}
