export interface Subject {
  id: string
  name: string
  nameBn: string
  icon: string
  totalChapters: number
  orderIndex: number
}

export interface Chapter {
  id: string
  subjectId: string
  title: string
  titleBn: string
  orderIndex: number
  totalTopics: number
}

export interface Topic {
  id: string
  chapterId: string
  title: string
  titleBn: string
  contentEn: string
  contentBn: string
  orderIndex: number
}

export interface UserProfile {
  id: string
  userId: string
  targetExam: 'ssc' | 'admission'
  weakSubject: string
  dailyTime: number
  preferredLanguage: 'en' | 'bn'
  onboardingCompleted: number
  consistencyScore: number
  behaviorTag: string
  currentStreak: number
  longestStreak: number
  totalXp: number
  planStartDate: string
}

export interface UserProgress {
  id: string
  userId: string
  chapterId: string
  completionPercentage: number
  masteryLevel: 'not_started' | 'beginner' | 'intermediate' | 'advanced' | 'mastered'
  topicsCompleted: number
  lastAccessed: string
}

export interface Task {
  id: string
  userId: string
  date: string
  taskType: 'lecture' | 'practice' | 'revision' | 'test'
  title: string
  titleBn: string
  description: string
  chapterId: string
  topicId: string
  status: 'pending' | 'completed' | 'skipped'
  dayNumber: number
}

export interface Question {
  id: string
  chapterId: string
  topicId: string
  questionText: string
  questionTextBn: string
  questionType: 'mcq'
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  optionABn: string
  optionBBn: string
  optionCBn: string
  optionDBn: string
  correctAnswer: 'A' | 'B' | 'C' | 'D'
  explanation: string
  explanationBn: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface ExamResult {
  id: string
  userId: string
  examType: 'chapter_quiz' | 'daily_test' | 'mock_exam'
  chapterId: string
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
  scorePercentage: number
  timeTakenSeconds: number
  answersJson: string
  createdAt: string
}

export interface AiTutorChat {
  id: string
  userId: string
  title: string
  subject: string
  chapterId: string
  createdAt: string
  updatedAt: string
}

export interface AiTutorMessage {
  id: string
  chatId: string
  userId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}
