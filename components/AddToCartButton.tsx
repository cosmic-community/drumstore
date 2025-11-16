'use client'

import { useState } from 'react'
import { Product } from '@/types'
import { useCartStore } from '@/lib/cart-store'

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    if (!product.metadata.in_stock) return
    
    addItem(product, quantity)
    setShowSuccess(true)
    
    setTimeout(() => {
      setShowSuccess(false)
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-neutral-700 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 text-white hover:bg-neutral-800 transition-colors"
            disabled={!product.metadata.in_stock}
          >
            -
          </button>
          <span className="px-6 py-2 text-white font-semibold border-x border-neutral-700">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-2 text-white hover:bg-neutral-800 transition-colors"
            disabled={!product.metadata.in_stock}
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.metadata.in_stock}
          className={`flex-1 px-8 py-3 rounded-lg font-semibold transition-colors ${
            product.metadata.in_stock
              ? 'bg-accent hover:bg-accent/90 text-white'
              : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
          }`}
        >
          {product.metadata.in_stock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>

      {showSuccess && (
        <div className="bg-green-500/20 border border-green-500 text-green-500 px-4 py-3 rounded-lg text-center">
          ✓ Added to cart!
        </div>
      )}
    </div>
  )
}