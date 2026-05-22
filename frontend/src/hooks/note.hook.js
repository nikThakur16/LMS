import { saveNoteApi, getNoteApi } from '@/Api/note.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useSaveNote = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveNoteApi,
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['note', vars.moduleId] })
    },
  })
}

export const useGetNote = (moduleId) => {
  return useQuery({
    queryFn: () => getNoteApi(moduleId),
    queryKey: ['note', moduleId],
    enabled: !!moduleId,
    retry: false,
  })
}
