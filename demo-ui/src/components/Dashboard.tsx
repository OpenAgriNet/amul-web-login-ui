import { useState, useEffect } from 'react'
import type { AuthState } from '../types'

interface Props {
  auth: AuthState
  onLogout: () => void
}

export default function Dashboard({ auth }: Props) {
  const [loading, setLoading] = useState(true)
  const [jwtToken, setJwtToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [_combinedData, setCombinedData] = useState<any>(null)

  // Fetch combined PashuGPT data and generate JWT token
  useEffect(() => {
    const fetchDataAndGenerateToken = async () => {
      setLoading(true)
      setError(null)

      try {
        // 1. Fetch combined PashuGPT data (farmer + animals + cvcc)
        const combinedResponse = await fetch(`/api/pashugpt/combined?mobileNumber=${auth.mobileNumber}`)

        if (!combinedResponse.ok) {
          throw new Error(`Failed to fetch data: ${combinedResponse.statusText}`)
        }

        const data = await combinedResponse.json()
        setCombinedData(data)

        // 2. Generate JWT token with combined data
        const tokenResponse = await fetch('/api/generate-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (!tokenResponse.ok) {
          let errorMessage = `HTTP ${tokenResponse.status}: ${tokenResponse.statusText}`
          try {
            const errorData = await tokenResponse.json()
            errorMessage = errorData.error || errorMessage
          } catch {
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

    if (auth.isAuthenticated && !jwtToken && !error) {
      fetchDataAndGenerateToken()
    }
  }, [auth])


  return (
    <div className="h-screen flex flex-col bg-gray-100">
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

      {/* Missing Token State */}
      {!loading && !error && !jwtToken && (
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-600">Token not available. Please wait for data to load.</p>
          </div>
        </div>
      )}

      {/* Chat Content */}
      {jwtToken && (
        <div className="flex-1 flex flex-col">
          <div className="w-full flex-1 overflow-hidden">
            <iframe
              src={`${import.meta.env.VITE_CHAT_BASE_URL || 'https://dev-amulmitra.amul.com'}/?token=${jwtToken}`}
              className="w-full h-full border-none"
              title="Amul AI Chat"
              allow="geolocation; microphone"
            />
          </div>
        </div>
      )}
    </div>
  )
}