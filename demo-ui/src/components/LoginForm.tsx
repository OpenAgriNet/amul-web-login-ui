import { useState } from 'react'
import type { AuthState } from '../types'
import { getApiUrl, sendOtp, verifyOtp, generateDeviceId } from '../api'

interface Props {
  onLogin: (auth: AuthState) => void
}

export default function LoginForm({ onLogin }: Props) {
  const [mobileNumber, setMobileNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [deviceId] = useState(generateDeviceId())
  const [baseUrl, setBaseUrl] = useState('https://farmer.amulamcs.com/')
  const [apiResponse, setApiResponse] = useState<any>(null)

  const handleSendOtp = async () => {
    setLoading(true)
    setError('')
    try {
      // Step 1: Get API URL
      const urlResponse = await getApiUrl(mobileNumber)
      setApiResponse({ getApiUrl: urlResponse })

      if (urlResponse.StatusCode === 200 && urlResponse.Data?.Url) {
        setBaseUrl(urlResponse.Data.Url)
      }

      // Step 2: Send OTP
      const otpResponse = await sendOtp(mobileNumber, deviceId)
      setApiResponse((prev: any) => ({ ...prev, sendOtp: otpResponse }))

      if (otpResponse.StatusCode === 200 || otpResponse.StatusCode === 1) {
        setStep('otp')
      } else {
        setError(otpResponse.Message || 'Failed to send OTP')
      }
    } catch (err) {
      setError('Network error: ' + (err as Error).message)
    }
    setLoading(false)
  }

  const handleVerifyOtp = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await verifyOtp(mobileNumber, otp, deviceId)
      setApiResponse((prev: any) => ({ ...prev, verifyOtp: response }))

      if ((response.StatusCode === 200 || response.StatusCode === 1) && response.Data) {
        onLogin({
          isAuthenticated: true,
          mobileNumber,
          bearerToken: typeof response.Data === 'string' ? response.Data : response.Data.TokenNo,
          baseUrl,
          deviceId,
        })
      } else {
        setError(response.Message || 'Invalid OTP')
      }
    } catch (err) {
      setError('Network error: ' + (err as Error).message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-1/2 flex items-center justify-center bg-white p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black">Amul API Demo</h1>
            <p className="text-neutral-500 mt-2">Login with OTP to access farmer data</p>
          </div>

          {error && (
            <div className="border border-black bg-neutral-50 text-black px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {step === 'mobile' ? (
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
                />
              </div>
              <button
                onClick={handleSendOtp}
                disabled={loading || mobileNumber.length !== 10}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP sent to your phone"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                  maxLength={6}
                />
                <p className="text-sm text-neutral-500 mt-1">
                  OTP sent to {mobileNumber}
                </p>
              </div>
              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length < 4}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                onClick={() => setStep('mobile')}
                className="w-full text-black py-2 hover:underline"
              >
                Change mobile number
              </button>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-neutral-500">
            <p>Device ID: <code className="bg-neutral-100 border border-neutral-200 px-2 py-1 rounded text-xs font-mono">{deviceId.slice(0, 18)}...</code></p>
          </div>
        </div>
      </div>

      {/* Right side - API Response */}
      <div className="w-1/2 bg-black p-8 overflow-auto">
        <h2 className="text-lg font-semibold text-white mb-4">API Responses</h2>
        {apiResponse ? (
          <pre className="text-neutral-300 text-sm font-mono whitespace-pre-wrap">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        ) : (
          <p className="text-neutral-500">API responses will appear here...</p>
        )}
      </div>
    </div>
  )
}
