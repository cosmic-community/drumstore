// app/products/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getProduct, getProductReviews } from '@/lib/cosmic'
import { Product, Review } from '@/types'
import ReviewCard from '@/components/ReviewCard'
import Link from 'next/link'

export const revalidate = 60

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)
  
  if (!product) {
    notFound()
  }
  
  const typedProduct = product as Product
  const reviews = await getProductReviews(typedProduct.id)
  
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc: number, review: Review) => {
        const rating = parseInt((review as Review).metadata.rating.key)
        return acc + rating
      }, 0) / reviews.length
    : 0
  
  return (
    <div className="min-h-screen py-16 bg-primary">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-neutral-400">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-accent">Products</Link>
          <span>/</span>
          <span className="text-white">{typedProduct.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <div className="bg-primary-light rounded-xl overflow-hidden mb-4">
              {typedProduct.metadata.product_images && typedProduct.metadata.product_images[0] ? (
                <img
                  src={`${typedProduct.metadata.product_images[0].imgix_url}?w=1200&h=800&fit=crop&auto=format,compress`}
                  alt={typedProduct.title}
                  className="w-full h-auto"
                  width={600}
                  height={400}
                />
              ) : typedProduct.thumbnail ? (
                <img
                  src={`${typedProduct.thumbnail}?w=1200&h=800&fit=crop&auto=format,compress`}
                  alt={typedProduct.title}
                  className="w-full h-auto"
                  width={600}
                  height={400}
                />
              ) : (
                <div className="w-full h-96 bg-neutral-800 flex items-center justify-center">
                  <span className="text-4xl">🥁</span>
                </div>
              )}
            </div>
            
            {typedProduct.metadata.product_images && typedProduct.metadata.product_images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {typedProduct.metadata.product_images.slice(1).map((image, index) => (
                  <div key={index} className="bg-primary-light rounded-lg overflow-hidden">
                    <img
                      src={`${image.imgix_url}?w=400&h=400&fit=crop&auto=format,compress`}
                      alt={`${typedProduct.title} - ${index + 2}`}
                      className="w-full h-auto"
                      width={200}
                      height={200}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-4">
              {typedProduct.metadata.category && (
                <Link 
                  href={`/products?category=${typedProduct.metadata.category.key}`}
                  className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-semibold mb-3"
                >
                  {typedProduct.metadata.category.value}
                </Link>
              )}
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">
              {typedProduct.metadata.product_name}
            </h1>

            {typedProduct.metadata.brand && (
              <p className="text-neutral-300 mb-4">
                by <span className="font-semibold">{typedProduct.metadata.brand}</span>
              </p>
            )}

            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-current' : 'fill-neutral-700'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-neutral-400">
                  {averageRating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>
            )}

            <div className="mb-6">
              <span className="text-5xl font-bold text-white">
                ${typedProduct.metadata.price.toFixed(2)}
              </span>
            </div>

            <div className="mb-8">
              {typedProduct.metadata.in_stock ? (
                <span className="badge-success">In Stock</span>
              ) : (
                <span className="badge-warning">Out of Stock</span>
              )}
              {typedProduct.metadata.sku && (
                <span className="ml-3 text-neutral-400 text-sm">
                  SKU: {typedProduct.metadata.sku}
                </span>
              )}
            </div>

            {typedProduct.metadata.description && (
              <div 
                className="prose prose-invert max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: typedProduct.metadata.description }}
              />
            )}

            {typedProduct.metadata.specifications && Object.keys(typedProduct.metadata.specifications).length > 0 && (
              <div className="bg-primary-light rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Specifications</h3>
                <dl className="space-y-2">
                  {Object.entries(typedProduct.metadata.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-neutral-800 pb-2">
                      <dt className="text-neutral-400 capitalize">
                        {key.replace(/_/g, ' ')}
                      </dt>
                      <dd className="text-white font-semibold">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {typedProduct.metadata.collections && typedProduct.metadata.collections.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-3">Part of Collections</h3>
                <div className="flex flex-wrap gap-2">
                  {typedProduct.metadata.collections.map((collection) => (
                    <Link
                      key={collection.id}
                      href={`/collections/${collection.slug}`}
                      className="px-4 py-2 bg-primary-light hover:bg-neutral-800 text-white rounded-lg transition-colors border border-neutral-700"
                    >
                      {collection.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="border-t border-neutral-800 pt-12">
            <h2 className="text-3xl font-bold text-white mb-8">
              Customer Reviews ({reviews.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(reviews as Review[]).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}