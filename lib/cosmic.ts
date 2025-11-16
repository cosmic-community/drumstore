import { createBucketClient } from '@cosmicjs/sdk'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: 'staging'
})

// Helper function for error handling
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Get all products
export async function getProducts() {
  try {
    const response = await cosmic.objects
      .find({ type: 'products' })
      .props(['id', 'title', 'slug', 'metadata', 'thumbnail'])
      .depth(1)
    
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch products');
  }
}

// Get products by category
export async function getProductsByCategory(category: string) {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'products',
        'metadata.category.key': category
      })
      .props(['id', 'title', 'slug', 'metadata', 'thumbnail'])
      .depth(1)
    
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch products by category');
  }
}

// Get single product
export async function getProduct(slug: string) {
  try {
    const response = await cosmic.objects
      .findOne({
        type: 'products',
        slug
      })
      .depth(1)
    
    return response.object;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch product');
  }
}

// Get all collections
export async function getCollections() {
  try {
    const response = await cosmic.objects
      .find({ type: 'collections' })
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch collections');
  }
}

// Get featured collections
export async function getFeaturedCollections() {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'collections',
        'metadata.featured': true
      })
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch featured collections');
  }
}

// Get single collection
export async function getCollection(slug: string) {
  try {
    const response = await cosmic.objects
      .findOne({
        type: 'collections',
        slug
      })
    
    return response.object;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch collection');
  }
}

// Get reviews for a product
export async function getProductReviews(productId: string) {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'reviews',
        'metadata.product': productId
      })
      .props(['id', 'title', 'metadata'])
      .depth(1)
    
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch reviews');
  }
}

// Get all reviews
export async function getAllReviews() {
  try {
    const response = await cosmic.objects
      .find({ type: 'reviews' })
      .props(['id', 'title', 'metadata'])
      .depth(1)
    
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch reviews');
  }
}

// Create order
export async function createOrder(orderData: any) {
  try {
    // Changed: Enhanced error logging for debugging
    console.log('Creating order with data:', JSON.stringify(orderData, null, 2))
    
    const response = await cosmic.objects.insertOne({
      title: `Order ${orderData.order_number}`,
      type: 'orders',
      metadata: orderData
    })
    
    console.log('Order created successfully:', response.object.id)
    return response.object;
  } catch (error: any) {
    // Changed: Enhanced error logging with more details
    console.error('Failed to create order in Cosmic:', error)
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      response: error.response?.data
    })
    throw new Error(`Failed to create order: ${error.message}`)
  }
}

// Get order by ID
export async function getOrder(orderId: string) {
  try {
    const response = await cosmic.objects
      .findOne({
        type: 'orders',
        id: orderId
      })
    
    return response.object;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch order');
  }
}

// Get orders by email
export async function getOrdersByEmail(email: string) {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'orders',
        'metadata.customer_email': email
      })
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch orders');
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string, paymentStatus?: string) {
  try {
    // Changed: Update to use proper select-dropdown structure
    const updateData: any = {
      metadata: {
        order_status: {
          key: status.toLowerCase().replace(' ', '-'),
          value: status
        }
      }
    }
    
    if (paymentStatus) {
      updateData.metadata.payment_status = {
        key: paymentStatus.toLowerCase(),
        value: paymentStatus
      }
    }
    
    const response = await cosmic.objects.updateOne(orderId, updateData)
    
    return response.object;
  } catch (error) {
    throw new Error('Failed to update order status');
  }
}