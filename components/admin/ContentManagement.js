'use client';

import { useState } from 'react';

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState('home');
  const [content, setContent] = useState({
    home: {
      title: 'Welcome to RebelByGrace',
      subtitle: 'Premium Handbags & Fashion Accessories',
      description: 'Discover our exclusive collection of premium handbags and fashion accessories for women and men. Quality craftsmanship meets modern style.',
      heroImage: '',
      featuredProducts: [],
    },
    about: {
      title: 'About RebelByGrace',
      content: 'RebelByGrace is a premium fashion brand dedicated to creating exceptional handbags and accessories that combine timeless elegance with contemporary style. Our commitment to quality craftsmanship and attention to detail ensures that every piece in our collection is not just an accessory, but a statement of sophistication and grace.',
      mission: 'To empower individuals to express their unique style through premium quality handbags and accessories that blend elegance with functionality.',
      vision: 'To be the leading brand in premium fashion accessories, recognized globally for our commitment to quality, style, and customer satisfaction.',
    },
    contact: {
      title: 'Contact Us',
      description: 'We\'d love to hear from you. Get in touch with us for any questions or inquiries.',
      email: 'info@rebelbygrace.com',
      phone: '+234 123 456 7890',
      address: '123 Fashion Street, Lagos, Nigeria',
      hours: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed',
    },
  });

  const [loading, setLoading] = useState(false);

  const handleContentChange = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async (section) => {
    setLoading(true);
    try {
      // In a real app, you'd save this to your database
      console.log(`Saving ${section} content:`, content[section]);
      alert(`${section.charAt(0).toUpperCase() + section.slice(1)} content saved successfully!`);
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'home', name: 'Homepage', icon: '🏠' },
    { id: 'about', name: 'About Page', icon: '📖' },
    { id: 'contact', name: 'Contact Page', icon: '📞' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Title
              </label>
              <input
                type="text"
                value={content.home.title}
                onChange={(e) => handleContentChange('home', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={content.home.subtitle}
                onChange={(e) => handleContentChange('home', 'subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={content.home.description}
                onChange={(e) => handleContentChange('home', 'description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Image URL
              </label>
              <input
                type="url"
                value={content.home.heroImage}
                onChange={(e) => handleContentChange('home', 'heroImage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Products
              </label>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Featured products will be automatically selected based on your "Featured" product settings.</p>
                <p className="text-xs text-gray-500">Products marked as "Featured" in the Products section will appear here.</p>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Title
              </label>
              <input
                type="text"
                value={content.about.title}
                onChange={(e) => handleContentChange('about', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Content
              </label>
              <textarea
                value={content.about.content}
                onChange={(e) => handleContentChange('about', 'content', e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mission Statement
              </label>
              <textarea
                value={content.about.mission}
                onChange={(e) => handleContentChange('about', 'mission', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vision Statement
              </label>
              <textarea
                value={content.about.vision}
                onChange={(e) => handleContentChange('about', 'vision', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Title
              </label>
              <input
                type="text"
                value={content.contact.title}
                onChange={(e) => handleContentChange('contact', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={content.contact.description}
                onChange={(e) => handleContentChange('contact', 'description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={content.contact.email}
                  onChange={(e) => handleContentChange('contact', 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={content.contact.phone}
                  onChange={(e) => handleContentChange('contact', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={content.contact.address}
                  onChange={(e) => handleContentChange('contact', 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Hours
                </label>
                <textarea
                  value={content.contact.hours}
                  onChange={(e) => handleContentChange('contact', 'hours', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Monday - Friday: 9:00 AM - 6:00 PM&#10;Saturday: 10:00 AM - 4:00 PM&#10;Sunday: Closed"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
        <p className="text-gray-600 mt-2">Manage your website content and pages</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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

        {/* Tab Content */}
        <div className="p-6">
          {renderContent()}
        </div>

        {/* Save Button */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end">
          <button
            onClick={() => handleSave(activeTab)}
            disabled={loading}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : `Save ${tabs.find(t => t.id === activeTab)?.name}`}
          </button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Content Preview</h2>
          <p className="text-sm text-gray-600">Preview how your content will appear on the website</p>
        </div>
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {content[activeTab]?.title}
              </h1>
              {activeTab === 'home' && (
                <>
                  <h2 className="text-lg text-gray-600 mb-4">
                    {content.home.subtitle}
                  </h2>
                  <p className="text-gray-700 mb-4">
                    {content.home.description}
                  </p>
                  {content.home.heroImage && (
                    <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                      <span className="text-gray-500">Hero Image: {content.home.heroImage}</span>
                    </div>
                  )}
                </>
              )}
              {activeTab === 'about' && (
                <>
                  <p className="text-gray-700 mb-6">
                    {content.about.content}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Our Mission</h3>
                      <p className="text-gray-700 text-sm">
                        {content.about.mission}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Our Vision</h3>
                      <p className="text-gray-700 text-sm">
                        {content.about.vision}
                      </p>
                    </div>
                  </div>
                </>
              )}
              {activeTab === 'contact' && (
                <>
                  <p className="text-gray-700 mb-6">
                    {content.contact.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p><span className="font-medium">Email:</span> {content.contact.email}</p>
                        <p><span className="font-medium">Phone:</span> {content.contact.phone}</p>
                        <p><span className="font-medium">Address:</span> {content.contact.address}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
                      <div className="text-sm text-gray-700 whitespace-pre-line">
                        {content.contact.hours}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
