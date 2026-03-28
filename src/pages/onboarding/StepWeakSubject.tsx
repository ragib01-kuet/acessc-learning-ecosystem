import { Card, CardContent, Badge } from '@blinkdotnew/ui'
import { Atom, FlaskConical } from 'lucide-react'

interface StepWeakSubjectProps {
  value: string
  onChange: (value: string) => void
}

const subjects = [
  {
    id: 'physics',
    title: 'Physics',
    chapters: 13,
    icon: Atom,
    color: 'hsl(199 89% 48%)',
  },
  {
    id: 'chemistry',
    title: 'Chemistry',
    chapters: 11,
    icon: FlaskConical,
    color: 'hsl(45 93% 47%)',
  },
] as const

export function StepWeakSubject({ value, onChange }: StepWeakSubjectProps) {
  const selectedSubjects = value ? value.split(',').filter(Boolean) : []

  function toggleSubject(id: string) {
    if (selectedSubjects.includes(id)) {
      const next = selectedSubjects.filter((s) => s !== id)
      onChange(next.join(','))
    } else {
      onChange([...selectedSubjects, id].join(','))
    }
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold text-foreground tracking-tight">
          Which subject needs more focus?
        </h2>
        <p className="text-muted-foreground text-base">
          Select one or both — we'll prioritize these in your daily plan.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {subjects.map((subject) => {
          const selected = selectedSubjects.includes(subject.id)
          const Icon = subject.icon
          return (
            <Card
              key={subject.id}
              className={`
                relative cursor-pointer transition-all duration-200
                hover:shadow-lg hover:-translate-y-0.5
                active:scale-[0.98]
                ${selected
                  ? 'border-accent bg-accent/5 ring-2 ring-accent/30 shadow-md'
                  : 'border-border hover:border-accent/40'
                }
              `}
              onClick={() => toggleSubject(subject.id)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div
                  className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-200
                    ${selected
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary text-secondary-foreground'
                    }
                  `}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {subject.title}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {subject.chapters} chapters
                  </Badge>
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

      {selectedSubjects.length > 0 && (
        <div className="text-center animate-fade-in">
          <p className="text-sm text-muted-foreground">
            Total chapters to cover:{' '}
            <span className="font-semibold text-foreground">
              {selectedSubjects.reduce((acc, id) => {
                const sub = subjects.find((s) => s.id === id)
                return acc + (sub?.chapters ?? 0)
              }, 0)}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
