import axios from 'axios'
const BASE = import.meta.env.VITE_BASE_URL
const cfg = { withCredentials: true }

export const markCompleteApi = async (payload) => {
  const res = await axios.post(`${BASE}/progress/complete`, payload, cfg)
  return res.data
}

export const getCourseProgressApi = async (courseId) => {
  const res = await axios.get(`${BASE}/progress/${courseId}`, cfg)
  return res.data
}

export const getCertificateApi = async (courseId) => {
  const res = await axios.get(`${BASE}/progress/certificate/${courseId}`, cfg)
  return res.data
}
