import { useState } from 'react'
import LoginForm from './components/LoginForm'
import Dashboard from './components/Dashboard'

export interface AuthState {
  isAuthenticated: boolean
  mobileNumber: string
  bearerToken: string
  baseUrl: string
}

function App() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    mobileNumber: '',
    bearerToken: '',
    baseUrl: 'https://farmer.amulamcs.com/',
  })

  if (!auth.isAuthenticated) {
    return <LoginForm onLogin={setAuth} />
  }

  return <Dashboard auth={auth} onLogout={() => setAuth({
    isAuthenticated: false,
    mobileNumber: '',
    bearerToken: '',
    baseUrl: 'https://farmer.amulamcs.com/',
  })} />
}

export default App
