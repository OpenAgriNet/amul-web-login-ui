import { useState } from 'react'
import { AuthState } from '../App'
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

      if (otpResponse.StatusCode === 200) {
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

      if (response.StatusCode === 200 && response.Data) {
        onLogin({
          isAuthenticated: true,
          mobileNumber,
          bearerToken: response.Data,
          baseUrl,
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
            <h1 className="text-3xl font-bold text-blue-600">Amul API Demo</h1>
            <p className="text-gray-500 mt-2">Login with OTP to access farmer data</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {step === 'mobile' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={10}
                />
              </div>
              <button
                onClick={handleSendOtp}
                disabled={loading || mobileNumber.length !== 10}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP sent to your phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={6}
                />
                <p className="text-sm text-gray-500 mt-1">
                  OTP sent to {mobileNumber}
                </p>
              </div>
              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length < 4}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                onClick={() => setStep('mobile')}
                className="w-full text-blue-600 py-2 hover:underline"
              >
                Change mobile number
              </button>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Device ID: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{deviceId.slice(0, 18)}...</code></p>
          </div>
        </div>
      </div>

      {/* Right side - API Response */}
      <div className="w-1/2 bg-gray-900 p-8 overflow-auto">
        <h2 className="text-lg font-semibold text-white mb-4">API Responses</h2>
        {apiResponse ? (
          <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-500">API responses will appear here...</p>
        )}
      </div>
    </div>
  )
}
