import { markCompleteApi, getCourseProgressApi, getCertificateApi } from '@/Api/progress.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useMarkComplete = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markCompleteApi,
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['progress', vars.courseId] })
    },
    onError: () => toast.error('Failed to mark complete'),
  })
}

export const useGetProgress = (courseId) => {
  return useQuery({
    queryFn: () => getCourseProgressApi(courseId),
    queryKey: ['progress', courseId],
    enabled: !!courseId,
    retry: false,
  })
}

export const useGetCertificate = (courseId) => {
  return useQuery({
    queryFn: () => getCertificateApi(courseId),
    queryKey: ['certificate', courseId],
    enabled: !!courseId,
    retry: false,
  })
}
