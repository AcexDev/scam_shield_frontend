'use client'
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import type { AuthTokens, AuthUser } from '@/types'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

// ── Token storage ─────────────────────────────────────────────
const TOKEN_KEY = 'ss_access'
const REFRESH_KEY = 'ss_refresh'

function saveTokens(t: AuthTokens) {
  localStorage.setItem(TOKEN_KEY, t.access)
  localStorage.setItem(REFRESH_KEY, t.refresh)
}
function clearTokens() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
}
function getAccess()  { return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY)   : null }
function getRefresh() { return typeof window !== 'undefined' ? localStorage.getItem(REFRESH_KEY) : null }

// ── JWT helpers ───────────────────────────────────────────────
function decodePayload(token: string): Record<string, unknown> {
  try { return JSON.parse(atob(token.split('.')[1])) } catch { return {} }
}
function decodeEmail(token: string): string | null {
  const p = decodePayload(token)
  return (p.email ?? p.user_email ?? null) as string | null
}
function tokenExpiry(token: string): number {
  const p = decodePayload(token)
  return typeof p.exp === 'number' ? p.exp * 1000 : 0
}
function isExpired(token: string): boolean {
  return tokenExpiry(token) < Date.now()
}

// ── Context shape ─────────────────────────────────────────────
interface AuthCtx {
  user: AuthUser | null
  accessToken: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, password2: string) => Promise<void>
  logout: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  confirmPasswordReset: (email: string, otp: string, token: string, new_password: string, new_password2: string) => Promise<void>
  refreshAccess: () => Promise<string | null>
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]               = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading]         = useState(true)
  const refreshTimer                  = useRef<ReturnType<typeof setTimeout> | null>(null)

  function applyToken(access: string, fallbackEmail?: string) {
    setAccessToken(access)
    const email = decodeEmail(access) ?? fallbackEmail ?? null
    if (email) setUser({ email })
  }

  function scheduleRefresh(access: string) {
    if (refreshTimer.current) clearTimeout(refreshTimer.current)
    const msLeft = tokenExpiry(access) - Date.now() - 60_000
    if (msLeft > 0) refreshTimer.current = setTimeout(silentRefresh, msLeft)
  }

  const silentRefresh = useCallback(async () => {
    const refresh = getRefresh()
    if (!refresh) { setUser(null); setAccessToken(null); return }
    try {
      const res = await fetch(`${BASE}/api/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      })
      if (!res.ok) throw new Error('refresh_failed')
      const data: { access: string; refresh?: string } = await res.json()
      localStorage.setItem(TOKEN_KEY, data.access)
      if (data.refresh) localStorage.setItem(REFRESH_KEY, data.refresh)
      applyToken(data.access)
      scheduleRefresh(data.access)
    } catch {
      clearTokens()
      setUser(null)
      setAccessToken(null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function hydrate() {
      const access = getAccess()

      if (!access) {
        setUser(null)
        setAccessToken(null)
        setLoading(false)
        return
      }

      if (isExpired(access)) {
        silentRefresh().finally(() => setLoading(false))
        return
      }

      applyToken(access)
      scheduleRefresh(access)
      setLoading(false)
    }

    hydrate()

    window.addEventListener('storage', hydrate)

    return () => {
      window.removeEventListener('storage', hydrate)
      if (refreshTimer.current) clearTimeout(refreshTimer.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function login(email: string, password: string) {
    const res = await fetch(`${BASE}/api/auth/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail ?? err.non_field_errors?.[0] ?? 'Invalid credentials')
    }
    const tokens: AuthTokens = await res.json()
    saveTokens(tokens)
    applyToken(tokens.access, email)
    scheduleRefresh(tokens.access)
  }

  async function register(email: string, password: string, password2: string) {
    const res = await fetch(`${BASE}/api/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, password2 }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.email?.[0] ?? err.password?.[0] ?? err.non_field_errors?.[0] ?? 'Registration failed')
    }
    await login(email, password)
  }

  async function logout() {
    const access = getAccess()
    if (access) {
      await fetch(`${BASE}/api/auth/logout/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${access}` },
      }).catch(() => null)
    }
    clearTokens()
    setUser(null)
    setAccessToken(null)
    if (refreshTimer.current) clearTimeout(refreshTimer.current)
  }

  async function requestPasswordReset(email: string) {
    const res = await fetch(`${BASE}/api/auth/password-reset/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.email?.[0] ?? 'Password reset failed')
    }
  }

  async function confirmPasswordReset(
    email: string, otp: string, token: string,
    new_password: string, new_password2: string
  ) {
    const res = await fetch(`${BASE}/api/auth/password-reset-confirm/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, token, new_password, new_password2 }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.new_password?.[0] ?? err.detail ?? 'Reset failed')
    }
  }

  async function refreshAccess(): Promise<string | null> {
    await silentRefresh()
    return getAccess()
  }

  return (
    <Ctx.Provider value={{ user, accessToken, loading, login, register, logout, requestPasswordReset, confirmPasswordReset, refreshAccess }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}