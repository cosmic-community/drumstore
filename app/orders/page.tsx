'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'

interface Order {
  id: string
  title: string
  metadata: {
    order_number: string
    customer_email: string
    order_date: string
    total: number
    order_status: {
      key: string
      value: string
    }
    payment_status: {
      key: string
      value: string
    }
    order_items: Array<{
      product_name: string
      quantity: number
      price: number
    }>
  }
}

export default function OrdersPage() {
  const [email, setEmail] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSearched(true)

    try {
      const response = await fetch(`/api/orders?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'bg-blue-500/20 text-blue-500 border-blue-500'
      case 'shipped':
        return 'bg-purple-500/20 text-purple-500 border-purple-500'
      case 'delivered':
        return 'bg-green-500/20 text-green-500 border-green-500'
      case 'cancelled':
        return 'bg-red-500/20 text-red-500 border-red-500'
      default:
        return 'bg-neutral-500/20 text-neutral-500 border-neutral-500'
    }
  }

  return (
    <div className="min-h-screen py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Track Your Orders</h1>

          <div className="bg-primary-light rounded-lg p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-neutral-400 mb-2">
                  Enter your email to view your orders
                </label>
                <div className="flex gap-4">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-3 bg-primary border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Searching...' : 'Find Orders'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {searched && (
            <>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">📦</span>
                  <p className="text-neutral-400 mb-2">No orders found for this email</p>
                  <p className="text-neutral-500 text-sm">
                    Make sure you entered the correct email address
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-primary-light rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            Order {order.metadata.order_number}
                          </h3>
                          <p className="text-neutral-400 text-sm">
                            Placed on {new Date(order.metadata.order_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.metadata.order_status.value)}`}>
                            {order.metadata.order_status.value}
                          </span>
                          <p className="text-neutral-400 text-sm mt-2">
                            Payment: {order.metadata.payment_status.value}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-neutral-700 pt-4 space-y-2">
                        {order.metadata.order_items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-neutral-300">
                              {item.product_name} × {item.quantity}
                            </span>
                            <span className="text-white">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        <div className="border-t border-neutral-700 pt-2 flex justify-between font-bold text-white">
                          <span>Total</span>
                          <span>${order.metadata.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/products"
              className="text-accent hover:text-accent/80 transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}