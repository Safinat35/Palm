'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    createOrder()
  }, [])

  const createOrder = async () => {
    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    if (!user) {
      router.push('/auth')
      return
    }

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
      .eq('user_id', user.id)

    if (!cartData || cartData.length === 0) {
      router.push('/orders')
      return
    }

    const total = cartData.reduce((sum: number, item: any) => {
      return sum + item.quantity * item.products.price
    }, 0)

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total,
      })
      .select()
      .single()

    if (error || !order) {
      console.log(error)
      return
    }

    const items = cartData.map((item: any) => ({
      order_id: order.id,
      product_id: item.products.id,
      quantity: item.quantity,
    }))

    await supabase.from('order_items').insert(items)

    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)

    await fetch('/api/send-order-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        orderId: order.id,
        total,
      }),
    })

    setLoading(false)

    router.push('/orders')
  }

  return (
    <main className="p-10 text-center">
      <h1 className="text-2xl font-bold">
        {loading ? 'Processing your order...' : 'Order completed'}
      </h1>
    </main>
  )
}