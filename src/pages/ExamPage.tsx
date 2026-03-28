/**
 * ExamPage — Practice quiz page for AceSSC.
 *
 * 3 states: Chapter Selection → Quiz Active → Results.
 * Fully bilingual (en/bn), uses @blinkdotnew/ui exclusively.
 */
import { useState, useEffect, useMemo } from 'react'
import {
  Card,
  CardContent,
  Button,
  Badge,
  Progress,
  Skeleton,
} from '@blinkdotnew/ui'
import {
  ClipboardCheck,
  Clock,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowLeft,
  Trophy,
  Zap,
  Target,
  Timer,
} from 'lucide-react'
import type { Question, ExamResult } from '../types'

/* ── Props ── */
interface ExamPageProps {
  chapters: Array<{ id: string; title: string; titleBn: string; subjectId: string }>
  lang: 'en' | 'bn'
  t: (en: string, bn: string) => string
  onStartQuiz: (chapterId: string) => void
  questions: Question[]
  questionsLoading: boolean
  isQuizActive: boolean
  onSubmitResult: (result: {
    examType: string; chapterId: string
    totalQuestions: number; correctAnswers: number
    wrongAnswers: number; scorePercentage: number
    timeTakenSeconds: number; answersJson: string
  }) => void
  onResetQuiz: () => void
  pastResults: ExamResult[]
}

/* ── Helpers ── */
const OPTION_KEYS = ['A', 'B', 'C', 'D'] as const

function formatTime(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function getOptionText(q: Question, key: string, lang: 'en' | 'bn') {
  const map: Record<string, [keyof Question, keyof Question]> = {
    A: ['optionA', 'optionABn'],
    B: ['optionB', 'optionBBn'],
    C: ['optionC', 'optionCBn'],
    D: ['optionD', 'optionDBn'],
  }
  const [en, bn] = map[key]
  return lang === 'bn' ? (q[bn] as string) : (q[en] as string)
}

function scoreColor(pct: number) {
  if (pct >= 70) return 'text-[hsl(var(--chart-3))]'
  if (pct >= 50) return 'text-[hsl(var(--chart-2))]'
  return 'text-destructive'
}

function scoreBg(pct: number) {
  if (pct >= 70) return 'bg-[hsl(var(--chart-3)/.1)] border-[hsl(var(--chart-3)/.3)]'
  if (pct >= 50) return 'bg-[hsl(var(--chart-2)/.1)] border-[hsl(var(--chart-2)/.3)]'
  return 'bg-destructive/10 border-destructive/30'
}

/* ── Results Sub-component ── */
function QuizResults({
  questions, answers, timeElapsed, lang, t, onTryAgain, onBackToChapters,
}: {
  questions: Question[]
  answers: Record<string, string>
  timeElapsed: number
  lang: 'en' | 'bn'
  t: (en: string, bn: string) => string
  onTryAgain: () => void
  onBackToChapters: () => void
}) {
  const correct = questions.filter((q) => answers[q.id] === q.correctAnswer).length
  const wrong = questions.length - correct
  const pct = Math.round((correct / questions.length) * 100)

  return (
    <div className="space-y-6">
      {/* Hero Score */}
      <div className="animate-slide-up flex flex-col items-center text-center py-6" style={{ animationFillMode: 'backwards' }}>
        <div className={`w-28 h-28 rounded-full border-4 flex items-center justify-center mb-4 ${scoreBg(pct)}`}>
          <span className={`font-heading text-3xl font-bold ${scoreColor(pct)}`}>{pct}%</span>
        </div>
        <h2 className="font-heading text-xl font-bold text-foreground">
          {pct >= 70 ? t('Great Job!', 'চমৎকার!') : pct >= 50 ? t('Good Effort!', 'ভালো চেষ্টা!') : t('Keep Practicing!', 'অনুশীলন চালিয়ে যাও!')}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t(`You scored ${correct} out of ${questions.length}`, `তুমি ${questions.length} এর মধ্যে ${correct} পেয়েছ`)}
        </p>
      </div>

      {/* Stats Row */}
      <div className="animate-slide-up grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
        {[
          { icon: <Target className="h-4 w-4 text-accent" />, label: t('Total', 'মোট'), value: questions.length },
          { icon: <CheckCircle2 className="h-4 w-4 text-[hsl(var(--chart-3))]" />, label: t('Correct', 'সঠিক'), value: correct },
          { icon: <XCircle className="h-4 w-4 text-destructive" />, label: t('Wrong', 'ভুল'), value: wrong },
          { icon: <Timer className="h-4 w-4 text-[hsl(var(--chart-2))]" />, label: t('Time', 'সময়'), value: formatTime(timeElapsed) },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">{stat.icon}</div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="font-heading font-bold text-foreground">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Question Review */}
      <div className="space-y-3">
        <h3 className="font-heading font-semibold text-foreground animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
          {t('Answer Review', 'উত্তর পর্যালোচনা')}
        </h3>
        {questions.map((q, i) => {
          const userAns = answers[q.id]
          const isCorrect = userAns === q.correctAnswer
          return (
            <Card
              key={q.id}
              className="animate-slide-up overflow-hidden"
              style={{ animationDelay: `${250 + i * 60}ms`, animationFillMode: 'backwards' }}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isCorrect ? 'bg-[hsl(var(--chart-3)/.15)]' : 'bg-destructive/15'}`}>
                    {isCorrect
                      ? <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--chart-3))]" />
                      : <XCircle className="h-3.5 w-3.5 text-destructive" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      <span className="text-muted-foreground mr-1.5">Q{i + 1}.</span>
                      {lang === 'bn' ? q.questionTextBn : q.questionText}
                    </p>
                    {!isCorrect && userAns && (
                      <p className="text-xs text-destructive mt-1">
                        {t('Your answer:', 'তোমার উত্তর:')} <span className="font-medium">{userAns}. {getOptionText(q, userAns, lang)}</span>
                      </p>
                    )}
                    <p className="text-xs text-[hsl(var(--chart-3))] mt-1">
                      {t('Correct:', 'সঠিক:')} <span className="font-medium">{q.correctAnswer}. {getOptionText(q, q.correctAnswer, lang)}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 italic leading-relaxed">
                      {lang === 'bn' ? q.explanationBn : q.explanation}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 animate-slide-up" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
        <Button onClick={onTryAgain} className="flex-1 gap-2">
          <RotateCcw className="h-4 w-4" />
          {t('Try Again', 'আবার চেষ্টা করো')}
        </Button>
        <Button variant="outline" onClick={onBackToChapters} className="flex-1 gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('Back to Chapters', 'অধ্যায়ে ফিরে যাও')}
        </Button>
      </div>
    </div>
  )
}

/* ── Main ExamPage ── */
export default function ExamPage({
  chapters, lang, t, onStartQuiz, questions, questionsLoading,
  isQuizActive, onSubmitResult, onResetQuiz, pastResults,
}: ExamPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null)

  // Timer
  useEffect(() => {
    if (!isQuizActive || showResults) return
    const interval = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000)
    return () => clearInterval(interval)
  }, [isQuizActive, showResults])

  // Reset internal state when quiz resets
  useEffect(() => {
    if (!isQuizActive) {
      setCurrentIndex(0)
      setAnswers({})
      setSelectedAnswer(null)
      setShowResults(false)
      setTimeElapsed(0)
    }
  }, [isQuizActive])

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  // Group chapters by subject
  const grouped = useMemo(() => {
    const map: Record<string, typeof chapters> = {}
    for (const ch of chapters) {
      const key = ch.subjectId
      if (!map[key]) map[key] = []
      map[key].push(ch)
    }
    return map
  }, [chapters])

  const SUBJECT_LABELS: Record<string, { en: string; bn: string }> = {
    physics: { en: 'Physics', bn: 'পদার্থবিজ্ঞান' },
    chemistry: { en: 'Chemistry', bn: 'রসায়ন' },
    math: { en: 'Mathematics', bn: 'গণিত' },
    biology: { en: 'Biology', bn: 'জীববিজ্ঞান' },
  }

  function handleSelectOption(key: string) {
    setSelectedAnswer(key)
  }

  function handleNext() {
    if (!currentQuestion || !selectedAnswer) return
    const updated = { ...answers, [currentQuestion.id]: selectedAnswer }
    setAnswers(updated)
    setSelectedAnswer(null)

    if (isLastQuestion) {
      // Submit
      const correct = questions.filter((q) => updated[q.id] === q.correctAnswer).length
      const wrong = questions.length - correct
      const pct = Math.round((correct / questions.length) * 100)
      onSubmitResult({
        examType: 'chapter_quiz',
        chapterId: selectedChapterId || '',
        totalQuestions: questions.length,
        correctAnswers: correct,
        wrongAnswers: wrong,
        scorePercentage: pct,
        timeTakenSeconds: timeElapsed,
        answersJson: JSON.stringify(updated),
      })
      setShowResults(true)
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  function handleTryAgain() {
    setSelectedChapterId((prev) => {
      if (prev) onStartQuiz(prev)
      return prev
    })
    setCurrentIndex(0)
    setAnswers({})
    setSelectedAnswer(null)
    setShowResults(false)
    setTimeElapsed(0)
  }

  function handleBackToChapters() {
    onResetQuiz()
    setSelectedChapterId(null)
  }

  // ── RESULTS STATE ──
  if (isQuizActive && showResults && questions.length > 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute -bottom-60 -left-40 w-[600px] h-[600px] rounded-full bg-secondary/30 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <QuizResults
            questions={questions}
            answers={answers}
            timeElapsed={timeElapsed}
            lang={lang}
            t={t}
            onTryAgain={handleTryAgain}
            onBackToChapters={handleBackToChapters}
          />
        </div>
      </div>
    )
  }

  // ── QUIZ ACTIVE STATE ──
  if (isQuizActive && questions.length > 0 && currentQuestion) {
    const progressPct = ((currentIndex + 1) / questions.length) * 100
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
          {/* Top Bar */}
          <div className="animate-slide-up space-y-3" style={{ animationFillMode: 'backwards' }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {t(`Question ${currentIndex + 1} of ${questions.length}`, `প্রশ্ন ${currentIndex + 1} / ${questions.length}`)}
              </span>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="font-mono tabular-nums">{formatTime(timeElapsed)}</span>
              </div>
            </div>
            <Progress value={progressPct} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="animate-slide-up" style={{ animationDelay: '80ms', animationFillMode: 'backwards' }}>
            <CardContent className="p-5 sm:p-6 space-y-5">
              {/* Question number + text */}
              <div className="space-y-3">
                <Badge variant="secondary" className="text-xs font-heading">
                  {t(`Q${currentIndex + 1}`, `প্র${currentIndex + 1}`)}
                  <span className="ml-1.5 text-[10px] opacity-60">
                    {currentQuestion.difficulty === 'easy' && t('Easy', 'সহজ')}
                    {currentQuestion.difficulty === 'medium' && t('Medium', 'মাঝারি')}
                    {currentQuestion.difficulty === 'hard' && t('Hard', 'কঠিন')}
                  </span>
                </Badge>
                <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed">
                  {lang === 'bn' ? currentQuestion.questionTextBn : currentQuestion.questionText}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {OPTION_KEYS.map((key) => {
                  const isSelected = selectedAnswer === key
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSelectOption(key)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-accent bg-accent/5 ring-2 ring-accent/20 scale-[1.01]'
                          : 'border-border hover:border-accent/30 hover:bg-muted/30 active:scale-[0.99]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {key}
                        </span>
                        <span className="text-sm sm:text-base text-foreground pt-0.5">
                          {getOptionText(currentQuestion, key, lang)}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Next / Submit Button */}
              <Button
                onClick={handleNext}
                disabled={!selectedAnswer}
                className="w-full gap-2"
                size="lg"
              >
                {isLastQuestion ? (
                  <>
                    <ClipboardCheck className="h-4 w-4" />
                    {t('Submit Quiz', 'পরীক্ষা জমা দাও')}
                  </>
                ) : (
                  <>
                    {t('Next', 'পরবর্তী')}
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ── LOADING STATE (questions loading) ──
  if (questionsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-4/5" />
              <div className="space-y-3 pt-2">
                {[1, 2, 3, 4].map((n) => (
                  <Skeleton key={n} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ── CHAPTER SELECTION STATE ──
  return (
    <div className="min-h-screen bg-background">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -bottom-60 -left-40 w-[600px] h-[600px] rounded-full bg-secondary/30 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* Header */}
        <header className="animate-slide-up space-y-2" style={{ animationFillMode: 'backwards' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <ClipboardCheck className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                {t('Practice Exams', 'অনুশীলন পরীক্ষা')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t(
                  'Test your knowledge chapter by chapter. Get instant results.',
                  'অধ্যায় ভিত্তিক তোমার জ্ঞান পরীক্ষা করো। তাৎক্ষণিক ফলাফল পাও।',
                )}
              </p>
            </div>
          </div>
        </header>

        {/* Chapter Groups */}
        {Object.entries(grouped).map(([subjectId, subjectChapters], groupIdx) => {
          const subLabel = SUBJECT_LABELS[subjectId] || { en: subjectId, bn: subjectId }
          return (
            <section key={subjectId} className="space-y-3">
              <h2
                className="animate-slide-up font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider"
                style={{ animationDelay: `${100 + groupIdx * 80}ms`, animationFillMode: 'backwards' }}
              >
                {lang === 'bn' ? subLabel.bn : subLabel.en}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {subjectChapters.map((ch, i) => (
                  <Card
                    key={ch.id}
                    className="animate-slide-up group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.01] hover:border-accent/30 active:scale-[0.99]"
                    style={{ animationDelay: `${150 + groupIdx * 80 + i * 60}ms`, animationFillMode: 'backwards' }}
                    onClick={() => {
                      setSelectedChapterId(ch.id)
                      onStartQuiz(ch.id)
                    }}
                  >
                    <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-heading font-bold text-sm flex-shrink-0">
                        <Zap className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-foreground truncate">
                          {lang === 'bn' ? ch.titleBn : ch.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {t('Chapter Quiz', 'অধ্যায়ের কুইজ')}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" className="flex-shrink-0 gap-1 text-xs group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-colors">
                        {t('Start', 'শুরু')}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )
        })}

        {/* Past Results */}
        {pastResults.length > 0 && (
          <section className="space-y-3">
            <h2
              className="animate-slide-up font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2"
              style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}
            >
              <Trophy className="h-4 w-4" />
              {t('Recent Results', 'সাম্প্রতিক ফলাফল')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pastResults.slice(0, 6).map((result, i) => {
                const chapter = chapters.find((ch) => ch.id === result.chapterId)
                return (
                  <Card
                    key={result.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${450 + i * 60}ms`, animationFillMode: 'backwards' }}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${scoreBg(result.scorePercentage)}`}>
                        <span className={`text-xs font-bold ${scoreColor(result.scorePercentage)}`}>
                          {result.scorePercentage}%
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {chapter ? (lang === 'bn' ? chapter.titleBn : chapter.title) : t('Quiz', 'কুইজ')}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">
                            {result.correctAnswers}/{result.totalQuestions} {t('correct', 'সঠিক')}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(result.timeTakenSeconds)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
