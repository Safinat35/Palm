'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'

export default function AuthPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const signUp = async () => {
    setLoading(true)
    setMessage('')

    const cleanEmail = email.trim()

    const { error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setMessage('تم إنشاء الحساب — تحقق من بريدك الإلكتروني')

    // 🔥 تأخير بسيط لضمان استقرار session
    setTimeout(() => {
      router.push('/')
    }, 300)
  }

  const signIn = async () => {
    setLoading(true)
    setMessage('')

    const cleanEmail = email.trim()

    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setMessage('تم تسجيل الدخول بنجاح')

    // 🔥 مهم: تأخير بسيط قبل التحويل
    setTimeout(() => {
      router.push('/')
    }, 300)
  }

  return (
    <main className="max-w-md mx-auto mt-20 space-y-4 p-4">
      <h1 className="text-2xl font-bold">Authentication</h1>

      <input
        className="border p-2 w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={signUp}
        disabled={loading}
        className="bg-black text-white p-2 w-full"
      >
        Sign Up
      </button>

      <button
        onClick={signIn}
        disabled={loading}
        className="border p-2 w-full"
      >
        Sign In
      </button>

      {message && (
        <p className="text-sm text-center mt-2">
          {message}
        </p>
      )}
    </main>
  )
}