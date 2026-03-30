// OAN backend base URL — same-origin by default, override with VITE_OAN_API_BASE_URL
const OAN_API_BASE = import.meta.env.VITE_OAN_API_BASE_URL ?? ''

// Demo-UI API key for the token-for-phone endpoint
const API_KEY = import.meta.env.VITE_DEMO_UI_API_KEY ?? ''

export interface TokenForPhoneResponse {
  url: string | null
  access_token: string
  token_type: string
  expires_in: number
  farmer_records_count: number
}

/**
 * Call the OAN backend to generate a JWT with farmer data for a phone number.
 * The backend fetches PashuGPT data and embeds it in the token.
 */
export async function getTokenForPhone(phone: string): Promise<TokenForPhoneResponse> {
  const response = await fetch(
    `${OAN_API_BASE}/api/auth/token-for-phone?api_key=${encodeURIComponent(API_KEY)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    }
  )

  if (!response.ok) {
    let message = `HTTP ${response.status}: ${response.statusText}`
    try {
      const data = await response.json()
      message = data.detail || message
    } catch {
      // ignore parse errors
    }
    throw new Error(message)
  }

  return response.json()
}
