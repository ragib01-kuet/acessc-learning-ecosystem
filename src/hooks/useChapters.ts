import { useQuery } from '@tanstack/react-query'
import { blink } from '../blink/client'
import type { Chapter } from '../types'

export function useChapters(subjectId?: string) {
  return useQuery({
    queryKey: ['chapters', subjectId ?? 'all'],
    queryFn: async () => {
      const data = await blink.db.chapters.list({
        ...(subjectId ? { where: { subjectId } } : {}),
        limit: 100,
        orderBy: { orderIndex: 'asc' },
      })
      return data as Chapter[]
    },
  })
}
