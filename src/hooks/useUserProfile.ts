import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blink } from '../blink/client'
import type { UserProfile } from '../types'

export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      const data = await blink.db.userProfiles.list({
        where: { userId },
        limit: 1,
      })
      return (data as UserProfile[])[0] || null
    },
    enabled: !!userId,
  })
}

export function useCreateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (profile: Partial<UserProfile> & { userId: string }) => {
      const result = await blink.db.userProfiles.create({
        userId: profile.userId,
        targetExam: profile.targetExam || 'ssc',
        weakSubject: profile.weakSubject || '',
        dailyTime: profile.dailyTime || 2,
        preferredLanguage: profile.preferredLanguage || 'en',
        onboardingCompleted: 1,
        consistencyScore: 0,
        behaviorTag: 'new',
        currentStreak: 0,
        longestStreak: 0,
        totalXp: 0,
        planStartDate: new Date().toISOString().split('T')[0],
      })
      return result as UserProfile
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] })
    },
  })
}
