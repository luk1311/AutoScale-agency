import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initMetaPixel } from './lib/metaPixel'
import { captureAttribution } from './lib/attribution'

// Medición: capturamos el origen del clic (fbclid/UTMs) ANTES de inicializar el
// Pixel, y arrancamos el Pixel (PageView) solo si hay VITE_META_PIXEL_ID.
captureAttribution()
initMetaPixel()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
