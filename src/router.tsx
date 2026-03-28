import React, { useEffect, useMemo } from 'react'
import {
  createRootRoute,
  createRoute,
  createRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useNavigate,
  useParams,
  useRouterState,
} from '@tanstack/react-router'
import DashboardPage from './pages/DashboardPage'
import OnboardingPage from './pages/OnboardingPage'
import LandingPage from './pages/LandingPage'
import SubjectsPage from './pages/SubjectsPage'
import ChaptersPage from './pages/ChaptersPage'
import TopicPage from './pages/TopicPage'
import ProgressPage from './pages/ProgressPage'
import ExamPage from './pages/ExamPage'
import TutorPage from './pages/TutorPage'
import { Shell } from './Shell'
import AppSidebar from './components/AppSidebar'
import { useAuth } from './hooks/useAuth'
import { useCreateProfile, useUserProfile } from './hooks/useUserProfile'
import { useSubjects } from './hooks/useSubjects'
import { useChapters } from './hooks/useChapters'
import { useTopics } from './hooks/useTopics'
import { useTodayTasks, useUpdateTask } from './hooks/useTasks'
import { useUserProgress } from './hooks/useProgress'
import { useRandomQuiz } from './hooks/useQuestions'
import { useExamResults, useSaveExamResult } from './hooks/useExamResults'
import { generateDailyTasks } from './lib/generateTasks'
import { useLanguage } from './contexts/LanguageContext'
import { blink } from './blink/client'
import type { AiTutorChat, AiTutorMessage, Chapter, UserProgress, Question, ExamResult } from './types'
import { useAiTutorChats, useAiTutorMessages, useAiTutorStream, useCreateTutorChat } from './hooks/useAiTutor'

/* ──────────────────────────────────────────────────────────────
   Shared layouts
   ────────────────────────────────────────────────────────────── */

function AuthenticatedLayout() {
  const { user, logout } = useAuth()
  const { lang, setLang, t } = useLanguage()
  const { data: profile } = useUserProfile(user?.id)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  if (!user) return <Navigate to="/" />

  const currentPage = pathname.split('/')[1] || 'dashboard'

  return (
    <Shell
      appName="AceSSC"
      sidebar={
        <AppSidebar
          currentPage={currentPage}
          onNavigate={() => {}}
          streak={profile?.currentStreak || 0}
          xp={profile?.totalXp || 0}
          userName={user.displayName || user.email || ''}
          lang={lang}
          t={t}
          onLanguageToggle={() => setLang(lang === 'bn' ? 'en' : 'bn')}
          onLogout={logout}
        />
      }
    >
      <Outlet />
    </Shell>
  )
}

/* ──────────────────────────────────────────────────────────────
   Route components
   ────────────────────────────────────────────────────────────── */

function IndexPage() {
  const { user, isLoading, login } = useAuth()
  const { data: profile, isLoading: profileLoading } = useUserProfile(user?.id)

  if (isLoading || (user && profileLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-accent border-t-transparent" />
          <p className="text-muted-foreground text-sm font-medium">Loading AceSSC...</p>
        </div>
      </div>
    )
  }

  if (!user) return <LandingPage onGetStarted={() => login()} />
  if (!profile || Number(profile.onboardingCompleted) === 0) return <Navigate to="/onboarding" />
  return <Navigate to="/dashboard" />
}

function OnboardingRouteComponent() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { setLang } = useLanguage()
  const { data: profile } = useUserProfile(user?.id)
  const createProfile = useCreateProfile()

  useEffect(() => {
    if (profile && Number(profile.onboardingCompleted) === 1) {
      navigate({ to: '/dashboard' })
    }
  }, [navigate, profile])

  if (!user) return <Navigate to="/" />

  return (
    <OnboardingPage
      onComplete={async (data) => {
        await createProfile.mutateAsync({ ...data, userId: user.id })
        setLang(data.preferredLanguage === 'bn' ? 'bn' : 'en')
        navigate({ to: '/dashboard' })
      }}
    />
  )
}

function DashboardRouteComponent() {
  const { user } = useAuth()
  const { lang, t } = useLanguage()
  const { data: profile } = useUserProfile(user?.id)
  const { data: tasks = [] } = useTodayTasks(user?.id)
  const { data: progress = [] } = useUserProgress(user?.id)
  const updateTask = useUpdateTask()
  const { data: physicsChapters = [] } = useChapters('physics')
  const { data: chemistryChapters = [] } = useChapters('chemistry')
  const allChapters = useMemo(
    () => [...physicsChapters, ...chemistryChapters],
    [physicsChapters, chemistryChapters],
  )

  useEffect(() => {
    if (user && profile?.planStartDate && allChapters.length > 0) {
      generateDailyTasks({
        userId: user.id,
        chapters: allChapters as Chapter[],
        dailyTime: profile.dailyTime || 2,
        startDate: profile.planStartDate,
      }).catch(console.error)
    }
  }, [allChapters.length, profile?.planStartDate, user?.id])

  if (!user || !profile) return <Navigate to="/" />

  return (
    <DashboardPage
      user={user as { id: string; displayName?: string; email?: string }}
      profile={{
        currentStreak: profile.currentStreak || 0,
        totalXp: profile.totalXp || 0,
        dailyTime: profile.dailyTime || 2,
        planStartDate: profile.planStartDate || new Date().toISOString().split('T')[0],
        preferredLanguage: profile.preferredLanguage || 'en',
      }}
      tasks={tasks as Parameters<typeof DashboardPage>[0]['tasks']}
      progress={progress as Parameters<typeof DashboardPage>[0]['progress']}
      lang={lang}
      t={t}
      onCompleteTask={(taskId) => updateTask.mutate({ id: taskId, status: 'completed' })}
      onSkipTask={(taskId) => updateTask.mutate({ id: taskId, status: 'skipped' })}
    />
  )
}

function LearnSubjectsRouteComponent() {
  const navigate = useNavigate()
  const { lang, t } = useLanguage()
  const { data: subjects = [] } = useSubjects()

  return (
    <SubjectsPage
      subjects={subjects}
      lang={lang}
      t={t}
      onSelectSubject={(subjectId) =>
        navigate({ to: '/learn/$subjectId', params: { subjectId } })
      }
    />
  )
}

function LearnChaptersRouteComponent() {
  const navigate = useNavigate()
  const { subjectId } = useParams({ from: '/app/learn/$subjectId' })
  const { user } = useAuth()
  const { lang, t } = useLanguage()
  const { data: subjects = [] } = useSubjects()
  const { data: chapters = [], isLoading } = useChapters(subjectId)
  const { data: progress = [] } = useUserProgress(user?.id)
  const subject = subjects.find((item) => item.id === subjectId)

  if (!subject && !isLoading) return <Navigate to="/learn" />

  return (
    <ChaptersPage
      subjectName={subject?.name || ''}
      subjectNameBn={subject?.nameBn || ''}
      chapters={chapters as Parameters<typeof ChaptersPage>[0]['chapters']}
      progress={progress as Parameters<typeof ChaptersPage>[0]['progress']}
      lang={lang}
      t={t}
      isLoading={isLoading}
      onBack={() => navigate({ to: '/learn' })}
      onSelectChapter={(chapterId) =>
        navigate({
          to: '/learn/$subjectId/$chapterId/$topicId',
          params: { subjectId, chapterId, topicId: '_first' },
        })
      }
    />
  )
}

function TopicRouteComponent() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { lang, t } = useLanguage()
  const { subjectId, chapterId, topicId } = useParams({
    from: '/app/learn/$subjectId/$chapterId/$topicId',
  })
  const { data: chapters = [] } = useChapters(subjectId)
  const { data: topics = [] } = useTopics(chapterId)

  const chapter = chapters.find((item) => item.id === chapterId)

  // Resolve _first to actual first topic
  useEffect(() => {
    if (topicId === '_first' && topics.length > 0) {
      navigate({
        to: '/learn/$subjectId/$chapterId/$topicId',
        params: { subjectId, chapterId, topicId: topics[0].id },
        replace: true,
      })
    }
  }, [chapterId, navigate, subjectId, topicId, topics])

  const topicIndex = useMemo(
    () => topics.findIndex((item) => item.id === topicId),
    [topicId, topics],
  )
  const topic = topics[topicIndex]

  if (!chapter || !topic) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
      </div>
    )
  }

  const nextTopic = topics[topicIndex + 1]
  const previousTopic = topics[topicIndex - 1]

  return (
    <TopicPage
      chapterTitle={chapter.title}
      chapterTitleBn={chapter.titleBn}
      topic={topic}
      totalTopics={topics.length}
      lang={lang}
      t={t}
      hasNext={Boolean(nextTopic)}
      hasPrevious={Boolean(previousTopic)}
      onBack={() => navigate({ to: '/learn/$subjectId', params: { subjectId } })}
      onNext={() =>
        nextTopic &&
        navigate({
          to: '/learn/$subjectId/$chapterId/$topicId',
          params: { subjectId, chapterId, topicId: nextTopic.id },
        })
      }
      onPrevious={() =>
        previousTopic &&
        navigate({
          to: '/learn/$subjectId/$chapterId/$topicId',
          params: { subjectId, chapterId, topicId: previousTopic.id },
        })
      }
      onMarkComplete={async () => {
        if (!user || !chapter) return
        // Update progress
        try {
          const existing = await blink.db.userProgress.list({
            where: { userId: user.id, chapterId: chapter.id },
            limit: 1,
          }) as UserProgress[]
          const topicsCompleted = (existing[0]?.topicsCompleted || 0) + 1
          const completion = Math.round((topicsCompleted / (chapter.totalTopics || 1)) * 100)
          const mastery = completion >= 100 ? 'mastered' : completion >= 75 ? 'advanced' : completion >= 50 ? 'intermediate' : completion >= 25 ? 'beginner' : 'not_started'

          if (existing[0]) {
            await blink.db.userProgress.update(existing[0].id, {
              topicsCompleted,
              completionPercentage: completion,
              masteryLevel: mastery,
              lastAccessed: new Date().toISOString(),
            })
          } else {
            await blink.db.userProgress.create({
              userId: user.id,
              chapterId: chapter.id,
              topicsCompleted,
              completionPercentage: completion,
              masteryLevel: mastery,
              lastAccessed: new Date().toISOString(),
            })
          }
        } catch (err) {
          console.error('Progress update failed:', err)
        }

        if (nextTopic) {
          navigate({
            to: '/learn/$subjectId/$chapterId/$topicId',
            params: { subjectId, chapterId, topicId: nextTopic.id },
          })
        } else {
          navigate({ to: '/learn/$subjectId', params: { subjectId } })
        }
      }}
    />
  )
}

function ProgressRouteComponent() {
  const { user } = useAuth()
  const { lang } = useLanguage()
  const { data: subjects = [] } = useSubjects()
  const { data: progress = [] } = useUserProgress(user?.id)
  const { data: physicsChapters = [] } = useChapters('physics')
  const { data: chemistryChapters = [] } = useChapters('chemistry')
  const allChapters = useMemo(
    () => [...physicsChapters, ...chemistryChapters],
    [physicsChapters, chemistryChapters],
  )

  return (
    <ProgressPage
      subjects={subjects}
      chapters={allChapters as Chapter[]}
      progress={progress as UserProgress[]}
      lang={lang}
    />
  )
}

function ExamRouteComponent() {
  const { user } = useAuth()
  const { lang, t } = useLanguage()
  const { data: physicsChapters = [] } = useChapters('physics')
  const { data: chemistryChapters = [] } = useChapters('chemistry')
  const allChapters = useMemo(
    () => [...physicsChapters, ...chemistryChapters],
    [physicsChapters, chemistryChapters],
  )

  const [quizChapterId, setQuizChapterId] = React.useState<string | null>(null)
  const [isQuizActive, setIsQuizActive] = React.useState(false)
  const { data: questions = [], isLoading: questionsLoading } = useRandomQuiz(
    quizChapterId || undefined,
    5,
  )
  const { data: pastResults = [] } = useExamResults(user?.id)
  const saveResult = useSaveExamResult()

  // Activate quiz once questions are loaded
  useEffect(() => {
    if (quizChapterId && questions.length > 0 && !questionsLoading) {
      setIsQuizActive(true)
    }
  }, [quizChapterId, questions.length, questionsLoading])

  function handleStartQuiz(chapterId: string) {
    setQuizChapterId(chapterId)
    setIsQuizActive(false)
  }

  function handleSubmitResult(result: {
    examType: string; chapterId: string
    totalQuestions: number; correctAnswers: number
    wrongAnswers: number; scorePercentage: number
    timeTakenSeconds: number; answersJson: string
  }) {
    if (!user) return
    saveResult.mutate({ ...result, userId: user.id } as Omit<ExamResult, 'id' | 'createdAt'>)
  }

  return (
    <ExamPage
      chapters={allChapters as Array<{ id: string; title: string; titleBn: string; subjectId: string }>}
      lang={lang}
      t={t}
      onStartQuiz={handleStartQuiz}
      questions={questions as Question[]}
      questionsLoading={questionsLoading}
      isQuizActive={isQuizActive}
      onSubmitResult={handleSubmitResult}
      onResetQuiz={() => {
        setQuizChapterId(null)
        setIsQuizActive(false)
      }}
      pastResults={pastResults as ExamResult[]}
    />
  )
}

function TutorRouteComponent() {
  const { user } = useAuth()
  const { lang, t } = useLanguage()
  const { data: chats = [] } = useAiTutorChats(user?.id)
  const [activeChat, setActiveChat] = React.useState<AiTutorChat | null>(null)
  const { data: messages = [], isLoading: messagesLoading } = useAiTutorMessages(activeChat?.id)
  const createChat = useCreateTutorChat()
  const { sendMessage, streamingText, isStreaming } = useAiTutorStream()

  if (!user) return <Navigate to="/" />

  async function handleNewChat() {
    setActiveChat(null)
  }

  async function handleSendMessage(content: string) {
    if (!user) return
    let chat = activeChat
    if (!chat) {
      const title = content.length > 40 ? content.substring(0, 40) + '...' : content
      const created = await createChat.mutateAsync({ userId: user.id, title })
      chat = created as AiTutorChat
      setActiveChat(chat)
    }
    sendMessage({
      chatId: chat.id,
      userId: user.id,
      content,
      previousMessages: messages as AiTutorMessage[],
    })
  }

  return (
    <TutorPage
      lang={lang}
      t={t}
      chats={chats as AiTutorChat[]}
      activeChat={activeChat}
      messages={messages as AiTutorMessage[]}
      messagesLoading={messagesLoading}
      streamingText={streamingText}
      isStreaming={isStreaming}
      onNewChat={handleNewChat}
      onSelectChat={(chatId) => {
        const found = (chats as AiTutorChat[]).find((c) => c.id === chatId)
        if (found) setActiveChat(found)
      }}
      onSendMessage={handleSendMessage}
    />
  )
}

/* ──────────────────────────────────────────────────────────────
   Router setup
   ────────────────────────────────────────────────────────────── */

const rootRoute = createRootRoute({ component: () => <Outlet /> })
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: IndexPage })
const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  component: OnboardingRouteComponent,
})
const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: AuthenticatedLayout,
})
const dashboardRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/dashboard',
  component: DashboardRouteComponent,
})
const learnRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/learn',
  component: LearnSubjectsRouteComponent,
})
const learnSubjectRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/learn/$subjectId',
  component: LearnChaptersRouteComponent,
})
const topicRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/learn/$subjectId/$chapterId/$topicId',
  component: TopicRouteComponent,
})
const progressRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/progress',
  component: ProgressRouteComponent,
})
const examRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/exam',
  component: ExamRouteComponent,
})
const tutorRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/tutor',
  component: TutorRouteComponent,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  onboardingRoute,
  appRoute.addChildren([
    dashboardRoute,
    learnRoute,
    learnSubjectRoute,
    topicRoute,
    progressRoute,
    examRoute,
    tutorRoute,
  ]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function AppRouter() {
  return <RouterProvider router={router} />
}
