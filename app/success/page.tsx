'use client'

import { useEffect } from 'react'
import { supabase } from '@/src/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')

  useEffect(() => {
    createOrder()
  }, [])

  const createOrder = async () => {
    const { data: cartData } = await supabase
      .from('cart_items')
      .select(`
        quantity,
        products (
          id,
          name,
          price
        )
      `)
      .eq('user_id', userId)

    if (!cartData) return

    // 🧮 total
    const total = cartData.reduce((sum, item: any) => {
      return sum + item.quantity * item.products.price
    }, 0)

    // 📦 create order
    const { data: order } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total,
      })
      .select()
      .single()

    // 📦 order items
    const items = cartData.map((item: any) => ({
      order_id: order.id,
      product_id: item.products.id,
      quantity: item.quantity,
    }))

    await supabase.from('order_items').insert(items)

    // 🧹 clear cart
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)

    // 📧 send email
    await fetch('/api/send-order-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: (await supabase.auth.getUser()).data.user?.email,
        orderId: order.id,
        total,
      }),
    })

    router.push('/orders')
  }

  return (
    <main className="p-10 text-center">
      <h1 className="text-2xl font-bold">Processing your order...</h1>
    </main>
  )
}