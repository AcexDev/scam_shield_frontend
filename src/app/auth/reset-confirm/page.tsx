'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Shield } from '@/components/ui/Shield'
import { Mail, Lock, Key, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

export default function ResetConfirmPage() {
  const { confirmPasswordReset } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPassword2, setNewPassword2] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== newPassword2) { setError('Passwords do not match'); return }
    setError(null)
    setLoading(true)
    try {
      await confirmPasswordReset(email, otp, token, newPassword, newPassword2)
      setDone(true)
      setTimeout(() => router.push('/auth/login'), 2500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Reset failed')
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
          {done ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full" style={{ background: 'rgba(16,185,129,0.12)' }}>
                  <CheckCircle size={32} className="text-emerald-400" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Password updated!</h2>
              <p className="text-sm opacity-50">Redirecting you to sign in…</p>
            </motion.div>
          ) : (
            <motion.div key="form">
              <h1 className="text-2xl font-bold text-center mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Set new password</h1>
              <p className="text-sm opacity-40 text-center mb-8">Enter the OTP from your email and choose a new password</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Your email address" required className="input-field pl-10" />
                </div>

                <div className="relative">
                  <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" />
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value)}
                    placeholder="OTP from email" required className="input-field pl-10 font-mono tracking-widest" />
                </div>

                <div className="relative">
                  <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" />
                  <input type="text" value={token} onChange={e => setToken(e.target.value)}
                    placeholder="Reset token (if provided)" className="input-field pl-10 font-mono text-xs" />
                </div>

                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" />
                  <input type={showPw ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    placeholder="New password" required minLength={8} className="input-field pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-60 transition-opacity">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" />
                  <input type={showPw ? 'text' : 'password'} value={newPassword2} onChange={e => setNewPassword2(e.target.value)}
                    placeholder="Confirm new password" required className="input-field pl-10"
                    style={{ borderColor: newPassword2 && newPassword !== newPassword2 ? 'rgba(239,68,68,0.5)' : undefined }} />
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl text-xs text-red-400"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <AlertCircle size={13} className="shrink-0" /> {error}
                  </motion.div>
                )}

                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Updating password…' : 'Update Password'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <Link href="/auth/login" className="flex items-center justify-center gap-1.5 mt-6 text-xs opacity-40 hover:opacity-70 transition-opacity">
          ← Back to sign in
        </Link>
      </div>
    </motion.div>
  )
}
