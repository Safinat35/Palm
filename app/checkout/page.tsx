'use client'

import { useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

  const placeOrder = async () => {
    setProcessing(true)

    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    if (!user) {
      setProcessing(false)
      return
    }

    const { data: cart } = await supabase
      .from('cart_items')
      .select(`
        quantity,
        products (
          id,
          price
        )
      `)
      .eq('user_id', user.id)

    const total =
      cart?.reduce(
        (sum, item: any) =>
          sum + item.quantity * item.products.price,
        0
      ) || 0

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total,
      })
      .select()
      .single()

    if (error) {
      console.log(error.message)
      setProcessing(false)
      return
    }

    const items = (cart || []).map((item: any) => ({
      order_id: order.id,
      product_id: item.products?.id,
      quantity: item.quantity,
    }))

    await supabase.from('order_items').insert(items)

    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)

    setProcessing(false)
    router.push('/orders')
  }

  return (
    <main className="p-6">
      <h1>💳 Checkout</h1>

      <button
        onClick={placeOrder}
        disabled={processing}
        className="bg-green-600 text-white px-4 py-2 mt-4"
      >
        {processing ? 'Processing...' : 'Place Order'}
      </button>
    </main>
  )
}