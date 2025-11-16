'use client'

import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'

interface ProductsSearchProps {
  products: Product[]
}

export default function ProductsSearch({ products }: ProductsSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [inStockOnly, setInStockOnly] = useState(false)

  // Extract unique categories and brands from products
  const categories = useMemo(() => {
    const cats = new Set<string>()
    products.forEach(p => {
      if (p.metadata?.category?.key) {
        cats.add(p.metadata.category.key)
      }
    })
    return Array.from(cats).sort()
  }, [products])

  const brands = useMemo(() => {
    const brandsSet = new Set<string>()
    products.forEach(p => {
      if (p.metadata?.brand) {
        brandsSet.add(p.metadata.brand)
      }
    })
    return Array.from(brandsSet).sort()
  }, [products])

  // Get price range from products
  const productPriceRange = useMemo(() => {
    if (products.length === 0) return [0, 2000]
    const prices = products.map(p => p.metadata?.price || 0)
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]
  }, [products])

  // Filter products based on all criteria
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const searchFields = [
          product.title,
          product.metadata?.product_name,
          product.metadata?.brand,
          product.metadata?.category?.value,
          product.metadata?.description
        ].filter(Boolean).join(' ').toLowerCase()
        
        if (!searchFields.includes(query)) {
          return false
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && product.metadata?.category?.key !== selectedCategory) {
        return false
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.metadata?.brand || '')) {
        return false
      }

      // Price range filter
      const price = product.metadata?.price || 0
      if (price < priceRange[0] || price > priceRange[1]) {
        return false
      }

      // In stock filter
      if (inStockOnly && !product.metadata?.in_stock) {
        return false
      }

      return true
    })
  }, [products, searchQuery, selectedCategory, selectedBrands, priceRange, inStockOnly])

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedBrands([])
    setPriceRange(productPriceRange as [number, number])
    setInStockOnly(false)
  }

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedBrands.length > 0 || 
    priceRange[0] !== productPriceRange[0] || priceRange[1] !== productPriceRange[1] || inStockOnly

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          placeholder="Search products by name, brand, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-primary-light border border-neutral-800 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-accent transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-primary-light border border-neutral-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-accent hover:text-accent-light transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-white mb-3">Category</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-accent text-white'
                      : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  All Products
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-accent text-white'
                        : 'text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    {category.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            {brands.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-white mb-3">Brand</h4>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label
                      key={brand}
                      className="flex items-center space-x-2 text-neutral-300 hover:text-white cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-accent focus:ring-accent focus:ring-offset-0"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-white mb-3">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Min Price</label>
                  <input
                    type="range"
                    min={productPriceRange[0]}
                    max={productPriceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full accent-accent"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Max Price</label>
                  <input
                    type="range"
                    min={productPriceRange[0]}
                    max={productPriceRange[1]}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-accent"
                  />
                </div>
              </div>
            </div>

            {/* In Stock Filter */}
            <div>
              <label className="flex items-center space-x-2 text-neutral-300 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-accent focus:ring-accent focus:ring-offset-0"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-neutral-400">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-400 text-xl mb-4">No products found</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}