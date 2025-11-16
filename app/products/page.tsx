import { getProducts } from '@/lib/cosmic'
import ProductCard from '@/components/ProductCard'
import CategoryFilter from '@/components/CategoryFilter'
import { Product } from '@/types'

export const revalidate = 60

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const category = params.category
  
  const allProducts = await getProducts()
  
  const products = category
    ? (allProducts as Product[]).filter(
        (p) => p.metadata?.category?.key === category
      )
    : allProducts
  
  return (
    <div className="min-h-screen py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="section-title">All Products</h1>
          <p className="text-neutral-300 text-lg">
            Browse our complete selection of drums, cymbals, and accessories
          </p>
        </div>

        <div className="mb-8">
          <CategoryFilter currentCategory={category} />
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-400 text-xl">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(products as Product[]).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-neutral-400">
            Showing {products.length} of {allProducts.length} products
          </p>
        </div>
      </div>
    </div>
  )
}