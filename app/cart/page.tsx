'use client'

import { useCartStore } from '@/lib/cart-store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, getCartTotal, clearCart } = useCartStore()
  const total = getCartTotal()
  const tax = total * 0.08 // 8% tax
  const shipping = total > 100 ? 0 : 15 // Free shipping over $100
  const finalTotal = total + tax + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-6xl mb-4 block">🛒</span>
            <h1 className="text-3xl font-bold text-white mb-4">Your cart is empty</h1>
            <p className="text-neutral-400 mb-8">
              Add some amazing drum gear to get started!
            </p>
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

  return (
    <div className="min-h-screen py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
            <button
              onClick={clearCart}
              className="text-neutral-400 hover:text-accent transition-colors text-sm"
            >
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const imageUrl = item.product.metadata.product_images?.[0]?.imgix_url || item.product.thumbnail
                
                return (
                  <div key={item.product.id} className="bg-primary-light rounded-lg p-4 flex gap-4">
                    <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
                      {imageUrl ? (
                        <img
                          src={`${imageUrl}?w=240&h=240&fit=crop&auto=format,compress`}
                          alt={item.product.title}
                          className="w-24 h-24 object-cover rounded-lg"
                          width={96}
                          height={96}
                        />
                      ) : (
                        <div className="w-24 h-24 bg-neutral-800 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🥁</span>
                        </div>
                      )}
                    </Link>

                    <div className="flex-1">
                      <Link 
                        href={`/products/${item.product.slug}`}
                        className="text-white font-semibold hover:text-accent transition-colors"
                      >
                        {item.product.metadata.product_name}
                      </Link>
                      {item.product.metadata.brand && (
                        <p className="text-neutral-400 text-sm mt-1">
                          by {item.product.metadata.brand}
                        </p>
                      )}
                      <p className="text-accent font-bold mt-2">
                        ${item.product.metadata.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        ✕
                      </button>

                      <div className="flex items-center border border-neutral-700 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-3 py-1 text-white hover:bg-neutral-800 transition-colors text-sm"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 text-white font-semibold border-x border-neutral-700 text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-3 py-1 text-white hover:bg-neutral-800 transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-white font-bold">
                        ${(item.product.metadata.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-primary-light rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
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
                  {total < 100 && shipping > 0 && (
                    <p className="text-accent text-sm">
                      Add ${(100 - total).toFixed(2)} more for free shipping!
                    </p>
                  )}
                  <div className="border-t border-neutral-700 pt-3 flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full px-8 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-semibold transition-colors"
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/products"
                  className="block text-center text-neutral-400 hover:text-accent transition-colors mt-4 text-sm"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}