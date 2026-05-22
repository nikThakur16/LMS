import axios from 'axios'
const BASE = import.meta.env.VITE_BASE_URL
const cfg  = { withCredentials: true }

export const addToWishlistApi    = (courseId) => axios.post(`${BASE}/api/user/wishlist/add`, { courseId }, cfg).then(r => r.data)
export const removeFromWishlistApi = (courseId) => axios.post(`${BASE}/api/user/wishlist/remove`, { courseId }, cfg).then(r => r.data)
export const getWishlistApi      = () => axios.get(`${BASE}/api/user/wishlist`, cfg).then(r => r.data)
