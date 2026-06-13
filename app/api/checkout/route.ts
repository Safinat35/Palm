import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const { items, userId } = await req.json()

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',

    line_items: items.map((item: any) => ({
      quantity: item.quantity,
      price_data: {
        currency: 'sar',
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.name,
        },
      },
    })),

    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
  })

  return NextResponse.json({ url: session.url })
}