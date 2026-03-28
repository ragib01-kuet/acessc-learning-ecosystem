import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blink } from '../blink/client'
import type { ExamResult } from '../types'

export function useExamResults(userId?: string) {
  return useQuery({
    queryKey: ['examResults', userId],
    queryFn: async () => {
      const data = await blink.db.examResults.list({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        limit: 50,
      })
      return data as ExamResult[]
    },
    enabled: !!userId,
  })
}

export function useChapterExamResults(userId?: string, chapterId?: string) {
  return useQuery({
    queryKey: ['examResults', userId, chapterId],
    queryFn: async () => {
      const data = await blink.db.examResults.list({
        where: { userId, chapterId },
        orderBy: { createdAt: 'desc' },
        limit: 10,
      })
      return data as ExamResult[]
    },
    enabled: !!userId && !!chapterId,
  })
}

export function useSaveExamResult() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (result: Omit<ExamResult, 'id' | 'createdAt'>) => {
      return blink.db.examResults.create(result)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['examResults', variables.userId] })
    },
  })
}
