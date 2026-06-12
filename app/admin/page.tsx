'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const check = async () => {
    const { data } = await supabase.auth.getUser()
    console.log('USER ID:', data.user?.id)
   }

    check()
  }, [])

  const checkAdmin = async () => {
    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    if (!user) {
      router.push('/')
      return
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error || profile?.role !== 'admin') {
      router.push('/')
      return
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <main className="p-6">
        <p>Loading admin...</p>
      </main>
    )
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">🧑‍💼 Admin Dashboard</h1>
      <p>Welcome Admin 👑</p>
    </main>
  )
}