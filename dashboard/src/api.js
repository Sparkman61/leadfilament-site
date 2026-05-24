const BASE = import.meta.env.VITE_API_BASE ?? 'https://api.leadfilament.com/api/lf'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
    ...options,
  })
  if (res.status === 401) {
    const err = new Error('Unauthorized')
    err.status = 401
    throw err
  }
  if (!res.ok) {
    const err = new Error(`API error ${res.status}`)
    err.status = res.status
    throw err
  }
  return res.json()
}

export const api = {
  auth: {
    me: () => request('/auth/me'),
    sendMagicLink: (email) =>
      request('/auth/magic-link', { method: 'POST', body: JSON.stringify({ email }) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
  },
  client: {
    get: () => request('/client'),
    locations: () => request('/client/locations'),
  },
  conversations: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString()
      return request(`/conversations${qs ? '?' + qs : ''}`)
    },
    get: (id) => request(`/conversations/${id}`),
  },
  reports: {
    current: () => request('/reports/current'),
    list: () => request('/reports/history'),
  },
  billing: {
    get: () => request('/billing'),
  },
}
