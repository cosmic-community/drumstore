import Link from 'next/link'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.metadata.product_images?.[0]?.imgix_url || product.thumbnail
  
  return (
    <Link href={`/products/${product.slug}`} className="card group">
      <div className="aspect-square bg-neutral-800 overflow-hidden">
        {imageUrl ? (
          <img
            src={`${imageUrl}?w=800&h=800&fit=crop&auto=format,compress`}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            width={400}
            height={400}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">🥁</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        {product.metadata.category && (
          <span className="inline-block px-2 py-1 text-xs font-semibold text-accent bg-accent/10 rounded mb-2">
            {product.metadata.category.value}
          </span>
        )}
        
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {product.metadata.product_name}
        </h3>
        
        {product.metadata.brand && (
          <p className="text-sm text-neutral-400 mb-2">
            {product.metadata.brand}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">
            ${product.metadata.price.toFixed(2)}
          </span>
          
          {product.metadata.in_stock ? (
            <span className="text-xs font-semibold text-green-400">In Stock</span>
          ) : (
            <span className="text-xs font-semibold text-yellow-400">Out of Stock</span>
          )}
        </div>
      </div>
    </Link>
  )
}