import { useQuery } from '@tanstack/react-query'
import { blink } from '../blink/client'
import type { Question } from '../types'

export function useQuestions(chapterId?: string) {
  return useQuery({
    queryKey: ['questions', chapterId],
    queryFn: async () => {
      const data = await blink.db.questions.list({
        where: { chapterId },
        limit: 100,
      })
      return data as Question[]
    },
    enabled: !!chapterId,
  })
}

// Shuffle utility
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function useRandomQuiz(chapterId?: string, count = 5) {
  return useQuery({
    queryKey: ['quiz', chapterId, count],
    queryFn: async () => {
      const data = await blink.db.questions.list({
        where: { chapterId },
        limit: 100,
      })
      const questions = data as Question[]
      return shuffleArray(questions).slice(0, count)
    },
    enabled: !!chapterId,
    staleTime: Infinity, // Don't refetch automatically (quiz should be stable)
  })
}
