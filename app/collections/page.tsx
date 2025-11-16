import { getCollections } from '@/lib/cosmic'
import CollectionCard from '@/components/CollectionCard'
import { Collection } from '@/types'

export const revalidate = 60

export default async function CollectionsPage() {
  const collections = await getCollections()
  
  return (
    <div className="min-h-screen py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="section-title">All Collections</h1>
          <p className="text-neutral-300 text-lg">
            Curated product collections for every drummer
          </p>
        </div>

        {collections.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-400 text-xl">No collections available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(collections as Collection[]).map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}