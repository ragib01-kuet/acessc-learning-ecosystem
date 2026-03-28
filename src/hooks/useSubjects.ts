import { useQuery } from '@tanstack/react-query'
import { blink } from '../blink/client'
import type { Subject } from '../types'

export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const data = await blink.db.subjects.list({
        orderBy: { orderIndex: 'asc' },
      })
      return data as Subject[]
    },
  })
}
