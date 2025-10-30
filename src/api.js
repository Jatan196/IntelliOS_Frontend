const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000'

async function request(path, opts = {}) {
  const url = `${BASE}${path}`
  const res = await fetch(url, opts)
  const text = await res.text()
  try {
    return { ok: res.ok, status: res.status, data: text ? JSON.parse(text) : null }
  } catch (err) {
    return { ok: res.ok, status: res.status, data: text }
  }
}

export async function getWorkspaces() {
  try {
    const r = await request('/api/workspaces')
    if (r.ok) return r.data
    return []
  } catch (e) {
    console.error('getWorkspaces error', e)
    return []
  }
}

export async function captureState() {
  try {
    const r = await request('/api/capture', { method: 'POST' })
    return r
  } catch (e) {
    console.error('captureState error', e)
    return { ok: false, status: 0, data: null }
  }
}

export async function restoreState() {
  try {
    const r = await request('/api/restore', { method: 'POST' })
    return r
  } catch (e) {
    console.error('restoreState error', e)
    return { ok: false, status: 0, data: null }
  }
}

export async function processLogs(params = {}) {
  const qs = new URLSearchParams(params).toString()
  try {
    const r = await request(`/api/process-logs?${qs}`, { method: 'POST' })
    return r
  } catch (e) {
    console.error('processLogs error', e)
    return { ok: false, status: 0, data: null }
  }
}

export async function getLogs() {
  try {
    const r = await request('/api/logs')
    return r
  } catch (e) {
    console.error('getLogs error', e)
    return { ok: false, status: 0, data: null }
  }
}
