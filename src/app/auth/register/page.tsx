'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Shield } from '@/components/ui/Shield'
import { Eye, EyeOff, Mail, Lock, AlertCircle, Chrome, CheckCircle } from 'lucide-react'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /\d/.test(password) },
  ]
  if (!password) return null
  return (
    <div className="flex gap-3 mt-1">
      {checks.map(c => (
        <span key={c.label} className={`text-[10px] flex items-center gap-1 ${c.ok ? 'text-emerald-400' : 'opacity-30'}`}>
          <CheckCircle size={10} className={c.ok ? 'text-emerald-400' : 'opacity-30'} />
          {c.label}
        </span>
      ))}
    </div>
  )
}

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== password2) { setError('Passwords do not match'); return }
    setError(null)
    setLoading(true)
    try {
      await register(email, password, password2)
      router.push('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  function handleGoogle() {
    window.location.href = `${BASE}/api/auth/google/login/`
  }

  return (
    <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.34, 1.1, 0.64, 1] }}>
      <div className="auth-card rounded-3xl p-8 sm:p-10">

        <div className="flex justify-center mb-6">
          <Shield size={64} pulse />
        </div>

        <h1 className="text-2xl font-bold text-center mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Create your account
        </h1>
        <p className="text-sm opacity-40 text-center mb-8">Join ScamShield AI — free forever</p>

        {/* Google OAuth */}
        <button onClick={handleGoogle} type="button"
          className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl text-sm font-medium border border-white/10 hover:bg-white/5 transition-all mb-4"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          <Chrome size={16} className="opacity-70" />
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <span className="flex-1 h-px bg-white/10" />
          <span className="text-xs opacity-30">or email</span>
          <span className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" required autoComplete="email"
              className="input-field pl-10" />
          </div>

          <div>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" />
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Password" required autoComplete="new-password" minLength={8}
                className="input-field pl-10 pr-10" />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-60 transition-opacity">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <PasswordStrength password={password} />
          </div>

          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" />
            <input type={showPw ? 'text' : 'password'} value={password2} onChange={e => setPassword2(e.target.value)}
              placeholder="Confirm password" required autoComplete="new-password"
              className="input-field pl-10"
              style={{ borderColor: password2 && password !== password2 ? 'rgba(239,68,68,0.5)' : undefined }} />
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl text-xs text-red-400"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle size={13} className="shrink-0" /> {error}
            </motion.div>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs opacity-40 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="hover:opacity-70 transition-opacity" style={{ color: '#00D4FF' }}>
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  )
}
