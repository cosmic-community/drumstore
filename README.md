# DrumStore Pro - E-Commerce Drum Shop

![App Preview](https://imgix.cosmicjs.com/7047d0c0-c2b1-11f0-a34a-efbcf979242c-photo-1563330232-57114bb0823c-1763272779469.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A modern, full-featured e-commerce platform for drum enthusiasts. Built with Next.js 16 and powered by Cosmic CMS, this application showcases drum products, collections, and customer reviews with a professional, music-inspired design.

## ✨ Features

- **Product Catalog** - Complete browsing experience for drum kits, cymbals, hardware, and accessories
- **Smart Collections** - Curated product collections like "Beginner Essentials" and "Professional Series"
- **Customer Reviews** - Verified purchase reviews with star ratings and detailed feedback
- **Category Filtering** - Easy navigation by product type
- **Product Details** - Rich product pages with image galleries, specifications, and pricing
- **Responsive Design** - Optimized for all devices from desktop to mobile
- **Stock Management** - Real-time inventory status display
- **Brand Showcase** - Organized by trusted drum brands
- **Search & Discovery** - Multiple ways to find the perfect gear

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](http://localhost:3040/projects/new?clone_bucket=6919677927f095738f112459&clone_repository=691969a327f095738f112474)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Design a content model for an e-commerce drum store with drum products and accessories, collections, and customer reviews"

### Code Generation Prompt

> "Based on the content model I created for "Design a content model for an e-commerce drum store with drum products and accessories, collections, and customer reviews", now build a complete web application that showcases this content. Include a modern, responsive design with proper navigation, content display, and user-friendly interface."

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠️ Technologies Used

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Cosmic CMS** - Headless CMS for content management
- **Cosmic SDK** - Official SDK for API integration
- **React Server Components** - For optimal performance

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun runtime
- A Cosmic account with bucket access
- Git for version control

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd drumstore-pro
```

2. **Install dependencies**
```bash
bun install
```

3. **Configure environment variables**

Create a `.env.local` file in the root directory:

```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. **Run the development server**
```bash
bun run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Cosmic SDK Examples

### Fetching Products

```typescript
import { cosmic } from '@/lib/cosmic'

// Get all products with collections
const { objects: products } = await cosmic.objects
  .find({ type: 'products' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

// Get products by category
const { objects: drumKits } = await cosmic.objects
  .find({ 
    type: 'products',
    'metadata.category.key': 'drum-kits'
  })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

// Get single product with full details
const { object: product } = await cosmic.objects
  .findOne({
    type: 'products',
    slug: 'product-slug'
  })
  .depth(1)
```

### Fetching Collections

```typescript
// Get featured collections
const { objects: collections } = await cosmic.objects
  .find({ 
    type: 'collections',
    'metadata.featured': true
  })
  .props(['id', 'title', 'slug', 'metadata'])

// Get all collections
const { objects: allCollections } = await cosmic.objects
  .find({ type: 'collections' })
  .props(['id', 'title', 'slug', 'metadata'])
```

### Fetching Reviews

```typescript
// Get reviews for a specific product
const { objects: reviews } = await cosmic.objects
  .find({ 
    type: 'reviews',
    'metadata.product': productId
  })
  .props(['id', 'title', 'metadata'])
  .depth(1)

// Get all verified purchase reviews
const { objects: verifiedReviews } = await cosmic.objects
  .find({ 
    type: 'reviews',
    'metadata.verified_purchase': true
  })
  .props(['id', 'title', 'metadata'])
  .depth(1)
```

## 🎨 Cosmic CMS Integration

### Content Types

**Products** (`products`)
- Product Name (text)
- Description (html-textarea)
- Price (number)
- SKU (text)
- Product Images (files)
- Category (select-dropdown: drum-kits, cymbals, hardware, sticks-mallets, accessories)
- Brand (text)
- In Stock (switch)
- Collections (object relationship to collections)
- Specifications (JSON)

**Collections** (`collections`)
- Collection Name (text)
- Description (textarea)
- Collection Image (file)
- Featured (switch)

**Reviews** (`reviews`)
- Product (object relationship to products)
- Reviewer Name (text)
- Rating (select-dropdown: 1-5 stars)
- Review Text (textarea)
- Verified Purchase (switch)
- Review Date (date)

### Adding New Content

1. Log into your Cosmic dashboard
2. Navigate to your bucket
3. Select the appropriate object type
4. Click "Add Object"
5. Fill in the required fields
6. Publish when ready

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Click the deploy button above
2. Connect your GitHub repository
3. Add environment variables:
   - `COSMIC_BUCKET_SLUG`
   - `COSMIC_READ_KEY`
   - `COSMIC_WRITE_KEY`
4. Deploy!

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. Click the deploy button above
2. Connect your repository
3. Add environment variables in Netlify dashboard
4. Deploy!

### Environment Variables

For production deployment, set these environment variables in your hosting platform:

- `COSMIC_BUCKET_SLUG` - Your Cosmic bucket slug
- `COSMIC_READ_KEY` - Your Cosmic read key
- `COSMIC_WRITE_KEY` - Your Cosmic write key (for future admin features)

## 📖 Project Structure

```
drumstore-pro/
├── app/
│   ├── layout.tsx              # Root layout with navigation
│   ├── page.tsx                # Homepage with featured collections
│   ├── products/
│   │   ├── page.tsx            # Product listing page
│   │   └── [slug]/
│   │       └── page.tsx        # Individual product page
│   ├── collections/
│   │   ├── page.tsx            # Collections listing
│   │   └── [slug]/
│   │       └── page.tsx        # Collection detail page
│   └── globals.css             # Global styles
├── components/
│   ├── ProductCard.tsx         # Product display card
│   ├── CollectionCard.tsx      # Collection display card
│   ├── ReviewCard.tsx          # Customer review card
│   ├── Navigation.tsx          # Site navigation
│   ├── Footer.tsx              # Site footer
│   └── CosmicBadge.tsx         # Cosmic branding badge
├── lib/
│   └── cosmic.ts               # Cosmic SDK configuration
├── types.ts                     # TypeScript interfaces
└── public/
    └── dashboard-console-capture.js  # Debug console capture
```

## 🎯 Key Features Explained

### Product Catalog
Browse complete inventory with filtering by category, brand, and collection. Each product displays images, pricing, specifications, and availability status.

### Collections System
Curated product groupings like "Beginner Essentials" and "Professional Series" help customers discover related products and complete their setup.

### Review System
Customer reviews with star ratings, verified purchase badges, and detailed feedback help build trust and inform purchasing decisions.

### Responsive Design
Mobile-first design ensures great experience on phones, tablets, and desktops with touch-friendly interfaces and optimized layouts.

## 🔧 Customization

### Styling
Modify `tailwind.config.js` and `app/globals.css` to customize colors, fonts, and design elements to match your brand.

### Content
All content is managed through Cosmic CMS. Update products, collections, and reviews through the Cosmic dashboard without touching code.

### Features
The modular component structure makes it easy to add new features like wishlist, cart, checkout, or advanced search functionality.

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Support

For support with:
- **Cosmic CMS**: Visit [Cosmic Documentation](https://www.cosmicjs.com/docs)
- **This Application**: Create an issue in the repository

---

Built with 🥁 using [Cosmic](https://www.cosmicjs.com)

<!-- README_END -->