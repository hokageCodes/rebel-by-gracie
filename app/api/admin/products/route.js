import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { requireAdmin } from '@/lib/auth';
import { validateData, schemas, sanitize } from '@/lib/validation';
import { asyncHandler, errors, successResponse, paginatedResponse } from '@/lib/error-handler';
import { rateLimiters } from '@/lib/rate-limiter';
import { queryOptimizers } from '@/lib/database-optimization';

async function handler(request) {
  await connectDB();

  if (request.method === 'GET') {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    
    // Extract filters
    const filters = {
      search: searchParams.get('search'),
      category: searchParams.get('category'),
      collection: searchParams.get('collection'),
      priceRange: searchParams.get('priceRange'),
      isActive: searchParams.get('isActive'),
      isFeatured: searchParams.get('isFeatured'),
    };

    // Use query optimizer
    const { query, sort } = queryOptimizers.getProducts(filters);
    
    // For admin, we want to see all products (not just active ones)
    if (query.isActive) {
      delete query.isActive; // Remove the isActive filter for admin
    }

    console.log('Admin products query:', query);
    console.log('Admin products sort:', sort);

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);
    
    console.log('Found products:', products.length);
    console.log('Total products:', total);

    return paginatedResponse(products, { page, limit, total });
  }

  if (request.method === 'POST') {
    const requestData = await request.json();
    console.log('Received product data:', JSON.stringify(requestData, null, 2));
    
    // Sanitize input
    const sanitizedData = {
      name: sanitize.string(requestData.name),
      description: sanitize.html(requestData.description),
      shortDescription: sanitize.string(requestData.shortDescription),
      price: requestData.price,
      originalPrice: requestData.originalPrice,
      category: sanitize.string(requestData.category),
      productCollection: sanitize.string(requestData.productCollection),
      inventory: requestData.inventory,
      isActive: requestData.isActive,
      isFeatured: requestData.isFeatured,
      tags: requestData.tags ? requestData.tags.map(tag => sanitize.string(tag)) : [],
      weight: requestData.weight,
      dimensions: requestData.dimensions,
      seo: requestData.seo,
      images: requestData.images,
      variants: requestData.variants,
    };

    // Validate input
    const validation = validateData(sanitizedData, schemas.product);
    if (!validation.isValid) {
      console.error('Product validation errors:', validation.errors);
      throw errors.VALIDATION_ERROR('Product creation failed', validation.errors);
    }

    // Check if product with same name already exists
    const existingProduct = await Product.findOne({ name: validation.data.name });
    if (existingProduct) {
      throw errors.ALREADY_EXISTS('Product', 'name');
    }

    const product = new Product(validation.data);
    await product.save();

    return successResponse(product, 'Product created successfully', 201);
  }

  throw errors.VALIDATION_ERROR('Method not allowed');
}

export const GET = requireAdmin(asyncHandler(handler));
export const POST = requireAdmin(rateLimiters.upload(asyncHandler(handler)));
