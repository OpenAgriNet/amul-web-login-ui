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
  const [showLogin, setShowLogin] = useState(false)

  const handleLogin = (newAuth: AuthState) => {
    setAuth(newAuth)
    setShowLogin(false)
  }

  if (showLogin && !auth.isAuthenticated) {
    return (
      <div>
        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-4 right-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Back to Dashboard
        </button>
        <LoginForm onLogin={handleLogin} />
      </div>
    )
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
    onLoginClick={() => setShowLogin(true)}
  />
}

export default App
