import Link from 'next/link'
import { getFeaturedCollections, getProducts } from '@/lib/cosmic'
import CollectionCard from '@/components/CollectionCard'
import ProductCard from '@/components/ProductCard'
import { Product, Collection } from '@/types'

export const revalidate = 60

export default async function HomePage() {
  const [featuredCollections, products] = await Promise.all([
    getFeaturedCollections(),
    getProducts()
  ])
  
  const featuredProducts = (products as Product[]).slice(0, 6)
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-light to-primary-dark py-20 md:py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=2000&auto=format,compress&fit=crop"
            alt="Drum kit background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-light/85 to-primary-dark/90"></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Find Your Perfect
              <span className="block text-accent">Drum Setup</span>
            </h1>
            <p className="text-xl text-neutral-300 mb-8">
              Premium drums, cymbals, and accessories for drummers of all levels. From beginner essentials to professional gear.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="btn-primary">
                Shop All Products
              </Link>
              <Link href="/collections" className="btn-secondary">
                Browse Collections
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      {featuredCollections.length > 0 && (
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="section-title mb-0">Featured Collections</h2>
              <Link 
                href="/collections" 
                className="text-accent hover:text-accent-light transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(featuredCollections as Collection[]).map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-primary-dark">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="section-title mb-0">Featured Products</h2>
              <Link 
                href="/products" 
                className="text-accent hover:text-accent-light transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'Drum Kits', key: 'drum-kits', emoji: '🥁' },
              { name: 'Cymbals', key: 'cymbals', emoji: '🎵' },
              { name: 'Hardware', key: 'hardware', emoji: '🔧' },
              { name: 'Sticks & Mallets', key: 'sticks-mallets', emoji: '🥢' },
              { name: 'Accessories', key: 'accessories', emoji: '📦' },
            ].map((category) => (
              <Link
                key={category.key}
                href={`/products?category=${category.key}`}
                className="card p-6 text-center hover:border-accent transition-colors"
              >
                <div className="text-4xl mb-3">{category.emoji}</div>
                <h3 className="font-semibold text-white">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-accent to-accent-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Upgrade Your Setup?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Browse our complete catalog of drums, cymbals, and accessories. Free shipping on orders over $99.
          </p>
          <Link href="/products" className="btn-primary bg-white text-accent hover:bg-neutral-100">
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  )
}