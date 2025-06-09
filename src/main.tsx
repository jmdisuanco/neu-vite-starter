import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { init, extensions } from "@neutralinojs/lib"

const startNeutralino = async () => {
  init();
  const ext = await extensions.getStats()
  console.log(ext);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
startNeutralino(); 
