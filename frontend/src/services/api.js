import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({
  baseURL: 'https://lein-n04y.onrender.com',
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = getToken()

  const protectedPostPaths = [
    '/incidents',
    '/assign',
    '/resolve',
  ]

  const protectedGetPaths = [
    '/incidents/my',
    '/auth/me',
    '/auth/logout',
  ]

  const method = String(
    config.method || ''
  ).toLowerCase()

  const url = String(
    config.url || ''
  ).split('?')[0]

  const isProtectedPost =
    method === 'post' &&
    protectedPostPaths.some(
      p => url.startsWith(p)
    )

  const isProtectedGet =
    method === 'get' &&
    protectedGetPaths.some(
      p => url.startsWith(p)
    )

  const isDispatchPath =
    url.includes('/dispatch') ||
    url.includes('/suggestion')

  if (
    token && (
      isProtectedPost ||
      isProtectedGet ||
      isDispatchPath
    )
  ) {
    config.headers = config.headers || {}
    config.headers.Authorization =
      `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.code === 'ECONNREFUSED' ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      !error.response
    ) {
      console.warn(
        '[LEIN] Backend offline or slow —' +
        'using mock data fallback'
      )
    }
    return Promise.reject(error)
  }
)

export default api
