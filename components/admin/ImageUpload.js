'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';

export default function ImageUpload({ 
  currentImageUrl, 
  onImageUploaded, 
  folder = 'rebelbygrace/content',
  placeholder = 'Upload image...',
  aspectRatio = 'aspect-square',
  uniqueId = 'image-upload'
}) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    setUploading(true);
    
    try {
      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onImageUploaded(result.url);
        toast.success('Image uploaded successfully!');
        
        // Clean up preview URL
        URL.revokeObjectURL(preview);
        setPreviewUrl(null);
      } else {
        toast.error(result.error || 'Failed to upload image');
        URL.revokeObjectURL(preview);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading image');
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const displayUrl = previewUrl || currentImageUrl;

  return (
    <div className="space-y-3">
      {/* Upload Button */}
      <div className="flex items-center space-x-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id={uniqueId}
        />
        <label
          htmlFor={uniqueId}
          className={`flex-1 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                <span className="text-sm text-gray-600">Uploading...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm text-gray-600">{placeholder}</span>
              </>
            )}
          </div>
        </label>
      </div>

      {/* Current/Preview Image */}
      {displayUrl && (
        <div className={`relative ${aspectRatio} rounded-lg overflow-hidden border border-gray-200 bg-gray-100`}>
          <Image
            src={displayUrl}
            alt="Uploaded image"
            fill
            className="object-cover"
            unoptimized={previewUrl ? true : false}
            onError={(e) => {
              console.error('Failed to load image:', displayUrl);
              toast.error('Failed to load image');
              e.target.style.display = 'none';
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', displayUrl);
            }}
          />
          {previewUrl && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
                <span className="text-white text-sm font-medium">Uploading...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Current Image URL (for reference) */}
      {currentImageUrl && !previewUrl && (
        <div className="text-xs text-gray-500 break-all">
          <strong>Current:</strong> {currentImageUrl}
        </div>
      )}
    </div>
  );
}
