import { Clock } from 'lucide-react'

interface StepDailyTimeProps {
  value: number
  onChange: (value: number) => void
  totalChapters: number
}

const timeOptions = [
  { hours: 1, label: '1h', emoji: '🌱' },
  { hours: 2, label: '2h', emoji: '🌿' },
  { hours: 3, label: '3h', emoji: '🔥' },
  { hours: 4, label: '4h', emoji: '⚡' },
] as const

function estimateDays(totalChapters: number, dailyHours: number): number {
  // ~2 hours per chapter average for thorough study
  const totalHoursNeeded = totalChapters * 2
  return Math.ceil(totalHoursNeeded / dailyHours)
}

export function StepDailyTime({ value, onChange, totalChapters }: StepDailyTimeProps) {
  const days = value > 0 ? estimateDays(totalChapters, value) : 0

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold text-foreground tracking-tight">
          How much time can you study daily?
        </h2>
        <p className="text-muted-foreground text-base">
          Be realistic — consistency beats intensity every time.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {timeOptions.map((option) => {
          const selected = value === option.hours
          return (
            <button
              key={option.hours}
              onClick={() => onChange(option.hours)}
              className={`
                relative px-6 py-3 rounded-full font-heading font-semibold text-base
                transition-all duration-200 cursor-pointer
                hover:-translate-y-0.5
                active:scale-95
                ${selected
                  ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/25 ring-2 ring-accent/30'
                  : 'bg-card text-foreground border border-border hover:border-accent/40 hover:shadow-md'
                }
              `}
            >
              <span className="mr-1.5">{option.emoji}</span>
              {option.label}
            </button>
          )
        })}
      </div>

      {value > 0 && (
        <div className="animate-fade-in">
          <div className="bg-card border border-border rounded-xl p-6 text-center space-y-4">
            <div className="inline-flex items-center gap-2 text-accent">
              <Clock className="w-5 h-5" />
              <span className="font-heading font-semibold text-sm uppercase tracking-wider">
                Estimated Plan
              </span>
            </div>
            <div className="space-y-1">
              <p className="font-heading text-4xl font-bold text-foreground">
                {days} days
              </p>
              <p className="text-sm text-muted-foreground">
                to complete {totalChapters} chapters at {value}h/day
              </p>
            </div>
            {/* Visual timeline bar */}
            <div className="flex items-center justify-center gap-1 pt-2">
              {Array.from({ length: Math.min(days, 30) }).map((_, i) => (
                <div
                  key={i}
                  className="h-2 rounded-full bg-accent/70 transition-all duration-300"
                  style={{
                    width: `${Math.max(4, 160 / Math.min(days, 30))}px`,
                    opacity: 0.4 + (i / Math.min(days, 30)) * 0.6,
                    animationDelay: `${i * 30}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
