import { useQuery } from '@tanstack/react-query'
import { blink } from '../blink/client'
import type { Topic } from '../types'

export function useTopics(chapterId: string | undefined) {
  return useQuery({
    queryKey: ['topics', chapterId],
    queryFn: async () => {
      const data = await blink.db.topics.list({
        where: { chapterId },
        orderBy: { orderIndex: 'asc' },
      })
      return data as Topic[]
    },
    enabled: !!chapterId,
  })
}
