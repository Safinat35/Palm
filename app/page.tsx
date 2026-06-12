'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'

type Product = {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  stock: number
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    loadProducts()
    loadCartCount()
  }, [])

  const getUser = async () => {
    const { data } = await supabase.auth.getUser()
    return data.user
  }

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')

    if (error) {
      console.error(error.message)
      setLoading(false)
      return
    }

    setProducts(data || [])
    setLoading(false)
  }

  const loadCartCount = async () => {
    const { data: userData } = await supabase.auth.getUser()

    if (!userData.user) return

    const { data } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', userData.user.id)

    const total = (data || []).reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    )

    setCartCount(total)
  }

  return (
    <main className="max-w-6xl mx-auto p-6">

      {/* HEADER */}
      <header className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold">🛍️ Soft Palm Store</h1>

        <div className="flex gap-6 text-sm">
          <a href="/">Home</a>
          <a href="/cart">Cart ({cartCount})</a>
          <a href="/orders">Orders</a>
          <a className="px-3 py-1 border rounded" href="/auth">
            Login
          </a>
        </div>
      </header>

      {/* CONTENT */}
      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
            >
              <img
                src={product.image_url}
                className="h-56 w-full object-cover"
              />

              <div className="p-4">
                <h2 className="text-xl font-bold">{product.name}</h2>
                <p className="text-gray-500 text-sm">
                  {product.description}
                </p>

                <p className="font-bold mt-2">
                  {product.price} SAR
                </p>

                <button
                  onClick={async () => {
                    const user = await getUser()

                    if (!user) {
                      alert('Please login first')
                      return
                    }

                    const { error } = await supabase
                      .from('cart_items')
                      .insert({
                        user_id: user.id,
                        product_id: product.id,
                        quantity: 1,
                      })

                    if (error) {
                      alert(error.message)
                      return
                    }

                    alert('Added to cart!')
                    loadCartCount()
                  }}
                  className="w-full mt-3 bg-black hover:bg-gray-800 text-white py-2 rounded-lg"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}