import { Card, CardContent } from '@blinkdotnew/ui'
import { Languages } from 'lucide-react'

interface StepLanguageProps {
  value: string
  onChange: (value: string) => void
}

const languages = [
  {
    id: 'en',
    title: 'English',
    nativeLabel: 'English',
    flag: '🇬🇧',
    description: 'Study materials and explanations in English',
  },
  {
    id: 'bn',
    title: 'বাংলা',
    nativeLabel: 'Bangla',
    flag: '🇧🇩',
    description: 'বাংলায় পড়াশোনার সামগ্রী এবং ব্যাখ্যা',
  },
] as const

export function StepLanguage({ value, onChange }: StepLanguageProps) {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold text-foreground tracking-tight">
          Choose your language
        </h2>
        <p className="text-muted-foreground text-base">
          All lessons and explanations will be in your preferred language.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {languages.map((lang) => {
          const selected = value === lang.id
          return (
            <Card
              key={lang.id}
              className={`
                relative cursor-pointer transition-all duration-200
                hover:shadow-lg hover:-translate-y-0.5
                active:scale-[0.98]
                ${selected
                  ? 'border-accent bg-accent/5 ring-2 ring-accent/30 shadow-md'
                  : 'border-border hover:border-accent/40'
                }
              `}
              onClick={() => onChange(lang.id)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div
                  className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-200
                    ${selected
                      ? 'bg-accent/10 scale-110'
                      : 'bg-secondary'
                    }
                  `}
                >
                  {lang.flag}
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {lang.title}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                    <Languages className="w-3.5 h-3.5" />
                    <span className="text-xs">{lang.nativeLabel}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {lang.description}
                  </p>
                </div>
                {selected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent flex items-center justify-center animate-fade-in">
                    <svg className="w-3 h-3 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
