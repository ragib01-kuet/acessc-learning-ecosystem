import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type Language = 'en' | 'bn'

interface LanguageContextValue {
  lang: Language
  setLang: (lang: Language) => void
  t: (en: string, bn: string) => string
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (en) => en,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('acescc-lang')
    return (saved === 'bn' ? 'bn' : 'en') as Language
  })

  const handleSetLang = useCallback((newLang: Language) => {
    setLang(newLang)
    localStorage.setItem('acescc-lang', newLang)
  }, [])

  const t = useCallback((en: string, bn: string) => {
    return lang === 'bn' ? bn : en
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
