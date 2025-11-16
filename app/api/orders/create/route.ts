import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createOrder } from '@/lib/cosmic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16'
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { session_id } = body

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id)

    if (!session || session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Invalid session or payment not completed' },
        { status: 400 }
      )
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Parse metadata
    const shippingAddress = JSON.parse(session.metadata?.shipping_address || '{}')
    const orderItems = JSON.parse(session.metadata?.order_items || '[]')

    // Create order in Cosmic
    const orderData = {
      order_number: orderNumber,
      customer_name: session.metadata?.customer_name || '',
      customer_email: session.customer_email || '',
      shipping_address: shippingAddress,
      billing_address: shippingAddress, // Use same address for billing
      order_items: orderItems,
      subtotal: parseFloat(session.metadata?.subtotal || '0'),
      shipping_cost: parseFloat(session.metadata?.shipping || '0'),
      tax: parseFloat(session.metadata?.tax || '0'),
      total: parseFloat(session.metadata?.total || '0'),
      order_status: 'Processing',
      payment_status: 'Paid',
      stripe_payment_intent_id: session.payment_intent as string,
      stripe_session_id: session_id,
      order_date: new Date().toISOString(),
    }

    await createOrder(orderData)

    return NextResponse.json({ orderNumber })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}