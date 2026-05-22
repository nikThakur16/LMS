import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addToWishlistApi, removeFromWishlistApi, getWishlistApi } from '@/Api/wishlist.api'

export const useGetWishlist = () =>
  useQuery({
    queryKey: ['wishlist'],
    queryFn:  getWishlistApi,
    staleTime: 1000 * 60 * 2,
  })

export const useAddWishlist = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addToWishlistApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wishlist'] }),
  })
}

export const useRemoveWishlist = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: removeFromWishlistApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wishlist'] }),
  })
}
