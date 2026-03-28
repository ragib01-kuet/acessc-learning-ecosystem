import { LanguageProvider } from './contexts/LanguageContext'
import AppRouter from './router'

export default function App() {
  return (
    <LanguageProvider>
      <AppRouter />
    </LanguageProvider>
  )
}
