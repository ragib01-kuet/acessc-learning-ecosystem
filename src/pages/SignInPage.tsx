import { Button, Card, CardContent, Badge } from '@blinkdotnew/ui'
import { BookOpenCheck, Languages, Target, Sparkles } from 'lucide-react'

interface SignInPageProps {
  onLogin: () => void
}

export default function SignInPage({ onLogin }: SignInPageProps) {
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6 animate-slide-up">
            <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-xs">
              90-day SSC accelerator
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-2xl font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                AceSSC helps Bangladeshi students finish Physics and Chemistry in 90 days.
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                Structured routines, bilingual learning, adaptive tasks, and a focused dashboard that keeps students moving every single day.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: Target, label: 'Daily plan' },
                { icon: Languages, label: 'Bangla + English' },
                { icon: BookOpenCheck, label: 'Track progress' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
                  <item.icon className="mb-3 h-5 w-5 text-accent" />
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </section>

          <Card className="animate-slide-up border-border/70 shadow-xl" style={{ animationDelay: '120ms', animationFillMode: 'backwards' }}>
            <CardContent className="space-y-6 p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <span className="font-heading text-xl font-bold">A</span>
              </div>
              <div className="space-y-2">
                <h2 className="font-heading text-2xl font-semibold text-foreground">Welcome to AceSSC</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Sign in to set up your study routine, generate your plan, and start tracking daily progress.
                </p>
              </div>
              <Button size="lg" className="w-full gap-2" onClick={onLogin}>
                <Sparkles className="h-4 w-4" />
                Continue with secure sign in
              </Button>
              <p className="text-xs leading-5 text-muted-foreground">
                You’ll create your learner profile after sign in. Teacher and admin areas will be added in later phases.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
