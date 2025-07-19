// src/api/dashboard/analytics.js

import api from '../index' // this imports your configured Axios instance

export const fetchAnalytics = async () => {
    // This URL should point to your backend API endpoint
    const res = await api.get('/dashboard/analytics')
    return res.data
}
