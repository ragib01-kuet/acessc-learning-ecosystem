/**
 * DashboardPage — Main student dashboard for AceSSC.
 *
 * Sections: Welcome Header, Stats Row, Today's Tasks, Quick Actions.
 * Fully bilingual (en/bn), uses @blinkdotnew/ui exclusively.
 */
import { useMemo } from 'react'
import {
  StatGroup,
  Stat,
  EmptyState,
  toast,
} from '@blinkdotnew/ui'
import {
  Sparkles,
  BookOpen,
} from 'lucide-react'
import { getGreeting, getDayNumber, formatDate, toBnNumber } from './dashboard/helpers'
import { TaskCard } from './dashboard/TaskCard'
import { QuickActions } from './dashboard/QuickActions'

interface DashboardPageProps {
  user: { id: string; displayName?: string; email?: string }
  profile: {
    currentStreak: number
    totalXp: number
    dailyTime: number
    planStartDate: string
    preferredLanguage: string
  }
  tasks: Array<{
    id: string
    taskType: 'lecture' | 'practice' | 'revision' | 'test'
    title: string
    titleBn: string
    description: string
    chapterId: string
    status: 'pending' | 'completed' | 'skipped'
    dayNumber: number
  }>
  progress: Array<{
    chapterId: string
    completionPercentage: number
    masteryLevel: string
  }>
  onCompleteTask: (taskId: string) => void
  onSkipTask: (taskId: string) => void
  onNavigate: (to: '/learn' | '/progress') => void
  lang: 'en' | 'bn'
  t: (en: string, bn: string) => string
}

function DashboardPage({
  user,
  profile,
  tasks,
  progress,
  onCompleteTask,
  onSkipTask,
  onNavigate,
  lang,
  t,
}: DashboardPageProps) {
  const greeting = getGreeting(lang)
  const dayNumber = getDayNumber(profile.planStartDate)
  const dateStr = formatDate(lang)

  const displayName = user.displayName ?? user.email?.split('@')[0] ?? ''
  const firstName = displayName.split(' ')[0]

  // Stats calculations
  const completedTasks = useMemo(() => tasks.filter((tk) => tk.status === 'completed').length, [tasks])
  const totalTasks = tasks.length

  const overallProgress = useMemo(() => {
    if (progress.length === 0) return 0
    const avg = progress.reduce((sum, p) => sum + p.completionPercentage, 0) / progress.length
    return Math.round(avg)
  }, [progress])

  const pendingTasks = useMemo(() => tasks.filter((tk) => tk.status === 'pending'), [tasks])
  const doneTasks = useMemo(
    () => tasks.filter((tk) => tk.status === 'completed' || tk.status === 'skipped'),
    [tasks],
  )

  const formatNum = (n: number) => (lang === 'bn' ? toBnNumber(n) : String(n))

  function handleComplete(taskId: string) {
    onCompleteTask(taskId)
    toast.success(t('Task completed!', 'কাজ সম্পন্ন!'), {
      description: t('Great job, keep it up! 🎉', 'দারুণ! চালিয়ে যাও! 🎉'),
    })
  }

  function handleSkip(taskId: string) {
    onSkipTask(taskId)
    toast(t('Task skipped', 'কাজ বাদ দেওয়া হয়েছে'), {
      description: t('You can revisit it later.', 'পরে আবার করতে পারবে।'),
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -bottom-60 -left-40 w-[600px] h-[600px] rounded-full bg-secondary/30 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* ── 1. Welcome Header ── */}
        <header
          className="animate-slide-up space-y-1"
          style={{ animationFillMode: 'backwards' }}
        >
          <div className="flex items-center gap-2 text-accent">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">
              {dateStr}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {greeting}, {firstName}!
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground">
            {t(
              `Day ${dayNumber} of 90 — Keep going!`,
              `${toBnNumber(dayNumber)} দিন / ৯০ — চালিয়ে যাও!`,
            )}
          </p>
        </header>

        {/* ── 2. Stats Row ── */}
        <section
          className="animate-slide-up"
          style={{ animationDelay: '80ms', animationFillMode: 'backwards' }}
        >
          <StatGroup>
            <Stat
              label={t('Streak', 'ধারাবাহিকতা')}
              value={`🔥 ${formatNum(profile.currentStreak)}`}
              description={t('days', 'দিন')}
            />
            <Stat
              label={t('Total XP', 'মোট XP')}
              value={`⭐ ${formatNum(profile.totalXp)}`}
            />
            <Stat
              label={t('Today', 'আজ')}
              value={`${formatNum(completedTasks)}/${formatNum(totalTasks)}`}
              description={t('tasks done', 'কাজ সম্পন্ন')}
            />
            <Stat
              label={t('Overall', 'সার্বিক')}
              value={`${formatNum(overallProgress)}%`}
              description={t('chapters', 'অধ্যায়')}
            />
          </StatGroup>
        </section>

        {/* ── 3. Today's Tasks ── */}
        <section className="space-y-4">
          <h2
            className="animate-slide-up font-heading text-lg sm:text-xl font-semibold text-foreground"
            style={{ animationDelay: '160ms', animationFillMode: 'backwards' }}
          >
            {t("Today's Tasks", 'আজকের কাজ')}
          </h2>

          {tasks.length === 0 ? (
            <div
              className="animate-slide-up"
              style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
            >
              <EmptyState
                icon={<BookOpen />}
                title={t('No tasks for today', 'আজকের জন্য কোনো কাজ নেই')}
                description={t(
                  'Enjoy your free time — or explore chapters on your own!',
                  'অবসর উপভোগ করো — অথবা নিজে অধ্যায় দেখো!',
                )}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {/* Pending tasks first, then done */}
              {pendingTasks.map((task, i) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  lang={lang}
                  t={t}
                  onComplete={handleComplete}
                  onSkip={handleSkip}
                  delay={200 + i * 60}
                />
              ))}
              {doneTasks.length > 0 && pendingTasks.length > 0 && (
                <div
                  className="animate-slide-up flex items-center gap-3 py-1"
                  style={{
                    animationDelay: `${200 + pendingTasks.length * 60 + 40}ms`,
                    animationFillMode: 'backwards',
                  }}
                >
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">
                    {t('Completed', 'সম্পন্ন')}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
              )}
              {doneTasks.map((task, i) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  lang={lang}
                  t={t}
                  onComplete={handleComplete}
                  onSkip={handleSkip}
                  delay={200 + (pendingTasks.length + i) * 60 + 80}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── 4. Quick Actions ── */}
        <section className="space-y-4 pb-8">
          <h2
            className="animate-slide-up font-heading text-lg sm:text-xl font-semibold text-foreground"
            style={{
              animationDelay: `${200 + tasks.length * 60 + 100}ms`,
              animationFillMode: 'backwards',
            }}
          >
            {t('Quick Actions', 'দ্রুত কাজ')}
          </h2>

          <QuickActions
            t={t}
            baseDelay={200 + tasks.length * 60 + 160}
            onNavigate={onNavigate}
          />
        </section>
      </div>
    </div>
  )
}

export default DashboardPage
