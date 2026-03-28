import { useState, useMemo } from 'react'
import { Button, Progress } from '@blinkdotnew/ui'
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import { StepTargetExam } from './onboarding/StepTargetExam'
import { StepWeakSubject } from './onboarding/StepWeakSubject'
import { StepDailyTime } from './onboarding/StepDailyTime'
import { StepLanguage } from './onboarding/StepLanguage'

interface OnboardingPageProps {
  onComplete: (data: {
    targetExam: string
    weakSubject: string
    dailyTime: number
    preferredLanguage: string
  }) => void
}

const TOTAL_STEPS = 4

const stepLabels = ['Target Exam', 'Weak Subject', 'Daily Time', 'Language'] as const

function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [targetExam, setTargetExam] = useState('')
  const [weakSubject, setWeakSubject] = useState('')
  const [dailyTime, setDailyTime] = useState(0)
  const [preferredLanguage, setPreferredLanguage] = useState('')

  const progressPercent = (currentStep / TOTAL_STEPS) * 100

  const totalChapters = useMemo(() => {
    const subjects = weakSubject.split(',').filter(Boolean)
    const chapMap: Record<string, number> = { physics: 13, chemistry: 11 }
    return subjects.reduce((sum, s) => sum + (chapMap[s] ?? 0), 0)
  }, [weakSubject])

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1: return targetExam !== ''
      case 2: return weakSubject !== ''
      case 3: return dailyTime > 0
      case 4: return preferredLanguage !== ''
      default: return false
    }
  }, [currentStep, targetExam, weakSubject, dailyTime, preferredLanguage])

  function handleNext() {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1)
    } else {
      onComplete({ targetExam, weakSubject, dailyTime, preferredLanguage })
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -bottom-48 -left-48 w-[500px] h-[500px] rounded-full bg-secondary/40 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <header className="space-y-6 mb-10">
          {/* Logo + Welcome */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <span className="font-heading font-bold text-sm text-primary-foreground">A</span>
              </div>
              <span className="font-heading text-xl font-bold text-foreground tracking-tight">
                AceSSC
              </span>
            </div>

            {currentStep === 1 && (
              <div className="flex items-center gap-2 text-accent animate-fade-in">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Let&apos;s build your study plan!
                </span>
                <Sparkles className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Progress section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Step {currentStep} of {TOTAL_STEPS}
              </span>
              <span className="font-medium text-foreground">
                {stepLabels[currentStep - 1]}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />

            {/* Step dots */}
            <div className="flex items-center justify-center gap-2 pt-1">
              {stepLabels.map((label, i) => {
                const stepNum = i + 1
                const isActive = stepNum === currentStep
                const isComplete = stepNum < currentStep
                return (
                  <div
                    key={label}
                    className={`
                      flex items-center gap-1.5 transition-all duration-200
                      ${isActive ? 'opacity-100' : 'opacity-50'}
                    `}
                  >
                    <div
                      className={`
                        w-2 h-2 rounded-full transition-all duration-300
                        ${isComplete
                          ? 'bg-accent scale-100'
                          : isActive
                            ? 'bg-accent scale-125 ring-4 ring-accent/20'
                            : 'bg-border'
                        }
                      `}
                    />
                    {i < stepLabels.length - 1 && (
                      <div
                        className={`
                          hidden sm:block w-8 h-px transition-colors duration-200
                          ${isComplete ? 'bg-accent' : 'bg-border'}
                        `}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </header>

        {/* Step content */}
        <main className="flex-1" key={currentStep}>
          {currentStep === 1 && (
            <StepTargetExam value={targetExam} onChange={setTargetExam} />
          )}
          {currentStep === 2 && (
            <StepWeakSubject value={weakSubject} onChange={setWeakSubject} />
          )}
          {currentStep === 3 && (
            <StepDailyTime
              value={dailyTime}
              onChange={setDailyTime}
              totalChapters={totalChapters}
            />
          )}
          {currentStep === 4 && (
            <StepLanguage value={preferredLanguage} onChange={setPreferredLanguage} />
          )}
        </main>

        {/* Navigation footer */}
        <footer className="pt-8 pb-4">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`
                gap-2 transition-opacity duration-200
                ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}
              `}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="gap-2 min-w-[140px]"
              size="lg"
            >
              {currentStep === TOTAL_STEPS ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Start Learning
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default OnboardingPage
