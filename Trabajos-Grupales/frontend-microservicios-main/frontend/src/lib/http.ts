import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  timeout: 20000,
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      // Token inválido/expirado → limpia sesión y manda a login
      localStorage.removeItem('access_token')
      if (window.location.pathname !== '/auth/login') {
        const redirect = encodeURIComponent(window.location.pathname + window.location.search)
        window.location.href = `/auth/login?reason=expired&redirect=${redirect}`
      }
    }
    return Promise.reject(error)
  },
)

export { http }
