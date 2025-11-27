import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

// // Silence console output in production builds to avoid leaking debug logs
// if (!import.meta.env.DEV) {
//   const noop = () => {}
//   ;["log", "debug", "info", "warn", "error", "group", "groupCollapsed", "groupEnd", "table"].forEach(
//     (m) => {
//       try {
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-ignore
//         console[m] = noop
//       } catch (e) {
//         // ignore
//       }
//     },
//   )
// }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
