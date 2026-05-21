import axios from "axios"

export const getDataApi = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/analytic/getAnalytic`,
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    )
    return res.data
}

export const dailyDataApi = async (startDate, endDate) => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/analytic/getDailyData`,
        {
            params: { startDate, endDate },
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        }
    )
    return res.data
}
