import { createRoot } from 'react-dom/client'

import App from './App'
import { CounterContextProvider } from './CounterContext'

createRoot(document.getElementById('root')).render(
  <CounterContextProvider>
    <App />
  </CounterContextProvider>
)