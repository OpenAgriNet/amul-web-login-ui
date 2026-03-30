import { useState, useEffect } from 'react'
import type { AuthState } from '../types'
import { getTokenForPhone } from '../api'

interface Props {
  auth: AuthState
  onLogout: () => void
}

export default function Dashboard({ auth }: Props) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchTokenAndRedirect = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await getTokenForPhone(auth.mobileNumber)

        if (cancelled) return

        // Redirect to chat URL
        if (result.url) {
          window.location.href = result.url
        } else {
          // Fallback: build URL manually
          const baseUrl = import.meta.env.VITE_CHAT_BASE_URL || 'https://dev-amulmitra.amul.com'
          window.location.href = `${baseUrl}/?token=${result.access_token}`
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as Error).message)
          setLoading(false)
        }
      }
    }

    if (auth.isAuthenticated) {
      fetchTokenAndRedirect()
    }

    return () => { cancelled = true }
  }, [auth.isAuthenticated, auth.mobileNumber])

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {loading && (
        <div className="flex items-center justify-center min-h-[calc(100vh-140px)]">
          <div className="text-center">
            <div className="text-xl font-semibold mb-2">Loading farmer data...</div>
            <div className="text-neutral-500">Fetching profile and generating token...</div>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
