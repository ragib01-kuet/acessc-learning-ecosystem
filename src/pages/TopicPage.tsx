/**
 * TopicPage — Single topic content view for AceSSC.
 *
 * Shows topic notes in a clean, readable layout with navigation
 * between topics and a "Mark as Complete" action.
 * Fully bilingual (en/bn), uses @blinkdotnew/ui exclusively.
 */
import { Card, CardContent, Button, Badge } from '@blinkdotnew/ui'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  ChevronRight,
} from 'lucide-react'

interface TopicPageProps {
  chapterTitle: string
  chapterTitleBn: string
  topic: {
    id: string
    title: string
    titleBn: string
    contentEn: string
    contentBn: string
    orderIndex: number
  }
  totalTopics: number
  lang: 'en' | 'bn'
  t: (en: string, bn: string) => string
  onBack: () => void
  onNext: () => void
  onPrevious: () => void
  hasPrevious: boolean
  hasNext: boolean
  onMarkComplete: () => void
}

function TopicPage({
  chapterTitle,
  chapterTitleBn,
  topic,
  totalTopics,
  lang,
  t,
  onBack,
  onNext,
  onPrevious,
  hasPrevious,
  hasNext,
  onMarkComplete,
}: TopicPageProps) {
  const displayChapter = lang === 'bn' ? chapterTitleBn : chapterTitle
  const displayTitle = lang === 'bn' ? topic.titleBn : topic.title
  const displayContent = lang === 'bn' ? topic.contentBn : topic.contentEn

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -bottom-60 -left-40 w-[600px] h-[600px] rounded-full bg-secondary/30 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        {/* Breadcrumb */}
        <nav
          className="animate-slide-up flex items-center gap-1.5 text-sm flex-wrap"
          style={{ animationFillMode: 'backwards' }}
        >
          <button
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground transition-colors duration-150 flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{displayChapter}</span>
            <span className="sm:hidden">{t('Back', 'পিছনে')}</span>
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0" />
          <span className="text-foreground font-medium truncate">
            {displayTitle}
          </span>
        </nav>

        {/* Topic Header */}
        <header
          className="animate-slide-up space-y-3"
          style={{ animationDelay: '80ms', animationFillMode: 'backwards' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-5 w-5 text-accent" />
            </div>
            <div className="min-w-0">
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-tight">
                {displayTitle}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-[10px]">
                  {t(
                    `Topic ${topic.orderIndex} of ${totalTopics}`,
                    `বিষয়বস্তু ${topic.orderIndex} / ${totalTopics}`,
                  )}
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Content Card */}
        <Card
          className="animate-slide-up"
          style={{ animationDelay: '160ms', animationFillMode: 'backwards' }}
        >
          <CardContent className="py-6 sm:py-8 px-5 sm:px-8">
            <div
              className="
                text-foreground text-sm sm:text-base leading-7 sm:leading-8
                space-y-4
                [&_h2]:font-heading [&_h2]:text-lg [&_h2]:sm:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-6 [&_h2]:mb-3
                [&_h3]:font-heading [&_h3]:text-base [&_h3]:sm:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-4 [&_h3]:mb-2
                [&_strong]:font-semibold [&_strong]:text-foreground
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5
                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5
                [&_li]:text-foreground/90
                [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                [&_blockquote]:border-l-4 [&_blockquote]:border-accent/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
              "
              dangerouslySetInnerHTML={{ __html: displayContent }}
            />
          </CardContent>
        </Card>

        {/* Bottom Navigation */}
        <div
          className="animate-slide-up flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pb-8"
          style={{ animationDelay: '240ms', animationFillMode: 'backwards' }}
        >
          {/* Previous / Next */}
          <div className="flex items-center gap-2 flex-1">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPrevious}
              onClick={onPrevious}
              className="gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{t('Previous', 'আগের')}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={!hasNext}
              onClick={onNext}
              className="gap-1.5"
            >
              <span className="hidden sm:inline">{t('Next', 'পরের')}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Mark Complete */}
          <Button
            size="sm"
            onClick={onMarkComplete}
            className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <CheckCircle2 className="h-4 w-4" />
            {t('Mark as Complete', 'সম্পন্ন হিসেবে চিহ্নিত করো')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TopicPage
