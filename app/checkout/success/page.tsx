'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCartStore } from '@/lib/cart-store'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const clearCart = useCartStore((state) => state.clearCart)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      router.push('/cart')
      return
    }

    // Create order in Cosmic
    const createOrder = async () => {
      try {
        const response = await fetch('/api/orders/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        })

        const data = await response.json()
        
        if (data.orderNumber) {
          setOrderNumber(data.orderNumber)
          clearCart()
        }
      } catch (error) {
        console.error('Failed to create order:', error)
      } finally {
        setLoading(false)
      }
    }

    createOrder()
  }, [searchParams, router, clearCart])

  if (loading) {
    return (
      <div className="min-h-screen py-16 bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-neutral-400">Processing your order...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-500/20 border border-green-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Order Confirmed!</h1>
          <p className="text-neutral-400 mb-2">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          
          {orderNumber && (
            <p className="text-accent font-semibold mb-8">
              Order Number: {orderNumber}
            </p>
          )}

          <div className="bg-primary-light rounded-lg p-6 mb-8">
            <p className="text-neutral-300 mb-4">
              We've sent a confirmation email with your order details.
            </p>
            <p className="text-neutral-400 text-sm">
              You can track your order status in the Orders section.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/orders"
              className="px-8 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-semibold transition-colors"
            >
              View Orders
            </Link>
            <Link
              href="/products"
              className="px-8 py-3 bg-primary-light hover:bg-neutral-800 text-white rounded-lg font-semibold transition-colors border border-neutral-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-16 bg-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}