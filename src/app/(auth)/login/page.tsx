'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Shield } from '@/components/ui/Shield'
import { Eye, EyeOff, Mail, Lock, AlertCircle, } from 'lucide-react'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      router.push('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  function handleGoogle() {
    window.location.href = `${BASE}/api/auth/google/login/`
  }

  return (
    <motion.div
      className="w-full max-w-md" 
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.34, 1.1, 0.64, 1] }}
    >
      <div className="auth-card rounded-3xl p-8 sm:p-10">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <Shield size={64} pulse />
        </div>

        <h1
          className="text-2xl font-bold text-center mb-1"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Welcome back
        </h1>
        <p className="text-sm opacity-40 text-center mb-8">
          Sign in to ScamShield AI
        </p>

        {/* Google OAuth */}
        <button
          onClick={handleGoogle}
          type="button"
          className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl text-sm font-medium border border-gray-300 hover:bg-gray-100 transition-all mb-4"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.13C3.26 21.3 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.63H1.29C.47 8.26 0 10.07 0 12s.47 3.74 1.29 5.37l3.99-3.13z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.63l3.99 3.13c.95-2.85 3.6-4.96 6.72-4.96z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <span className="flex-1 h-px bg-white/10" />
          <span className="text-xs opacity-30">or email</span>
          <span className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative flex items-center">
            <Mail
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="input-field !pl-10"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none"
            />
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              autoComplete="current-password"
              className="input-field !pl-10 !pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-60 transition-opacity"
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <Link
              href="/reset"
              className="text-xs opacity-40 hover:opacity-70 transition-opacity"
              style={{ color: "#00D4FF" }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl text-xs text-red-400"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <AlertCircle size={13} className="shrink-0" /> {error}
            </motion.div>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs opacity-40 mt-6">
          No account?{" "}
          <Link
            href="/register"
            className="hover:opacity-70 transition-opacity"
            style={{ color: "#00D4FF" }}
          >
            Create one
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
