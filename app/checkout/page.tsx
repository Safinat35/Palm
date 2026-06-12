'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const [items, setItems] = useState<any[]>([])
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    const { data: userData } = await supabase.auth.getUser()

    const { data } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        product:products (
          name,
          price
        )
      `)
      .eq('user_id', userData.user!.id)

    setItems(data || [])
  }

  const total = items.reduce(
    (sum: number, item: any) =>
      sum + item.quantity * item.product.price,
    0
  )

  const placeOrder = async () => {
    setProcessing(true)

    const { data: userData } = await supabase.auth.getUser()

    const user = userData.user!

    const { data: order } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total,
      })
      .select()
      .single()

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }))

    await supabase.from('order_items').insert(orderItems)

    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)

    setProcessing(false)
    router.push('/orders')
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">💳 Checkout</h1>

      {items.map((item: any) => (
        <p key={item.id}>
          {item.product.name} × {item.quantity}
        </p>
      ))}

      <h2 className="text-xl font-bold mt-4">
        Total: {total} SAR
      </h2>

      <button
        onClick={placeOrder}
        disabled={processing}
        className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg"
      >
        {processing ? 'Processing...' : 'Place Order'}
      </button>
    </main>
  )
}