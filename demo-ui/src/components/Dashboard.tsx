import { useState, useEffect } from 'react'
import type { AuthState } from '../types'
import {
  authenticatedRequest,
  getPashuGPTFarmerByMobile,
  getPashuGPTAnimalByTag,
} from '../api'
import Documentation from './Documentation'

interface Props {
  auth: AuthState
  onLogout: () => void
}

const HARDCODED_TAG_NUMBER = '106290093933'

export default function Dashboard({ auth, onLogout }: Props) {
  const [loading, setLoading] = useState(true)
  const [jwtToken, setJwtToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // API Response Data
  const [_farmerByMobile, setFarmerByMobile] = useState<any>(null)
  const [_animalByTag, setAnimalByTag] = useState<any>(null)
  const [amulFarmerDetail, setAmulFarmerDetail] = useState<any>(null)
  const [amulSocietyData, setAmulSocietyData] = useState<any>(null)

  // Fetch all APIs and generate JWT token
  useEffect(() => {
    const fetchAllData = async () => {
    setLoading(true)
      setError(null)

      try {
        // 1. Fetch FarmerByMobile (PashuGPT)
        const farmerData = await getPashuGPTFarmerByMobile(auth.mobileNumber)
        setFarmerByMobile(farmerData)

        // 2. Fetch AnimalByTag (PashuGPT) - hardcoded tag
        const animalData = await getPashuGPTAnimalByTag(HARDCODED_TAG_NUMBER)
        setAnimalByTag(animalData)

        // 3. Fetch GetFarmerDetail (Amul)
        const farmerDetail = await authenticatedRequest(
          auth.baseUrl,
          'GetFarmerDetail',
          auth.bearerToken,
          auth.deviceId
        )
        setAmulFarmerDetail(farmerDetail)

        // 4. Fetch GetSocietyData (Amul)
        const societyData = await authenticatedRequest(
          auth.baseUrl,
          'GetSocietyData',
          auth.bearerToken,
          auth.deviceId
        )
        setAmulSocietyData(societyData)

        // 5. Generate JWT token with all data (server-side)
        const tokenResponse = await fetch('/api/generate-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            farmerData,
            animalData,
            amulFarmerDetail,
            amulSocietyData,
          }),
        })

        if (!tokenResponse.ok) {
          let errorMessage = `HTTP ${tokenResponse.status}: ${tokenResponse.statusText}`
          try {
            const errorData = await tokenResponse.json()
            errorMessage = errorData.error || errorMessage
          } catch {
            // If response is not JSON, use the status text
            const text = await tokenResponse.text()
            errorMessage = text || errorMessage
          }
          throw new Error(errorMessage)
        }

        const result = await tokenResponse.json()
        if (!result.token) {
          throw new Error('Token not received from server')
        }
        setJwtToken(result.token)
      } catch (err) {
        setError((err as Error).message)
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (auth.isAuthenticated) {
      fetchAllData()
    }
  }, [auth])

  const handleOpenChat = () => {
    if (!jwtToken) {
      alert('Token not available. Please wait for data to load.')
      return
    }

    const baseUrl = import.meta.env.VITE_CHAT_BASE_URL || 'https://dev-amulmitra.amul.com'
    const chatUrl = `${baseUrl}/?token=${jwtToken}`
    window.open(chatUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-black text-white px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Amul API Dashboard</h1>
            <p className="text-neutral-400 text-sm">
              Logged in as: {auth.mobileNumber}
            </p>
          </div>
          <div className="flex gap-3">
            {jwtToken && (
              <button
                onClick={handleOpenChat}
                className="border border-white hover:bg-white hover:text-black px-4 py-2 rounded-lg transition-colors"
              >
                Open Chat with Farmer ID
              </button>
            )}
            <button
              onClick={onLogout}
              className="border border-white hover:bg-white hover:text-black px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[calc(100vh-140px)]">
          <div className="text-center">
            <div className="text-xl font-semibold mb-2">Loading farmer data...</div>
            <div className="text-neutral-500">Fetching APIs and generating token...</div>
          </div>
                </div>
              )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
        </div>
      </div>
      )}

      {/* Documentation Page */}
      {!loading && !error && <Documentation />}
    </div>
  )
}

