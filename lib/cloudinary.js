import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

// Validate configuration
if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
  console.warn('⚠️  Cloudinary credentials are missing. Image uploads will fail.');
  console.warn('Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file');
}

cloudinary.config(cloudinaryConfig);

// Upload image to Cloudinary
export const uploadImage = async (file, folder = 'rebelbygrace/products') => {
  try {
    // Convert file to buffer if it's a File object
    let fileBuffer;
    let fileName = 'product-image';
    
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      fileName = file.name;
    } else if (Buffer.isBuffer(file)) {
      fileBuffer = file;
    } else {
      throw new Error('Invalid file format');
    }

    // Generate unique public_id with timestamp
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const sanitizedFileName = fileName.replace(/\.[^/.]+$/, '').replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const publicId = `${sanitizedFileName}-${timestamp}-${randomString}`;

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { quality: 'auto' },
            { fetch_format: 'auto' },
            { width: 1200, height: 1200, crop: 'limit' }
          ],
          public_id: publicId,
          overwrite: false, // Don't overwrite existing images
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload stream error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(fileBuffer);
    });

    if (!result || !result.secure_url) {
      throw new Error('Upload failed: No URL returned from Cloudinary');
    }

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload image to Cloudinary',
    };
  }
};

// Delete image from Cloudinary
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Generate optimized image URL
export const getOptimizedImageUrl = (publicId, options = {}) => {
  const {
    width = 800,
    height = 800,
    crop = 'limit',
    quality = 'auto',
    format = 'auto'
  } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    format,
    secure: true,
  });
};

// Batch upload multiple images
export const uploadMultipleImages = async (files, folder = 'rebelbygrace/products') => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    
    return {
      success: true,
      images: results.filter(result => result.success),
      errors: results.filter(result => !result.success),
    };
  } catch (error) {
    console.error('Batch upload error:', error);
    return {
      success: false,
      error: error.message,
      images: [],
      errors: [],
    };
  }
};

export default cloudinary;
