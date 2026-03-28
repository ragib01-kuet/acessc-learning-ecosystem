import { Card, CardContent, Progress, Badge } from '@blinkdotnew/ui'
import type { Chapter, Subject, UserProgress } from '../types'

interface ProgressPageProps {
  subjects: Subject[]
  chapters: Chapter[]
  progress: UserProgress[]
  lang: 'en' | 'bn'
}

export default function ProgressPage({ subjects, chapters, progress, lang }: ProgressPageProps) {
  const grouped = subjects.map((subject) => ({
    subject,
    chapters: chapters.filter((chapter) => chapter.subjectId === subject.id),
  }))

  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 sm:py-8">
      <header className="space-y-2 animate-slide-up">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          {lang === 'bn' ? 'অগ্রগতি' : 'Progress'}
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {lang === 'bn'
            ? 'প্রতিটি বিষয় ও অধ্যায়ে তোমার অগ্রগতি ট্র্যাক করো।'
            : 'Track your completion across every subject and chapter.'}
        </p>
      </header>

      <div className="space-y-6">
        {grouped.map(({ subject, chapters: subjectChapters }, subjectIndex) => (
          <Card key={subject.id} className="animate-slide-up" style={{ animationDelay: `${subjectIndex * 80}ms`, animationFillMode: 'backwards' }}>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-xl font-semibold text-foreground">
                    {lang === 'bn' ? subject.nameBn : subject.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">{subjectChapters.length} chapters</p>
                </div>
                <Badge variant="secondary">{subject.totalChapters}</Badge>
              </div>

              <div className="space-y-4">
                {subjectChapters.map((chapter) => {
                  const chapterProgress = progress.find((item) => item.chapterId === chapter.id)
                  const value = Math.round(chapterProgress?.completionPercentage ?? 0)

                  return (
                    <div key={chapter.id} className="space-y-2 rounded-2xl border border-border/70 bg-muted/20 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {lang === 'bn' ? chapter.titleBn : chapter.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {chapter.totalTopics} {lang === 'bn' ? 'টি টপিক' : 'topics'}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-foreground">{value}%</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
