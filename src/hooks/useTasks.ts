import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blink } from '../blink/client'
import type { Task } from '../types'

export function useTodayTasks(userId: string | undefined) {
  const today = new Date().toISOString().split('T')[0]

  return useQuery({
    queryKey: ['tasks', userId, today],
    queryFn: async () => {
      const data = await blink.db.tasks.list({
        where: { userId, date: today },
        orderBy: { createdAt: 'asc' },
      })
      return data as Task[]
    },
    enabled: !!userId,
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await blink.db.tasks.update(id, { status })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
