import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';

// GET all products (admin view - includes inactive products)
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const category = searchParams.get('category');
    const collection = searchParams.get('collection');
    const search = searchParams.get('search');
    const isActive = searchParams.get('isActive');
    const isFeatured = searchParams.get('isFeatured');
    const priceRange = searchParams.get('priceRange');

    // Build query (admin sees all products)
    const query = {};

    if (category) {
      query.category = category;
    }

    if (collection) {
      query.productCollection = collection;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Default to active products only for public users (unless explicitly requested)
    if (isActive !== null && isActive !== '') {
      query.isActive = isActive === 'true';
    } else {
      // Default to active products for public access
      query.isActive = true;
    }

    if (isFeatured !== null && isFeatured !== '') {
      query.isFeatured = isFeatured === 'true';
    }

    if (priceRange) {
      if (priceRange === '100000+') {
        query.price = { $gte: 100000 };
      } else {
        const [min, max] = priceRange.split('-').map(Number);
        query.price = { $gte: min, $lte: max };
      }
    }

    // Handle sorting
    const sort = searchParams.get('sort');
    let sortOption = { createdAt: -1 }; // Default sort
    
    if (sort) {
      switch (sort) {
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'oldest':
          sortOption = { createdAt: 1 };
          break;
        case 'price-low':
          sortOption = { price: 1 };
          break;
        case 'price-high':
          sortOption = { price: -1 };
          break;
        case 'name-asc':
          sortOption = { name: 1 };
          break;
        case 'name-desc':
          sortOption = { name: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    }

    // Execute query
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    
    console.log('Received product data:', body);

    // Validate required fields before creating
    if (!body.name) {
      return NextResponse.json({
        error: true,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: { name: 'Product name is required' }
      }, { status: 400 });
    }

    if (!body.slug) {
      return NextResponse.json({
        error: true,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: { slug: 'Product slug is required' }
      }, { status: 400 });
    }

    // Check for duplicate slug
    const existingProduct = await Product.findOne({ slug: body.slug });
    if (existingProduct) {
      return NextResponse.json({
        error: true,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: { slug: 'A product with this slug already exists' }
      }, { status: 400 });
    }

    // Create the product
    const product = await Product.create(body);

    console.log('Product created successfully:', product._id);

    return NextResponse.json({
      success: true,
      product,
      message: 'Product created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Product creation error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const details = {};
      Object.keys(error.errors).forEach(key => {
        details[key] = error.errors[key].message;
      });

      return NextResponse.json({
        error: true,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details
      }, { status: 400 });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({
        error: true,
        message: 'Duplicate entry',
        code: 'DUPLICATE_ERROR',
        details: { [field]: `This ${field} already exists` }
      }, { status: 400 });
    }

    // Generic error
    return NextResponse.json({
      error: true,
      message: error.message || 'Failed to create product',
      code: 'SERVER_ERROR'
    }, { status: 500 });
  }
}