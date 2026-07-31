'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { Shield } from '@/components/ui/Shield'
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

export default function ResetPage() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await requestPasswordReset(email)
      setSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.34, 1.1, 0.64, 1] }}>
      <div className="auth-card rounded-3xl p-8 sm:p-10">
        <div className="flex justify-center mb-6">
          <Shield size={64} pulse />
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full" style={{ background: 'rgba(16,185,129,0.12)' }}>
                  <CheckCircle size={32} className="text-emerald-400" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Check your email</h2>
              <p className="text-sm opacity-50 mb-6">
                We sent a reset link to <strong className="opacity-80">{email}</strong>. Check your inbox and follow the instructions.
              </p>
              <Link href="/reset-confirm"
                className="btn-primary inline-block text-center text-white no-underline py-3 px-6 rounded-2xl text-sm font-semibold"
                style={{ background: 'linear-gradient(135deg, #00D4FF, #7C3AED)', fontFamily: 'Space Grotesk, sans-serif' }}>
                Enter OTP & New Password
              </Link>
            </motion.div>
          ) : (
            <motion.div key="form">
              <h1 className="text-2xl font-bold text-center mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Reset password</h1>
              <p className="text-sm opacity-40 text-center mb-8">Enter your email and we'll send a reset link</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" required autoComplete="email"
                    className="input-field !pl-10" />
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl text-xs text-red-400"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <AlertCircle size={13} className="shrink-0" /> {error}
                  </motion.div>
                )}

                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <Link href="/login" className="flex items-center justify-center gap-1.5 mt-6 text-xs opacity-40 hover:opacity-70 transition-opacity">
          <ArrowLeft size={12} /> Back to sign in
        </Link>
      </div>
    </motion.div>
  )
}
