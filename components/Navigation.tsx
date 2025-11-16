import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="bg-primary-dark border-b border-neutral-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🥁</span>
            <span className="text-xl font-bold text-white">DrumStore Pro</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              href="/products" 
              className="text-neutral-300 hover:text-white transition-colors"
            >
              Products
            </Link>
            <Link 
              href="/collections" 
              className="text-neutral-300 hover:text-white transition-colors"
            >
              Collections
            </Link>
            <Link 
              href="/contact" 
              className="text-neutral-300 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}