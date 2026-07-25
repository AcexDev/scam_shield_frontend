import type { AnalyzeResponse, StatsResponse, ReportResponse, Agency } from '@/types'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

function getAccess() {
  return typeof window !== 'undefined' ? localStorage.getItem('ss_access') : null
}

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const token = getAccess()
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

async function post<T>(path: string, body: FormData | Record<string, unknown>): Promise<T> {
  const isForm = body instanceof FormData
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: authHeaders(isForm ? undefined : { 'Content-Type': 'application/json' }),
    body: isForm ? body : JSON.stringify(body),
  })
  if (res.status === 401) {
    window.location.href = '/auth/login'
    throw new Error('Unauthenticated')
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error ?? `HTTP ${res.status}`)
  }
  return res.json()
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: authHeaders(),
  })
  if (res.status === 401) {
    window.location.href = '/auth/login'
    throw new Error('Unauthenticated')
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export function analyzeText(content: string): Promise<AnalyzeResponse> {
  return post('/api/analyze/', { content })
}

export function analyzeUrl(url: string): Promise<AnalyzeResponse> {
  return post('/api/analyze/', { url })
}

export function analyzeImage(file: File): Promise<AnalyzeResponse> {
  const form = new FormData()
  form.append('image', file)
  return post('/api/analyze/', form)
}

export function analyzeAudio(file: File): Promise<AnalyzeResponse> {
  const form = new FormData()
  form.append('audio', file)
  return post('/api/analyze/', form)
}

export function getStats(): Promise<StatsResponse> {
  return get('/api/stats/')
}

export function reportToAuthority(
  scam_fingerprint: string,
  agency: Agency,
  reporter_note?: string
): Promise<ReportResponse> {
  return post('/api/report/', { scam_fingerprint, agency, reporter_note })
}