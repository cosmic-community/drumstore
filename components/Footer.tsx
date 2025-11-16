import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-primary-dark border-t border-neutral-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🥁</span>
              <span className="text-xl font-bold text-white">DrumStore Pro</span>
            </div>
            <p className="text-neutral-400 text-sm">
              Your trusted source for premium drums, cymbals, and percussion accessories.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/products?category=drum-kits" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Drum Kits
                </Link>
              </li>
              <li>
                <Link href="/products?category=cymbals" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Cymbals
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  YouTube
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-8 text-center text-neutral-400 text-sm">
          <p>&copy; {new Date().getFullYear()} DrumStore Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}