import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { SensoryProvider } from './context/SensoryContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SensoryProvider>
        <App />
      </SensoryProvider>
    </AuthProvider>
  </StrictMode>,
)
