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

    if (!userData.user) return

    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        total,
        order_items (
          id,
          product_name,
          price,
          quantity
        )
      `)
      .eq('user_id', userData.user.id)

    if (error) {
      console.log(error.message)
      return
    }

    setOrders(data || [])
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📦 Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order: any) => (
          <div key={order.id} className="border p-4 rounded-lg mb-4">
            <p className="font-bold">Order ID:</p>
            <p className="text-sm text-gray-600 break-all">
              {order.id}
            </p>

            <p className="mt-2 font-bold">
              Total: {order.total} SAR
            </p>

            <div className="mt-3 space-y-1">
              {order.order_items.map((item: any) => (
                <p key={item.id} className="text-sm">
                  {item.product_name} × {item.quantity} — {item.price} SAR
                </p>
              ))}
            </div>
          </div>
        ))
      )}
    </main>
  )
}