import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blink } from '../blink/client'
import type { Chapter, UserProgress } from '../types'

export function useUserProgress(userId: string | undefined) {
  return useQuery({
    queryKey: ['userProgress', userId],
    queryFn: async () => {
      const data = await blink.db.userProgress.list({
        where: { userId },
        limit: 100,
      })
      return data as UserProgress[]
    },
    enabled: !!userId,
  })
}

export function useCreateProgressEntries() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, chapters }: { userId: string; chapters: Chapter[] }) => {
      const existing = await blink.db.userProgress.list({ where: { userId }, limit: 100 }) as UserProgress[]
      const existingChapterIds = new Set(existing.map((item) => item.chapterId))
      const missing = chapters
        .filter((chapter) => !existingChapterIds.has(chapter.id))
        .map((chapter) => ({
          userId,
          chapterId: chapter.id,
          completionPercentage: 0,
          masteryLevel: 'not_started',
          topicsCompleted: 0,
          lastAccessed: new Date().toISOString(),
        }))

      if (missing.length > 0) {
        await blink.db.userProgress.createMany(missing)
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProgress', variables.userId] })
    },
  })
}

function getMasteryLevel(percentage: number): UserProgress['masteryLevel'] {
  if (percentage >= 100) return 'mastered'
  if (percentage >= 75) return 'advanced'
  if (percentage >= 50) return 'intermediate'
  if (percentage > 0) return 'beginner'
  return 'not_started'
}

export function useMarkTopicComplete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      chapter,
      totalTopics,
    }: {
      userId: string
      chapter: Chapter
      totalTopics: number
    }) => {
      const existing = await blink.db.userProgress.list({
        where: { userId, chapterId: chapter.id },
        limit: 1,
      }) as UserProgress[]

      const current = existing[0]
      const nextTopicsCompleted = Math.min((current?.topicsCompleted ?? 0) + 1, totalTopics)
      const completionPercentage = Math.round((nextTopicsCompleted / Math.max(totalTopics, 1)) * 100)
      const masteryLevel = getMasteryLevel(completionPercentage)

      if (current) {
        await blink.db.userProgress.update(current.id, {
          topicsCompleted: nextTopicsCompleted,
          completionPercentage,
          masteryLevel,
          lastAccessed: new Date().toISOString(),
        })
        return
      }

      await blink.db.userProgress.create({
        userId,
        chapterId: chapter.id,
        topicsCompleted: nextTopicsCompleted,
        completionPercentage,
        masteryLevel,
        lastAccessed: new Date().toISOString(),
      })
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProgress', variables.userId] })
    },
  })
}