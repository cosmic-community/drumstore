'use client'

import { useState, FormEvent } from 'react'
import { useCartStore } from '@/lib/cart-store'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getCartTotal, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
  })

  const total = getCartTotal()
  const tax = total * 0.08
  const shipping = total > 100 ? 0 : 15
  const finalTotal = total + tax + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Your cart is empty</h1>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-semibold transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            product_id: item.product.id,
            product_name: item.product.metadata.product_name,
            product_image: item.product.metadata.product_images?.[0]?.imgix_url || item.product.thumbnail,
            quantity: item.quantity,
            price: item.product.metadata.price,
          })),
          customer_email: formData.email,
          customer_name: formData.name,
          shipping_address: {
            line1: formData.line1,
            line2: formData.line2,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            country: formData.country,
          },
        }),
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        setError('Failed to create checkout session')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-primary-light rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-neutral-400 mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 bg-primary border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 bg-primary border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 bg-primary border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-primary-light rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-neutral-400 mb-2">Street Address *</label>
                      <input
                        type="text"
                        required
                        value={formData.line1}
                        onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                        className="w-full px-4 py-2 bg-primary border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-2">Apartment, suite, etc.</label>
                      <input
                        type="text"
                        value={formData.line2}
                        onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                        className="w-full px-4 py-2 bg-primary border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-400 mb-2">City *</label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-4 py-2 bg-primary border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-2">State *</label>
                        <input
                          type="text"
                          required
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-4 py-2 bg-primary border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-400 mb-2">Postal Code *</label>
                        <input
                          type="text"
                          required
                          value={formData.postal_code}
                          onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                          className="w-full px-4 py-2 bg-primary border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-2">Country *</label>
                        <select
                          required
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full px-4 py-2 bg-primary border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent"
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-accent hover:bg-accent/90 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Continue to Payment'}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-primary-light rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-neutral-400">
                        {item.product.metadata.product_name} × {item.quantity}
                      </span>
                      <span className="text-white">
                        ${(item.product.metadata.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  
                  <div className="border-t border-neutral-700 pt-3 space-y-2">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal</span>
                      <span className="text-white">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Tax (8%)</span>
                      <span className="text-white">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Shipping</span>
                      <span className="text-white">
                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="border-t border-neutral-700 pt-3 flex justify-between text-white font-bold text-lg">
                      <span>Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}