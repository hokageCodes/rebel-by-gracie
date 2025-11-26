import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { requireAdmin } from '@/lib/auth';
import { validateData, schemas, sanitize } from '@/lib/validation';
import { asyncHandler, errors, successResponse } from '@/lib/error-handler';
import { rateLimiters } from '@/lib/rate-limiter';
import { deleteImage } from '@/lib/cloudinary';

async function handler(request, { params }) {
  await connectDB();

  const { id } = await params;

  if (request.method === 'GET') {
    const product = await Product.findById(id);
    
    if (!product) {
      throw errors.NOT_FOUND('Product');
    }

    return successResponse(product);
  }

  if (request.method === 'PUT') {
    const requestData = await request.json();
    
    // Get existing product to compare images
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      throw errors.NOT_FOUND('Product');
    }

    // Check if this is a simple featured toggle update
    const isSimpleUpdate = Object.keys(requestData).length === 1 && requestData.hasOwnProperty('isFeatured');
    
    let sanitizedData, validation;
    
    if (isSimpleUpdate) {
      // For simple updates like featured toggle, just update the specific field
      sanitizedData = {
        isFeatured: Boolean(requestData.isFeatured)
      };
      validation = { isValid: true, data: sanitizedData };
    } else {
      // For full updates, validate all fields
      sanitizedData = {
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
      validation = validateData(sanitizedData, schemas.product);
      if (!validation.isValid) {
        throw errors.VALIDATION_ERROR('Product update failed', validation.errors);
      }
    }

    // Check for name conflicts (excluding current product) - only for full updates
    if (!isSimpleUpdate && validation.data.name) {
      const nameConflict = await Product.findOne({ 
        name: validation.data.name, 
        _id: { $ne: id } 
      });
      if (nameConflict) {
        throw errors.ALREADY_EXISTS('Product', 'name');
      }
    }

    // Find images to delete from Cloudinary - only for full updates
    if (!isSimpleUpdate) {
      const existingImageIds = existingProduct.images?.map(img => img.public_id).filter(Boolean) || [];
      const newImageIds = validation.data.images?.map(img => img.public_id).filter(Boolean) || [];
      const imagesToDelete = existingImageIds.filter(id => !newImageIds.includes(id));

      // Delete unused images from Cloudinary
      if (imagesToDelete.length > 0) {
        try {
          await Promise.all(imagesToDelete.map(publicId => deleteImage(publicId)));
        } catch (error) {
          console.error('Error deleting images from Cloudinary:', error);
          // Don't fail the update if image deletion fails
        }
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      validation.data,
      { new: true, runValidators: true }
    );

    return successResponse(product, 'Product updated successfully');
  }

  if (request.method === 'DELETE') {
    const product = await Product.findById(id);
    
    if (!product) {
      throw errors.NOT_FOUND('Product');
    }

    // Delete images from Cloudinary
    const imageIds = product.images?.map(img => img.public_id).filter(Boolean) || [];
    if (imageIds.length > 0) {
      try {
        await Promise.all(imageIds.map(publicId => deleteImage(publicId)));
      } catch (error) {
        console.error('Error deleting images from Cloudinary:', error);
        // Continue with product deletion even if image deletion fails
      }
    }

    await Product.findByIdAndDelete(id);

    return successResponse(null, 'Product deleted successfully');
  }

  throw errors.VALIDATION_ERROR('Method not allowed');
}

export const GET = requireAdmin(asyncHandler(handler));
export const PUT = requireAdmin(rateLimiters.upload(asyncHandler(handler)));
export const DELETE = requireAdmin(rateLimiters.upload(asyncHandler(handler)));
