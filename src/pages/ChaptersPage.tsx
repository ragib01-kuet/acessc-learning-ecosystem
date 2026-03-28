/**
 * ChaptersPage — Chapter list for a selected subject in AceSSC.
 *
 * Shows all chapters as a vertical list with progress indicators,
 * mastery badges, and topic counts. Supports loading skeletons.
 * Fully bilingual (en/bn), uses @blinkdotnew/ui exclusively.
 */
import {
  Card,
  CardContent,
  Badge,
  Button,
  Progress,
  Skeleton,
} from '@blinkdotnew/ui'
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react'

interface ChaptersPageProps {
  subjectName: string
  subjectNameBn: string
  chapters: Array<{
    id: string
    title: string
    titleBn: string
    orderIndex: number
    totalTopics: number
  }>
  progress: Array<{
    chapterId: string
    completionPercentage: number
    masteryLevel: string
  }>
  lang: 'en' | 'bn'
  t: (en: string, bn: string) => string
  onSelectChapter: (chapterId: string) => void
  onBack: () => void
  isLoading: boolean
}

const MASTERY_STYLES: Record<string, { label: string; labelBn: string; className: string }> = {
  not_started: {
    label: 'Not Started',
    labelBn: 'শুরু হয়নি',
    className: 'bg-muted text-muted-foreground',
  },
  beginner: {
    label: 'Beginner',
    labelBn: 'প্রাথমিক',
    className: 'bg-accent/10 text-accent',
  },
  intermediate: {
    label: 'Intermediate',
    labelBn: 'মধ্যবর্তী',
    className: 'bg-[hsl(var(--chart-2)/.1)] text-[hsl(var(--chart-2))]',
  },
  advanced: {
    label: 'Advanced',
    labelBn: 'উন্নত',
    className: 'bg-[hsl(var(--chart-3)/.1)] text-[hsl(var(--chart-3))]',
  },
  mastered: {
    label: 'Mastered',
    labelBn: 'দক্ষ',
    className: 'bg-[hsl(var(--chart-4)/.1)] text-[hsl(var(--chart-4))]',
  },
}

function getMastery(level: string) {
  return MASTERY_STYLES[level] ?? MASTERY_STYLES.not_started
}

function ChaptersPage({
  subjectName,
  subjectNameBn,
  chapters,
  progress,
  lang,
  t,
  onSelectChapter,
  onBack,
  isLoading,
}: ChaptersPageProps) {
  const displaySubjectName = lang === 'bn' ? subjectNameBn : subjectName

  function getChapterProgress(chapterId: string) {
    return progress.find((p) => p.chapterId === chapterId) ?? {
      completionPercentage: 0,
      masteryLevel: 'not_started',
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -bottom-60 -left-40 w-[600px] h-[600px] rounded-full bg-secondary/30 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        {/* Header with back button */}
        <header
          className="animate-slide-up space-y-1"
          style={{ animationFillMode: 'backwards' }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground -ml-2 mb-2"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            {t('Back', 'পিছনে')}
          </Button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                {displaySubjectName}
              </h1>
              <p className="text-sm text-muted-foreground">
                {chapters.length} {t('chapters', 'অধ্যায়')}
              </p>
            </div>
          </div>
        </header>

        {/* Chapter List */}
        <div className="space-y-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card
                  key={i}
                  className="animate-slide-up"
                  style={{
                    animationDelay: `${100 + i * 70}ms`,
                    animationFillMode: 'backwards',
                  }}
                >
                  <CardContent className="flex items-center gap-4 py-5 px-4 sm:px-6">
                    <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/5" />
                      <Skeleton className="h-3 w-2/5" />
                      <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                    <Skeleton className="w-5 h-5 rounded flex-shrink-0" />
                  </CardContent>
                </Card>
              ))
            : chapters.map((chapter, i) => {
                const chProgress = getChapterProgress(chapter.id)
                const mastery = getMastery(chProgress.masteryLevel)

                return (
                  <Card
                    key={chapter.id}
                    className="
                      animate-slide-up group cursor-pointer
                      transition-all duration-200
                      hover:shadow-lg hover:scale-[1.01] hover:border-accent/30
                      active:scale-[0.99]
                    "
                    style={{
                      animationDelay: `${100 + i * 70}ms`,
                      animationFillMode: 'backwards',
                    }}
                    onClick={() => onSelectChapter(chapter.id)}
                  >
                    <CardContent className="flex items-center gap-4 py-5 px-4 sm:px-6">
                      {/* Chapter number circle */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-heading font-bold text-sm">
                        {chapter.orderIndex}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-2">
                        {/* Title row */}
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                            {lang === 'bn' ? chapter.titleBn : chapter.title}
                          </h3>
                          <Badge variant="outline" className="text-[10px] flex-shrink-0">
                            {chapter.totalTopics} {t('topics', 'বিষয়বস্তু')}
                          </Badge>
                        </div>

                        {/* Progress bar */}
                        <div className="flex items-center gap-3">
                          <Progress
                            value={chProgress.completionPercentage}
                            className="flex-1 h-1.5"
                          />
                          <span className="text-[11px] text-muted-foreground tabular-nums flex-shrink-0">
                            {chProgress.completionPercentage}%
                          </span>
                        </div>

                        {/* Mastery badge */}
                        <span
                          className={`
                            inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full
                            ${mastery.className}
                          `}
                        >
                          {lang === 'bn' ? mastery.labelBn : mastery.label}
                        </span>
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0">
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
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

export default ChaptersPage
