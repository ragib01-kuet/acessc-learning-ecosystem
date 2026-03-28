/**
 * SubjectsPage — Subject selection screen for AceSSC.
 *
 * Shows Physics and Chemistry as large, beautiful interactive cards.
 * Fully bilingual (en/bn), uses @blinkdotnew/ui exclusively.
 */
import { Card, CardContent, Badge } from '@blinkdotnew/ui'
import { Atom, FlaskConical, ArrowRight, GraduationCap } from 'lucide-react'

interface SubjectsPageProps {
  subjects: Array<{
    id: string
    name: string
    nameBn: string
    icon: string
    totalChapters: number
  }>
  lang: 'en' | 'bn'
  t: (en: string, bn: string) => string
  onSelectSubject: (subjectId: string) => void
}

const SUBJECT_STYLES: Record<string, {
  icon: React.ReactNode
  iconBg: string
  borderHover: string
  accentDot: string
}> = {
  physics: {
    icon: <Atom className="h-8 w-8" />,
    iconBg: 'bg-accent/10 text-accent',
    borderHover: 'hover:border-accent/40',
    accentDot: 'bg-accent',
  },
  chemistry: {
    icon: <FlaskConical className="h-8 w-8" />,
    iconBg: 'bg-[hsl(var(--chart-3)/.1)] text-[hsl(var(--chart-3))]',
    borderHover: 'hover:border-[hsl(var(--chart-3)/.4)]',
    accentDot: 'bg-[hsl(var(--chart-3))]',
  },
}

function getStyle(name: string) {
  const key = name.toLowerCase()
  return SUBJECT_STYLES[key] ?? SUBJECT_STYLES.physics
}

function SubjectsPage({ subjects, lang, t, onSelectSubject }: SubjectsPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -bottom-60 -left-40 w-[600px] h-[600px] rounded-full bg-secondary/30 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8">
        {/* Header */}
        <header
          className="animate-slide-up space-y-2 text-center"
          style={{ animationFillMode: 'backwards' }}
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-2">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {t('Choose Your Subject', 'বিষয় নির্বাচন করুন')}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            {t(
              'Select a subject to explore chapters and start learning',
              'অধ্যায় দেখতে এবং পড়া শুরু করতে একটি বিষয় নির্বাচন করো',
            )}
          </p>
        </header>

        {/* Subject Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {subjects.map((subject, i) => {
            const style = getStyle(subject.name)

            return (
              <Card
                key={subject.id}
                className={`
                  animate-slide-up group cursor-pointer
                  transition-all duration-200
                  hover:shadow-xl hover:scale-[1.02]
                  active:scale-[0.98]
                  ${style.borderHover}
                `}
                style={{
                  animationDelay: `${120 + i * 100}ms`,
                  animationFillMode: 'backwards',
                }}
                onClick={() => onSelectSubject(subject.id)}
              >
                <CardContent className="flex items-center gap-5 py-7 px-6 sm:px-8">
                  {/* Icon circle */}
                  <div
                    className={`
                      relative flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center
                      ${style.iconBg}
                      transition-transform duration-200 group-hover:scale-110
                    `}
                  >
                    {style.icon}
                    {/* Decorative dot */}
                    <span
                      className={`
                        absolute -top-1 -right-1 w-3 h-3 rounded-full
                        ${style.accentDot} opacity-60
                      `}
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                      {lang === 'bn' ? subject.nameBn : subject.name}
                    </h2>
                    <Badge variant="secondary" className="text-xs">
                      {subject.totalChapters} {t('chapters', 'অধ্যায়')}
                    </Badge>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0">
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SubjectsPage
