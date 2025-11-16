// app/collections/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCollection, getProducts } from '@/lib/cosmic'
import { Collection, Product } from '@/types'
import ProductCard from '@/components/ProductCard'

export const revalidate = 60

interface CollectionPageProps {
  params: Promise<{ slug: string }>
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params
  const collection = await getCollection(slug)
  
  if (!collection) {
    notFound()
  }
  
  const typedCollection = collection as Collection
  const allProducts = await getProducts()
  
  const collectionProducts = (allProducts as Product[]).filter(product =>
    product.metadata.collections?.some(c => c.id === typedCollection.id)
  )
  
  return (
    <div className="min-h-screen py-16 bg-primary">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-neutral-400">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-accent">Collections</Link>
          <span>/</span>
          <span className="text-white">{typedCollection.title}</span>
        </div>

        {/* Collection Header */}
        <div className="mb-12">
          {typedCollection.metadata.collection_image && (
            <div className="mb-8 rounded-xl overflow-hidden h-64 bg-primary-light">
              <img
                src={`${typedCollection.metadata.collection_image.imgix_url}?w=2400&h=600&fit=crop&auto=format,compress`}
                alt={typedCollection.title}
                className="w-full h-full object-cover"
                width={1200}
                height={300}
              />
            </div>
          )}
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {typedCollection.metadata.collection_name}
              </h1>
              {typedCollection.metadata.description && (
                <p className="text-neutral-300 text-lg max-w-2xl">
                  {typedCollection.metadata.description}
                </p>
              )}
            </div>
            {typedCollection.metadata.featured && (
              <span className="badge bg-accent/20 text-accent border border-accent/30">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Products in Collection */}
        {collectionProducts.length === 0 ? (
          <div className="text-center py-20 bg-primary-light rounded-xl">
            <p className="text-neutral-400 text-xl">No products in this collection yet.</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">
                Products in this Collection ({collectionProducts.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {collectionProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}

        <div className="mt-12 text-center">
          <Link 
            href="/collections"
            className="text-accent hover:text-accent-light transition-colors"
          >
            ← Back to Collections
          </Link>
        </div>
      </div>
    </div>
  )
}