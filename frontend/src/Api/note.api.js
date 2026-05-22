import axios from 'axios'
const BASE = import.meta.env.VITE_BASE_URL
const cfg = { withCredentials: true }

export const saveNoteApi = async (payload) => {
  const res = await axios.post(`${BASE}/note`, payload, cfg)
  return res.data
}

export const getNoteApi = async (moduleId) => {
  const res = await axios.get(`${BASE}/note/${moduleId}`, cfg)
  return res.data
}
