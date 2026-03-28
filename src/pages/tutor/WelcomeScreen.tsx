/**
 * WelcomeScreen — Centered welcome state for the AI Tutor when no chat is active.
 * Shows a greeting, description, and 4 suggestion cards.
 */
import { Bot, Atom, FlaskConical, Zap, TestTubes } from 'lucide-react'

interface WelcomeScreenProps {
  lang: 'en' | 'bn'
  t: (en: string, bn: string) => string
  onSendMessage: (content: string) => void
}

const SUGGESTIONS = [
  {
    icon: Zap,
    en: "Explain Newton's Laws",
    bn: 'নিউটনের সূত্র ব্যাখ্যা করো',
  },
  {
    icon: Atom,
    en: 'Solve a motion problem',
    bn: 'গতির সমস্যা সমাধান করো',
  },
  {
    icon: FlaskConical,
    en: 'What is pH scale?',
    bn: 'pH স্কেল কী?',
  },
  {
    icon: TestTubes,
    en: 'Explain chemical bonding',
    bn: 'রাসায়নিক বন্ধন ব্যাখ্যা করো',
  },
] as const

export function WelcomeScreen({ lang, t, onSendMessage }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="relative max-w-lg w-full text-center space-y-8">
        {/* Background orbs */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-40 h-40 bg-secondary/40 rounded-full blur-3xl pointer-events-none" />

        {/* Icon */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center ring-1 ring-accent/20">
          <Bot className="h-8 w-8 text-accent" />
        </div>

        {/* Title & description */}
        <div className="relative space-y-3">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {t('AceSSC AI Tutor', 'AceSSC AI শিক্ষক')}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            {t(
              'I can help you with Physics and Chemistry concepts, solve problems, and prepare for your SSC exam.',
              'আমি পদার্থবিজ্ঞান ও রসায়নের ধারণা বুঝতে, সমস্যা সমাধান করতে এবং SSC পরীক্ষার প্রস্তুতিতে সাহায্য করতে পারি।',
            )}
          </p>
        </div>

        {/* Suggestion cards */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SUGGESTIONS.map((item) => {
            const text = lang === 'bn' ? item.bn : item.en
            return (
              <button
                key={item.en}
                type="button"
                onClick={() => onSendMessage(text)}
                className="group flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border
                  text-left transition-all duration-200
                  hover:border-accent/40 hover:shadow-md hover:shadow-accent/5 hover:scale-[1.02]
                  active:scale-[0.98]"
              >
                <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center
                  group-hover:bg-accent/20 transition-colors duration-200">
                  <item.icon className="h-4.5 w-4.5 text-accent" />
                </div>
                <span className="text-sm font-medium text-foreground">{text}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
