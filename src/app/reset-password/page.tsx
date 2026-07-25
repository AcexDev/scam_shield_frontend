'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function Handler() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const email = params.get('email')
    const token = params.get('token')
    router.replace(`/auth/reset-confirm?email=${email}&token=${token}`)
  }, [params, router])

  return null
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <Handler />
    </Suspense>
  )
}