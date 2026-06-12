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
        created_at,
        order_items (
          id,
          quantity,
          products (
            name,
            price,
            image_url
          )
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
      <h1 className="text-2xl font-bold mb-6">📦 My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order: any) => (
          <div key={order.id} className="border p-4 rounded-lg mb-5">
            <p className="text-sm text-gray-500">
              {new Date(order.created_at).toLocaleString()}
            </p>

            <p className="font-bold mt-2">
              Total: {order.total} SAR
            </p>

            <div className="mt-3 space-y-2">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="text-sm">
                  {item.products?.name} × {item.quantity}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </main>
  )
}