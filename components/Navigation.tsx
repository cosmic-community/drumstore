'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/cart-store'

export default function Navigation() {
  const cartCount = useCartStore((state) => state.getCartCount())

  return (
    <nav className="bg-primary-dark border-b border-neutral-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🥁</span>
            <span className="text-xl font-bold text-white">DrumStore Pro</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              href="/products" 
              className="text-neutral-300 hover:text-white transition-colors"
            >
              Products
            </Link>
            <Link 
              href="/collections" 
              className="text-neutral-300 hover:text-white transition-colors"
            >
              Collections
            </Link>
            <Link 
              href="/contact" 
              className="text-neutral-300 hover:text-white transition-colors"
            >
              Contact
            </Link>
            <Link 
              href="/orders" 
              className="text-neutral-300 hover:text-white transition-colors"
            >
              Orders
            </Link>
            <Link 
              href="/cart" 
              className="relative text-neutral-300 hover:text-white transition-colors"
            >
              <span className="text-2xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}