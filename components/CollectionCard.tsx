import Link from 'next/link'
import { Collection } from '@/types'

interface CollectionCardProps {
  collection: Collection
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link href={`/collections/${collection.slug}`} className="card group">
      <div className="aspect-video bg-neutral-800 overflow-hidden">
        {collection.metadata.collection_image ? (
          <img
            src={`${collection.metadata.collection_image.imgix_url}?w=1200&h=675&fit=crop&auto=format,compress`}
            alt={collection.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            width={600}
            height={338}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">📦</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-2xl font-bold text-white">
            {collection.metadata.collection_name}
          </h3>
          {collection.metadata.featured && (
            <span className="badge bg-accent/20 text-accent border border-accent/30">
              Featured
            </span>
          )}
        </div>
        
        {collection.metadata.description && (
          <p className="text-neutral-400 line-clamp-2">
            {collection.metadata.description}
          </p>
        )}
      </div>
    </Link>
  )
}