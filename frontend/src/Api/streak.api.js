import axios from 'axios'
const BASE = import.meta.env.VITE_BASE_URL
const cfg  = { withCredentials: true }

export const recordActivityApi = () =>
  axios.post(`${BASE}/streak/activity`, {}, cfg).then((r) => r.data)

export const getStreakApi = () =>
  axios.get(`${BASE}/streak`, cfg).then((r) => r.data)

export const getLeaderboardApi = () =>
  axios.get(`${BASE}/streak/leaderboard`, cfg).then((r) => r.data)
