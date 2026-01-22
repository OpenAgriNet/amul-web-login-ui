import { useState } from 'react'
import LoginForm from './components/LoginForm'
import Dashboard from './components/Dashboard'
import type { AuthState } from './types'

function App() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    mobileNumber: '',
    bearerToken: '',
    baseUrl: 'https://farmer.amulamcs.com/',
    deviceId: '',
  })

  const handleLogin = (newAuth: AuthState) => {
    setAuth(newAuth)
  }

  if (!auth.isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return <Dashboard
    auth={auth}
    onLogout={() => setAuth({
      isAuthenticated: false,
      mobileNumber: '',
      bearerToken: '',
      baseUrl: 'https://farmer.amulamcs.com/',
      deviceId: '',
    })}
  />
}

export default App
