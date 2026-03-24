import { useState } from 'react'
import LoginForm from './components/LoginForm'
import Dashboard from './components/Dashboard'
import type { AuthState } from './types'

function App() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    mobileNumber: '',
  })

  if (!auth.isAuthenticated) {
    return <LoginForm onLogin={setAuth} />
  }

  return (
    <Dashboard
      auth={auth}
      onLogout={() => setAuth({ isAuthenticated: false, mobileNumber: '' })}
    />
  )
}

export default App
