import axios from "axios"

export const purchaseCourseApi = async (payload) => {
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/payment/checkout`,
        payload,
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    )
    return res.data
}

export const checkOutSuccessApi = async (sessionId) => {
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/payment/checkout-success`,
        { sessionId },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    )
    return res.data
}
