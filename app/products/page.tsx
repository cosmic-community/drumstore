import ProductsSearch from '@/components/ProductsSearch'
import { getProducts } from '@/lib/cosmic'

export const revalidate = 60

export default async function ProductsPage() {
  const products = await getProducts()
  
  return (
    <div className="min-h-screen py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="section-title">All Products</h1>
          <p className="text-neutral-300 text-lg">
            Browse our complete selection of drums, cymbals, and accessories
          </p>
        </div>

        <ProductsSearch products={products} />
      </div>
    </div>
  )
}