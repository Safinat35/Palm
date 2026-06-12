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
    const user = userData.user

    if (!user) return

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        product:products (
          name,
          price
        )
      `)
      .eq('user_id', user.id)

    if (error) {
      console.log(error.message)
      return
    }

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
  const user = userData.user

  if (!user) return

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

  const orderItems = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.products.id,
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

    // 2. insert order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.products.id,
      quantity: item.quantity,
}))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.log('ITEMS ERROR:', itemsError.message)
    }

    // 3. clear cart
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)

    setProcessing(false)

    // 4. redirect
    router.push('/orders')
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">💳 Checkout</h1>

      {items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item: any) => (
              <div key={item.id} className="border p-3 rounded-lg">
                {item.product.name} × {item.quantity}
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold mt-6">
            Total: {total} SAR
          </h2>

          <button
            onClick={placeOrder}
            disabled={processing}
            className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg"
          >
            {processing ? 'Processing...' : 'Place Order'}
          </button>
        </>
      )}
    </main>
  )
}