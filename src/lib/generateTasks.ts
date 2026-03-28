import { blink } from '../blink/client'
import type { Chapter } from '../types'

interface GenerateParams {
  userId: string
  chapters: Chapter[]
  dailyTime: number
  startDate: string
}

export async function generateDailyTasks({ userId, chapters, dailyTime, startDate }: GenerateParams) {
  const today = new Date().toISOString().split('T')[0]

  // Check if tasks already exist for today
  const existing = await blink.db.tasks.list({
    where: { userId, date: today },
    limit: 1,
  })
  if (existing && (existing as unknown[]).length > 0) return

  // Calculate which day of the plan we're on
  const start = new Date(startDate)
  const now = new Date(today)
  const dayNumber = Math.max(1, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1)

  if (dayNumber > 90) return // Plan completed

  // Distribute chapters across 90 days
  const totalChapters = chapters.length
  const chaptersPerDay = totalChapters / 75 // Leave 15 days for revision
  const currentChapterIndex = Math.min(
    Math.floor((dayNumber - 1) * chaptersPerDay),
    totalChapters - 1
  )
  const chapter = chapters[currentChapterIndex]
  if (!chapter) return

  // Scale tasks by daily time
  const tasks = []

  // Lecture task
  tasks.push({
    userId,
    date: today,
    taskType: 'lecture',
    title: `Study: ${chapter.title}`,
    titleBn: `পড়ুন: ${chapter.titleBn}`,
    description: `Read the notes and watch the lecture for this chapter.`,
    chapterId: chapter.id,
    status: 'pending',
    dayNumber,
  })

  // Practice task
  tasks.push({
    userId,
    date: today,
    taskType: 'practice',
    title: `Practice: ${chapter.title}`,
    titleBn: `অনুশীলন: ${chapter.titleBn}`,
    description: `Solve MCQ and creative questions for this chapter.`,
    chapterId: chapter.id,
    status: 'pending',
    dayNumber,
  })

  // Revision task (every 3rd day)
  if (dayNumber % 3 === 0 && currentChapterIndex > 0) {
    const revChapter = chapters[currentChapterIndex - 1]
    tasks.push({
      userId,
      date: today,
      taskType: 'revision',
      title: `Revise: ${revChapter.title}`,
      titleBn: `পুনরালোচনা: ${revChapter.titleBn}`,
      description: `Review and revise the previous chapter.`,
      chapterId: revChapter.id,
      status: 'pending',
      dayNumber,
    })
  }

  // Test task (every 5th day, or if time allows)
  if (dayNumber % 5 === 0 || dailyTime >= 3) {
    tasks.push({
      userId,
      date: today,
      taskType: 'test',
      title: `Quiz: ${chapter.title}`,
      titleBn: `পরীক্ষা: ${chapter.titleBn}`,
      description: `Take a short quiz to test your understanding.`,
      chapterId: chapter.id,
      status: 'pending',
      dayNumber,
    })
  }

  // Create all tasks
  if (tasks.length > 0) {
    await blink.db.tasks.createMany(tasks)
  }
}
