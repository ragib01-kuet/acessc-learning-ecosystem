import { Button, Badge } from '@blinkdotnew/ui'
import {
  Atom,
  FlaskConical,
  Zap,
  Target,
  Brain,
  BarChart3,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Users,
} from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void
}

const FEATURES = [
  {
    icon: Target,
    title: '90-Day Structured Plan',
    titleBn: '৯০ দিনের পরিকল্পনা',
    desc: 'Auto-generated daily study plan based on your pace and goals.',
    descBn: 'তোমার গতি ও লক্ষ্য অনুযায়ী স্বয়ংক্রিয় দৈনিক পরিকল্পনা।',
  },
  {
    icon: Brain,
    title: 'AI Tutor',
    titleBn: 'AI শিক্ষক',
    desc: 'Get step-by-step explanations and hints for any concept or question.',
    descBn: 'যেকোনো ধারণা বা প্রশ্নের জন্য ধাপে ধাপে ব্যাখ্যা পাও।',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    titleBn: 'অগ্রগতি ট্র্যাকিং',
    desc: 'Track every chapter, detect weak areas, and stay on course.',
    descBn: 'প্রতিটি অধ্যায় ট্র্যাক করো, দুর্বল দিক চিহ্নিত করো।',
  },
  {
    icon: Zap,
    title: 'Behavior-Driven Learning',
    titleBn: 'আচরণ-ভিত্তিক শিক্ষা',
    desc: 'System adapts based on your consistency, accuracy, and patterns.',
    descBn: 'সিস্টেম তোমার ধারাবাহিকতা ও নির্ভুলতা অনুযায়ী মানিয়ে নেয়।',
  },
]

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full bg-secondary/40 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/3 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="font-heading text-xl font-bold text-foreground tracking-tight">
              AceSSC
            </span>
            <Badge variant="secondary" className="text-[10px]">Beta</Badge>
          </div>
          <Button onClick={onGetStarted} size="sm">
            Sign In <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </nav>

        {/* Hero */}
        <section className="px-6 pt-16 pb-20 max-w-4xl mx-auto text-center">
          <div className="animate-slide-up" style={{ animationFillMode: 'backwards' }}>
            <Badge variant="outline" className="mb-6 gap-1.5 px-3 py-1">
              <Sparkles className="h-3 w-3 text-accent" />
              AI-Powered Learning Platform
            </Badge>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight leading-tight">
              Master SSC{' '}
              <span className="text-accent">Physics</span> &{' '}
              <span className="text-accent">Chemistry</span>
              <br />in 90 Days
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A complete learning ecosystem designed specifically for SSC students in Bangladesh.
              Structured plans, AI tutoring, behavior tracking — everything you need to ace your exams.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" onClick={onGetStarted} className="gap-2 px-8">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-accent" /> Free to use
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-accent" /> 90-day plan
                </span>
              </div>
            </div>
          </div>

          {/* Subject pills */}
          <div
            className="mt-12 flex flex-wrap items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
          >
            <div className="flex items-center gap-3 rounded-2xl bg-card border border-border px-5 py-3 shadow-sm">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10">
                <Atom className="h-5 w-5 text-accent" />
              </div>
              <div className="text-left">
                <p className="font-heading text-sm font-semibold text-foreground">Physics</p>
                <p className="text-xs text-muted-foreground">13 chapters · পদার্থবিজ্ঞান</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-card border border-border px-5 py-3 shadow-sm">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-chart-3/10">
                <FlaskConical className="h-5 w-5 text-chart-3" />
              </div>
              <div className="text-left">
                <p className="font-heading text-sm font-semibold text-foreground">Chemistry</p>
                <p className="text-xs text-muted-foreground">11 chapters · রসায়ন</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 py-16 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Everything You Need to Succeed
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Not just content — a complete system that ensures you finish the syllabus.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="animate-slide-up group rounded-2xl bg-card border border-border p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.01]"
                style={{ animationDelay: `${300 + i * 80}ms`, animationFillMode: 'backwards' }}
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-accent/10 mb-4 transition-colors group-hover:bg-accent/20">
                  <feature.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-16 text-center">
          <div className="max-w-xl mx-auto rounded-2xl bg-primary p-8 sm:p-12 shadow-xl">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary-foreground tracking-tight">
              Ready to Start?
            </h2>
            <p className="mt-3 text-primary-foreground/70 text-sm sm:text-base">
              Join thousands of SSC students who are completing their syllabus on time.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={onGetStarted}
              className="mt-6 gap-2 px-8"
            >
              Start Your 90-Day Plan
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="mt-4 flex items-center justify-center gap-2 text-primary-foreground/60 text-xs">
              <Users className="h-3 w-3" />
              <span>Supports both Bangla and English</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-8 border-t border-border">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-heading text-sm font-semibold text-foreground">AceSSC</span>
            <p className="text-xs text-muted-foreground">
              Built for SSC students in Bangladesh · Physics & Chemistry
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
