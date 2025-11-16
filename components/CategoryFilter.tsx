'use client'

import Link from 'next/link'

interface CategoryFilterProps {
  currentCategory?: string
}

const categories = [
  { key: '', label: 'All Products' },
  { key: 'drum-kits', label: 'Drum Kits' },
  { key: 'cymbals', label: 'Cymbals' },
  { key: 'hardware', label: 'Hardware' },
  { key: 'sticks-mallets', label: 'Sticks & Mallets' },
  { key: 'accessories', label: 'Accessories' },
]

export default function CategoryFilter({ currentCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = currentCategory === category.key || (!currentCategory && category.key === '')
        
        return (
          <Link
            key={category.key}
            href={category.key ? `/products?category=${category.key}` : '/products'}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isActive
                ? 'bg-accent text-white'
                : 'bg-primary-light text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            {category.label}
          </Link>
        )
      })}
    </div>
  )
}