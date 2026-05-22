import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { recordActivityApi, getStreakApi, getLeaderboardApi } from '@/Api/streak.api'
import { toast } from 'sonner'

export const useGetStreak = () =>
  useQuery({
    queryKey: ['streak'],
    queryFn:  getStreakApi,
    staleTime: 1000 * 60 * 5,
  })

export const useRecordActivity = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: recordActivityApi,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['streak'] })
      // Toast for new badges
      if (data.newBadges?.length) {
        data.newBadges.forEach((name) =>
          toast.success(`🏅 Badge unlocked: ${name}!`, { duration: 4000 })
        )
      }
    },
  })
}

export const useGetLeaderboard = () =>
  useQuery({
    queryKey: ['leaderboard'],
    queryFn:  getLeaderboardApi,
    staleTime: 1000 * 60 * 2,
  })
