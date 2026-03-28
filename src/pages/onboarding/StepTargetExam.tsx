import { Card, CardContent } from '@blinkdotnew/ui'
import { GraduationCap, Award } from 'lucide-react'

interface StepTargetExamProps {
  value: string
  onChange: (value: string) => void
}

const exams = [
  {
    id: 'ssc',
    title: 'SSC Exam',
    description: 'Prepare for Secondary School Certificate with focused chapter-wise study',
    icon: GraduationCap,
  },
  {
    id: 'admission',
    title: 'Admission Prep',
    description: 'Get ready for university admission tests with intensive practice',
    icon: Award,
  },
] as const

export function StepTargetExam({ value, onChange }: StepTargetExamProps) {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold text-foreground tracking-tight">
          What are you preparing for?
        </h2>
        <p className="text-muted-foreground text-base">
          Choose your target exam so we can tailor your study plan perfectly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {exams.map((exam) => {
          const selected = value === exam.id
          const Icon = exam.icon
          return (
            <Card
              key={exam.id}
              className={`
                relative cursor-pointer transition-all duration-200
                hover:shadow-lg hover:-translate-y-0.5
                active:scale-[0.98]
                ${selected
                  ? 'border-accent bg-accent/5 ring-2 ring-accent/30 shadow-md'
                  : 'border-border hover:border-accent/40'
                }
              `}
              onClick={() => onChange(exam.id)}
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
                <div className="space-y-1.5">
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {exam.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {exam.description}
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
