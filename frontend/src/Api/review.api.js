import axios from 'axios'
const BASE = import.meta.env.VITE_BASE_URL
const cfg = { withCredentials: true }

export const createReviewApi = async (payload) => {
  const res = await axios.post(`${BASE}/review`, payload, cfg)
  return res.data
}

export const getCourseReviewsApi = async (courseId) => {
  const res = await axios.get(`${BASE}/review/${courseId}`, cfg)
  return res.data
}
