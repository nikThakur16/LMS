import { createReviewApi, getCourseReviewsApi } from '@/Api/review.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCreateReview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createReviewApi,
    onSuccess: (_, vars) => {
      toast.success('Review saved!')
      queryClient.invalidateQueries({ queryKey: ['reviews', vars.courseId] })
    },
    onError: () => toast.error('Failed to save review'),
  })
}

export const useGetReviews = (courseId) => {
  return useQuery({
    queryFn: () => getCourseReviewsApi(courseId),
    queryKey: ['reviews', courseId],
    enabled: !!courseId,
    retry: false,
  })
}
