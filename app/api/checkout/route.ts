import { NextResponse } from 'next/server'

export async function POST() {

  return NextResponse.json({
    url: 'https://checkout.stripe.com/pay/test-session'
  })
}