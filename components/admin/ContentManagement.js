'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import ImageUpload from './ImageUpload';
import { generateProductLink } from '../../lib/utils/slugify';

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeSection, setActiveSection] = useState('hero');
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch content on component mount
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/content');
      const data = await response.json();

      if (data.success) {
        // Convert array to object for easier access
        const contentObj = {};
        if (data.contents && Array.isArray(data.contents)) {
          data.contents.forEach(item => {
            contentObj[item.page] = item;
          });
        }
        setContent(contentObj);
      } else {
        // If no content exists yet, that&apos;s expected - don&apos;t show error
        if (response.status === 404) {
          console.log('No content found - will use default values');
        } else {
          toast.error('Failed to fetch content');
        }
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      // Only show error for unexpected errors, not network issues
      if (error.name !== 'TypeError') {
        toast.error('Error fetching content');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (page, field, value) => {
    setContent((prev) => ({
      ...prev,
      [page]: {
        ...prev[page],
        [field]: value,
      },
    }));
  };

  const handleSectionChange = (section, fieldPath, value) => {
    setContent((prev) => {
      const newContent = { ...prev };
      const page = newContent['home'] || {};
      const sections = page.sections || {};
      const targetSection = sections[section] || {};
      
      const pathParts = fieldPath.split('.');
      let current = targetSection;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) {
          current[pathParts[i]] = {};
        }
        current = current[pathParts[i]];
      }
      
      current[pathParts[pathParts.length - 1]] = value;
      
      return {
        ...newContent,
        home: {
          ...page,
          sections: {
            ...sections,
            [section]: targetSection,
          },
        },
      };
    });
  };

  const handleSave = async (page) => {
    setSaving(true);
    try {
      const pageContent = content[page];
      if (!pageContent) {
        toast.error('No content found for this page');
        return;
      }

      const response = await fetch(`/api/admin/content/${page}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageContent),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`${page.toUpperCase()} content saved successfully!`);
      } else {
        toast.error(data.error || 'Failed to save content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Error saving content');
    } finally {
      setSaving(false);
    }
  };

  const handleSeedContent = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/content/seed', {
        method: 'POST',
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Content seeded successfully!');
        // Refresh content
        await fetchContent();
      } else {
        toast.error(data.error || 'Failed to seed content');
      }
    } catch (error) {
      console.error('Error seeding content:', error);
      toast.error('Error seeding content');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'home', name: 'Homepage', icon: '🏠' },
    { id: 'about', name: 'About Page', icon: '📖' },
    { id: 'contact', name: 'Contact Page', icon: '📞' },
  ];

  const homeSections = [
    { id: 'hero', name: 'Hero Section', icon: '🎯', description: 'Main banner with images and CTA' },
    { id: 'newRelease', name: 'New Releases', icon: '🆕', description: 'Featured products carousel' },
    { id: 'featured', name: 'Featured Product', icon: '⭐', description: 'Highlight a specific product' },
    { id: 'collections', name: 'Collections', icon: '📚', description: 'Product collections showcase' },
    { id: 'faq', name: 'FAQ Section', icon: '❓', description: 'Frequently asked questions' },
    { id: 'newsletter', name: 'Newsletter', icon: '📧', description: 'Email subscription signup' },
  ];

  const renderNewReleaseSection = (page) => {
    const section = page.sections?.newRelease || {};
    
        return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">New Release Section</h3>
            <p className="text-sm text-gray-600">Manage the featured products carousel</p>
          </div>
          <div className="flex items-center space-x-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={section.isActive !== false}
                onChange={(e) => handleSectionChange('newRelease', 'isActive', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Show Section</span>
            </label>
          </div>
        </div>

          <div className="space-y-6">
          {/* Section Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={section.title || ''}
                onChange={(e) => handleSectionChange('newRelease', 'title', e.target.value)}
                placeholder="New Release"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={section.subtitle || ''}
                onChange={(e) => handleSectionChange('newRelease', 'subtitle', e.target.value)}
                placeholder="Discover our latest handcrafted luxury bags"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            </div>

          {/* CTA Button */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
              <input
                type="text"
                value={section.ctaText || ''}
                onChange={(e) => handleSectionChange('newRelease', 'ctaText', e.target.value)}
                placeholder="Explore the Shop"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Link</label>
              <input
                type="url"
                value={section.ctaLink || ''}
                onChange={(e) => handleSectionChange('newRelease', 'ctaLink', e.target.value)}
                placeholder="/shop"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Products Management */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-800">Featured Products</h4>
              <button
                onClick={() => {
                  const newProducts = [...(section.products || []), {
                    id: Date.now().toString(),
                    name: '',
                    image: { url: '', alt: '' },
                    price: 0,
                    link: '',
                    isCustomLink: false,
                    isActive: true,
                  }];
                  handleSectionChange('newRelease', 'products', newProducts);
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
              >
                + Add Product
              </button>
            </div>

            <div className="space-y-4">
              {(section.products || []).map((product, index) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-medium text-gray-700">Product #{index + 1}</h5>
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={product.isActive !== false}
                          onChange={(e) => {
                            const newProducts = [...(section.products || [])];
                            newProducts[index].isActive = e.target.checked;
                            handleSectionChange('newRelease', 'products', newProducts);
                          }}
                          className="mr-2"
                        />
                        <span className="text-xs text-gray-600">Active</span>
                      </label>
                      <button
                        onClick={() => {
                          const newProducts = (section.products || []).filter((_, i) => i !== index);
                          handleSectionChange('newRelease', 'products', newProducts);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                        value={product.name || ''}
                        onChange={(e) => {
                          const newProducts = [...(section.products || [])];
                          newProducts[index].name = e.target.value;
                          // Auto-generate slug and link if not using custom link
                          if (!product.isCustomLink) {
                            newProducts[index].link = generateProductLink(e.target.value);
                          }
                          handleSectionChange('newRelease', 'products', newProducts);
                        }}
                        placeholder="Product Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        💡 Product link will be auto-generated from the name
                      </p>
                      {product.name && !product.isCustomLink && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                          <div className="text-blue-700 font-medium">Preview:</div>
                          <div className="text-blue-600 font-mono">
                            {generateProductLink(product.name)}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                      <input
                        type="number"
                        value={product.price || ''}
                        onChange={(e) => {
                          const newProducts = [...(section.products || [])];
                          newProducts[index].price = parseFloat(e.target.value) || 0;
                          handleSectionChange('newRelease', 'products', newProducts);
                        }}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">Product Link</label>
                        <button
                          type="button"
                          onClick={() => {
                            const newProducts = [...(section.products || [])];
                            const wasCustom = newProducts[index].isCustomLink;
                            newProducts[index].isCustomLink = !newProducts[index].isCustomLink;
                            
                            // If switching from custom to auto, regenerate the link
                            if (wasCustom && newProducts[index].name) {
                              newProducts[index].link = generateProductLink(newProducts[index].name);
                            }
                            
                            handleSectionChange('newRelease', 'products', newProducts);
                          }}
                          className={`text-xs px-2 py-1 rounded ${
                            product.isCustomLink 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {product.isCustomLink ? 'Custom' : 'Auto'}
                        </button>
                      </div>
                      <input
                        type="url"
                        value={product.link || ''}
                        onChange={(e) => {
                          const newProducts = [...(section.products || [])];
                          newProducts[index].link = e.target.value;
                          handleSectionChange('newRelease', 'products', newProducts);
                        }}
                        placeholder="/products/product-slug"
                        readOnly={!product.isCustomLink}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm ${
                          !product.isCustomLink 
                            ? 'bg-gray-50 border-gray-200 text-gray-600' 
                            : 'border-gray-300'
                        }`}
                      />
                      {!product.isCustomLink && (
                        <p className="text-xs text-gray-500 mt-1">
                          🔗 Auto-generated from product name. Click "Auto" to customize.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                      <ImageUpload
                        currentImageUrl={product.image?.url}
                        onImageUploaded={(url) => {
                          const newProducts = [...(section.products || [])];
                          if (!newProducts[index].image) newProducts[index].image = {};
                          newProducts[index].image.url = url;
                          handleSectionChange('newRelease', 'products', newProducts);
                        }}
                        folder="rebelbygrace/content/new-release"
                        placeholder="Upload product image..."
                        aspectRatio="aspect-square"
                        uniqueId={`new-release-product-${index}`}
                      />
                      {product.image?.url && (
                        <input
                          type="text"
                          value={product.image?.alt || ''}
                          onChange={(e) => {
                            const newProducts = [...(section.products || [])];
                            if (!newProducts[index].image) newProducts[index].image = {};
                            newProducts[index].image.alt = e.target.value;
                            handleSectionChange('newRelease', 'products', newProducts);
                          }}
                          placeholder="Image description"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm mt-2"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(!section.products || section.products.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <p>No products added yet. Click "Add Product" to get started.</p>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={() => handleSave('home')}
              disabled={saving}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : 'Save New Release Section'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderHomeSection = (sectionId, page) => {
    switch (sectionId) {
      case 'hero':
        return renderHeroSection(page);
      case 'newRelease':
        return renderNewReleaseSection(page);
      default:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-8 text-gray-500">
              <h3 className="text-lg font-medium mb-2">Section Coming Soon</h3>
              <p>This section will be available soon.</p>
            </div>
          </div>
        );
    }
  };

  const renderHeroSection = (page) => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Hero Section</h3>
            <p className="text-sm text-gray-600">Manage the main banner with images and CTA</p>
          </div>
            </div>

        <div className="space-y-6">
          {/* Background Style Selection */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-800 mb-3">Background Style</h4>
            <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Choose Background Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {/* Gradient Button */}
                  <button
                    type="button"
                    onClick={() => handleSectionChange('hero', 'background.type', 'gradient')}
                    className={`p-3 border-2 rounded-lg text-center transition-colors ${
                      (page.sections?.hero?.background?.type || 'gradient') === 'gradient'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-full h-8 bg-gradient-to-r from-[#4a2c23] to-[#b08968] rounded mb-2"></div>
                    <span className="text-sm font-medium">Gradient</span>
                  </button>
                  
                  {/* Solid Color Button */}
                  <button
                    type="button"
                    onClick={() => handleSectionChange('hero', 'background.type', 'solid')}
                    className={`p-3 border-2 rounded-lg text-center transition-colors ${
                      page.sections?.hero?.background?.type === 'solid'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-full h-8 bg-gray-600 rounded mb-2"></div>
                    <span className="text-sm font-medium">Solid Color</span>
                  </button>
                  
                  {/* Image Button */}
                  <button
                    type="button"
                    onClick={() => handleSectionChange('hero', 'background.type', 'image')}
                    className={`p-3 border-2 rounded-lg text-center transition-colors ${
                      page.sections?.hero?.background?.type === 'image'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-full h-8 bg-gray-200 rounded mb-2 flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Image</span>
                  </button>
                </div>
              </div>
              
              {/* Conditional Background Options */}
              {page.sections?.hero?.background?.type === 'solid' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-blue-800 mb-2">Choose Background Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={page.sections?.hero?.backgroundColor || '#4a2c23'}
                      onChange={(e) => handleSectionChange('hero', 'backgroundColor', e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={page.sections?.hero?.backgroundColor || '#4a2c23'}
                      onChange={(e) => handleSectionChange('hero', 'backgroundColor', e.target.value)}
                      placeholder="#4a2c23"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                    <div className="text-xs text-blue-600">
                      Preview: <span className="inline-block w-4 h-4 rounded border" style={{backgroundColor: page.sections?.hero?.backgroundColor || '#4a2c23'}}></span>
                    </div>
                  </div>
                </div>
              )}
              
              {page.sections?.hero?.background?.type === 'image' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-green-800 mb-2">Upload Background Image</label>
                  <ImageUpload
                    currentImageUrl={page.sections?.hero?.backgroundImage}
                    onImageUploaded={(url) => handleSectionChange('hero', 'backgroundImage', url)}
                    folder="rebelbygrace/content/hero"
                    placeholder="Upload background image..."
                    aspectRatio="aspect-video"
                    uniqueId="hero-background-image"
                  />
                  <p className="text-xs text-green-600 mt-2">
                    💡 Tip: Use landscape images (16:9 ratio) for best results
                  </p>
                </div>
              )}
              
              {(page.sections?.hero?.background?.type || 'gradient') === 'gradient' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-purple-800">Gradient Background</span>
                  </div>
                  <p className="text-xs text-purple-600 mt-1">
                    Beautiful gradient from brown to gold will be applied automatically
                  </p>
                  <div className="w-full h-6 bg-gradient-to-r from-[#4a2c23] to-[#b08968] rounded mt-2"></div>
                </div>
              )}
            </div>
          </div>

          {/* Side Images Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h4 className="text-md font-medium text-gray-800">Side Images (Optional)</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Add images on the left and right sides of your hero content. These will be hidden on mobile devices.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Image */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">L</span>
                  Left Image
                </h5>
                
                <div className="space-y-3">
                  <ImageUpload
                    currentImageUrl={page.sections?.hero?.leftImage?.url}
                    onImageUploaded={(url) => handleSectionChange('hero', 'leftImage.url', url)}
                    folder="rebelbygrace/content/hero"
                    placeholder="Upload left image..."
                    aspectRatio="aspect-[4/3]"
                    uniqueId="hero-left-image"
                  />
                  
                  {page.sections?.hero?.leftImage?.url && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={page.sections?.hero?.leftImage?.alt || ''}
                        onChange={(e) => handleSectionChange('hero', 'leftImage.alt', e.target.value)}
                        placeholder="Image description (for accessibility)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="url"
                        value={page.sections?.hero?.leftImage?.link || ''}
                        onChange={(e) => handleSectionChange('hero', 'leftImage.link', e.target.value)}
                        placeholder="Link URL (optional) - e.g., /shop"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Image */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">R</span>
                  Right Image
                </h5>
                
                <div className="space-y-3">
                  <ImageUpload
                    currentImageUrl={page.sections?.hero?.rightImage?.url}
                    onImageUploaded={(url) => handleSectionChange('hero', 'rightImage.url', url)}
                    folder="rebelbygrace/content/hero"
                    placeholder="Upload right image..."
                    aspectRatio="aspect-[4/3]"
                    uniqueId="hero-right-image"
                  />
                  
                  {page.sections?.hero?.rightImage?.url && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={page.sections?.hero?.rightImage?.alt || ''}
                        onChange={(e) => handleSectionChange('hero', 'rightImage.alt', e.target.value)}
                        placeholder="Image description (for accessibility)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="url"
                        value={page.sections?.hero?.rightImage?.link || ''}
                        onChange={(e) => handleSectionChange('hero', 'rightImage.link', e.target.value)}
                        placeholder="Link URL (optional) - e.g., /shop"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Center Content */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <h4 className="text-md font-medium text-gray-800">Hero Content</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              This content will appear in the center of your hero section. Make it compelling to grab attention!
            </p>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Headline</label>
                <input
                  type="text"
                  value={page.sections?.hero?.centerContent?.title || ''}
                  onChange={(e) => handleSectionChange('hero', 'centerContent.title', e.target.value)}
                  placeholder="Handcrafted Luxury Bags"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">This will be the main title that stands out</p>
              </div>
              
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                  value={page.sections?.hero?.centerContent?.subtitle || ''}
                  onChange={(e) => handleSectionChange('hero', 'centerContent.subtitle', e.target.value)}
                  placeholder="Premium Quality, Timeless Design"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Supporting text that reinforces your message</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                  value={page.sections?.hero?.centerContent?.description || ''}
                  onChange={(e) => handleSectionChange('hero', 'centerContent.description', e.target.value)}
                  rows={3}
                  placeholder="Discover our collection of handcrafted bags made with the finest materials..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Detailed description to engage your visitors</p>
              </div>
              
              {/* CTA Section */}
              <div className="border-t border-gray-200 pt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">Call-to-Action Button</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                    <input
                      type="text"
                      value={page.sections?.hero?.centerContent?.ctaText || ''}
                      onChange={(e) => handleSectionChange('hero', 'centerContent.ctaText', e.target.value)}
                      placeholder="Shop Now"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
              <input
                type="url"
                      value={page.sections?.hero?.centerContent?.ctaLink || ''}
                      onChange={(e) => handleSectionChange('hero', 'centerContent.ctaLink', e.target.value)}
                      placeholder="/shop"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button Style</label>
                    <select
                      value={page.sections?.hero?.centerContent?.ctaStyle || 'primary'}
                      onChange={(e) => handleSectionChange('hero', 'centerContent.ctaStyle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="primary">Primary (White)</option>
                      <option value="secondary">Secondary (Transparent)</option>
                      <option value="outline">Outline</option>
                    </select>
                  </div>
                </div>
                
                {/* CTA Preview */}
                {page.sections?.hero?.centerContent?.ctaText && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Preview:</p>
                    <button className={`px-6 py-2 rounded-lg font-medium ${
                      page.sections?.hero?.centerContent?.ctaStyle === 'primary'
                        ? 'bg-white text-[#4a2c23] border border-white'
                        : page.sections?.hero?.centerContent?.ctaStyle === 'secondary'
                        ? 'bg-transparent border-2 border-white text-white'
                        : 'bg-transparent border-2 border-white text-white'
                    }`}>
                      {page.sections?.hero?.centerContent?.ctaText}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={() => handleSave('home')}
              disabled={saving}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : 'Save Hero Section'}
            </button>
              </div>
            </div>
      </div>
    );
  };

  const renderContent = () => {
    const page = content[activeTab] || {};

    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* Home Page Sections Navigation */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Home Page Sections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {homeSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`p-4 text-left border-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{section.icon}</span>
                      <div>
                        <div className="font-medium">{section.name}</div>
                        <div className="text-sm text-gray-600">{section.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section Content */}
            {renderHomeSection(activeSection, page)}
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
              <input
                type="text"
                value={page.title || ''}
                onChange={(e) => handleContentChange('about', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="About Us"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={page.content || ''}
                onChange={(e) => handleContentChange('about', 'content', e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Tell your story..."
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => handleSave('about')}
                disabled={saving}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving...' : 'Save About Page'}
              </button>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
              <input
                type="text"
                value={page.title || ''}
                onChange={(e) => handleContentChange('contact', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Contact Us"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={page.content || ''}
                onChange={(e) => handleContentChange('contact', 'content', e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Contact information and form..."
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => handleSave('contact')}
                disabled={saving}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving...' : 'Save Contact Page'}
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Select a page to manage content.</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600">Manage your website content and sections</p>
        </div>
        {Object.keys(content).length === 0 && (
          <button
            onClick={handleSeedContent}
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Seeding...' : 'Seed Initial Content'}
          </button>
        )}
      </div>

      {/* Page Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
