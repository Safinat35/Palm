'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([])
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    if (!user) return

    const { data } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        products (
          id,
          name,
          price
        )
      `)
      .eq('user_id', user.id)

    setCart(data || [])
  }

  const payWithStripe = async () => {
    setProcessing(true)

    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    if (!user) {
      setProcessing(false)
      return
    }

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        items: cart.map((item: any) => ({
          name: item.products.name,
          price: item.products.price,
          quantity: item.quantity,
        })),
      }),
    })

    const data = await res.json()

    setProcessing(false)

    if (data.url) {
      window.location.href = data.url
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">💳 Checkout</h1>

      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          <div className="space-y-2">
            {cart.map((item: any) => (
              <div key={item.id} className="border p-3 rounded">
                {item.products?.name} × {item.quantity}
              </div>
            ))}
          </div>

          <button
            onClick={payWithStripe}
            disabled={processing}
            className="mt-6 w-full bg-black text-white py-3 rounded-lg"
          >
            {processing ? 'Processing...' : 'Pay with Stripe'}
          </button>
        </>
      )}
    </main>
  )
}