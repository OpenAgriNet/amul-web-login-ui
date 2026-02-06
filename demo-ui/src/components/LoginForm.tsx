import { useState } from 'react'
import type { AuthState } from '../types'

interface Props {
  onLogin: (auth: AuthState) => void
}

export default function LoginForm({ onLogin }: Props) {
  const [mobileNumber, setMobileNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      // Simply proceed with the mobile number - no OTP verification
      onLogin({
        isAuthenticated: true,
        mobileNumber,
        bearerToken: '', // Not needed for PashuGPT-only flow
        baseUrl: '',
        deviceId: '',
      })
    } catch (err) {
      setError('Error: ' + (err as Error).message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black">Amul AI</h1>
          <p className="text-neutral-500 mt-2">Enter your mobile number to continue</p>
        </div>

        {error && (
          <div className="border border-red-300 bg-red-50 text-red-800 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter 10-digit mobile number"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
              maxLength={10}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && mobileNumber.length === 10) {
                  handleSubmit()
                }
              }}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || mobileNumber.length !== 10}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}
