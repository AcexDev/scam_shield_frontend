import type { AnalyzeResponse, StatsResponse, ReportResponse, Agency } from '@/types'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

async function post<T>(path: string, body: FormData | Record<string, unknown>): Promise<T> {
  const isForm = body instanceof FormData
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: isForm ? undefined : { 'Content-Type': 'application/json' },
    body: isForm ? body : JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error ?? `HTTP ${res.status}`)
  }
  return res.json()
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/** Analyze plain text, SMS, or email body */
export function analyzeText(content: string): Promise<AnalyzeResponse> {
  return post('/api/analyze/', { content })
}

/** Analyze a URL */
export function analyzeUrl(url: string): Promise<AnalyzeResponse> {
  return post('/api/analyze/', { url })
}

/** Analyze an image file (screenshot of scam message) */
export function analyzeImage(file: File): Promise<AnalyzeResponse> {
  const form = new FormData()
  form.append('image', file)
  return post('/api/analyze/', form)
}

/** Analyze an audio file (voice note / call recording) */
export function analyzeAudio(file: File): Promise<AnalyzeResponse> {
  const form = new FormData()
  form.append('audio', file)
  return post('/api/analyze/', form)
}

/** Get platform-wide statistics */
export function getStats(): Promise<StatsResponse> {
  return get('/api/stats/')
}

/** Report a confirmed scam to a Nigerian authority */
export function reportToAuthority(
  scam_fingerprint: string,
  agency: Agency,
  reporter_note?: string
): Promise<ReportResponse> {
  return post('/api/report/', { scam_fingerprint, agency, reporter_note })
}
