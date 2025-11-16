import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Validate Stripe secret key exists and is not a placeholder
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
if (!stripeSecretKey || stripeSecretKey.includes('your-stripe-secret-key') || stripeSecretKey.includes('*****')) {
  console.error('STRIPE_SECRET_KEY is missing or invalid. Please set a valid Stripe secret key in your .env file.')
}

const stripe = new Stripe(stripeSecretKey as string, {
  apiVersion: '2023-10-16'
})

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!stripeSecretKey || stripeSecretKey.includes('your-stripe-secret-key') || stripeSecretKey.includes('*****')) {
      console.error('Stripe configuration error: Invalid or missing STRIPE_SECRET_KEY')
      return NextResponse.json(
        { 
          error: 'Payment system configuration error. Please contact support.',
          details: 'STRIPE_SECRET_KEY is not properly configured'
        },
        { status: 500 }
      )
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.error('Environment variable NEXT_PUBLIC_APP_URL is not set')
      return NextResponse.json(
        { error: 'Application configuration error' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { items, customer_email, customer_name, shipping_address } = body

    // Validate request body
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: items are required' },
        { status: 400 }
      )
    }

    if (!customer_email || !customer_name) {
      return NextResponse.json(
        { error: 'Invalid request: customer information is required' },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    const tax = subtotal * 0.08
    const shipping = subtotal > 100 ? 0 : 15
    const total = subtotal + tax + shipping

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product_name,
            images: item.product_image ? [item.product_image] : [],
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      customer_email,
      metadata: {
        customer_name,
        shipping_address: JSON.stringify(shipping_address),
        order_items: JSON.stringify(items),
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    
    // Provide more specific error messages
    if (error.type === 'StripeAuthenticationError') {
      return NextResponse.json(
        { 
          error: 'Payment system authentication failed. Please check your Stripe API keys.',
          details: 'Invalid Stripe API key - please verify STRIPE_SECRET_KEY in your environment variables'
        },
        { status: 500 }
      )
    }
    
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: 'Invalid payment request', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message },
      { status: 500 }
    )
  }
}