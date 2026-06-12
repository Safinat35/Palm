'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser()

    if (!data.user) {
      router.push('/auth')
      return
    }

    loadCart()
  }

  const loadCart = async () => {
    const { data: userData } = await supabase.auth.getUser()

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
      .eq('user_id', userData.user!.id)

    if (!error) {
      setItems(data || [])
      setLoading(false)
    }
  }

  const updateQuantity = async (id: string, qty: number) => {
    if (qty < 1) return

    await supabase
      .from('cart_items')
      .update({ quantity: qty })
      .eq('id', id)

    loadCart()
  }

  const removeItem = async (id: string) => {
    await supabase
      .from('cart_items')
      .delete()
      .eq('id', id)

    loadCart()
  }

  const total = items.reduce(
    (sum: number, item: any) =>
      sum + item.quantity * item.product.price,
    0
  )

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🛒 Cart</h1>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {items.map((item: any) => (
            <div
              key={item.id}
              className="border p-4 rounded-lg flex justify-between mb-3"
            >
              <div>
                <h2 className="font-bold">
                  {item.product.name}
                </h2>
                <p>{item.product.price} SAR</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.quantity - 1)
                  }
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    updateQuantity(item.id, item.quantity + 1)
                  }
                >
                  +
                </button>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 ml-3"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          <div className="text-xl font-bold mt-6">
            Total: {total} SAR
          </div>

          <a
            href="/checkout"
            className="block mt-4 bg-green-600 text-white text-center py-3 rounded-lg"
          >
            Checkout
          </a>
        </>
      )}
    </main>
  )
}