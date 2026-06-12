import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { email, orderId, total } = await req.json()

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Order Confirmation',
      html: `
        <h1>✅ Order Confirmed</h1>

        <p>Thank you for your order.</p>

        <p><strong>Order ID:</strong> ${orderId}</p>

        <p><strong>Total:</strong> ${total} SAR</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    )
  }
}