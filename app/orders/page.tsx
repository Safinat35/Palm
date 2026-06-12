'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    const { data: userData } = await supabase.auth.getUser()

    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userData.user!.id)

    setOrders(data || [])
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Orders</h1>

      {orders.map((order) => (
        <div key={order.id} className="border p-4 mb-3">
          <p>ID: {order.id}</p>
          <p>Total: {order.total} SAR</p>
        </div>
      ))}
    </main>
  )
}