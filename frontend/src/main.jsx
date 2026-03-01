import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'
import { API_BASE_URL } from './config/runtime'

axios.interceptors.request.use((config) => {
  if (typeof config.url === 'string' && config.url.startsWith('http://localhost:5000')) {
    if (API_BASE_URL) {
      config.url = config.url.replace('http://localhost:5000', API_BASE_URL)
    } else {
      config.url = config.url.replace('http://localhost:5000', '')
    }
  }

  if (
    typeof window !== 'undefined' &&
    window.location.protocol === 'https:' &&
    typeof config.url === 'string' &&
    config.url.startsWith('http://')
  ) {
    config.url = config.url.replace(/^http:\/\//, 'https://')
  }

  return config
})


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
