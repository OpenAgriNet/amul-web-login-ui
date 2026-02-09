import { useState } from 'react'
import type { AuthState } from '../types'
const AmulLogo = '/AmulLogo.svg';
const AmulTextImg = '/amulTextImg.svg';

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
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #FFF2F2 0%, #FFFFFF 100%)' }}
    >
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-24 h-24 mb-6 animate-smart-pulsate">
            <img src={AmulLogo} alt="Amul Logo" className="w-full h-full object-contain p-2" />
          </div>
          <img src={AmulTextImg} alt="Amul AI" className="h-10 object-contain" />
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
              className="w-full px-4 py-3 border border-[#E2E2E2] rounded-lg focus:ring-1 focus:ring-[#FF4A4A] focus:border-[#FF4A4A] outline-none"
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
            className="w-full text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{ background: 'linear-gradient(90deg, #218FFF 0%, #FF1150 100%)' }}
          >
            {loading ? 'Loading...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}
