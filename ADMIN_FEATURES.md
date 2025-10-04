# Admin Features Documentation

## Overview

The RebelByGrace admin dashboard provides comprehensive management capabilities for your online store. Access the admin panel at `/admin` (requires admin authentication).

## Features Implemented

### 1. Admin Dashboard (`/admin`)
- **Overview Tab**: Real-time statistics including total products, orders, revenue, and pending orders
- **Products Tab**: Complete product management system
- **Orders Tab**: Order management and status updates
- **Content Tab**: Website content management for public pages

### 2. Product Management
- **Add Products**: Create new products with detailed information
- **Edit Products**: Update existing product details
- **Delete Products**: Remove products from the catalog
- **Product Categories**: Support for all PRD categories:
  - Women's Collection: RG Midi Handbag, RG Mini Handbag, Celia Clutch Purse, The Livvy Bag, RG Box Mini
  - Men's Collection: Bull Briefcase, Classic Laptop Bag
  - Travel Collection: RG Luxe Duffel Bag
- **Product Features**:
  - Multiple images with primary image selection
  - Pricing with original/sale prices
  - Inventory management
  - SEO optimization fields
  - Physical properties (weight, dimensions)
  - Featured product designation
  - Active/inactive status

### 3. Order Management
- **View Orders**: Complete order details with customer information
- **Order Status Updates**: Change order status (pending, confirmed, processing, shipped, delivered, cancelled)
- **Order Search**: Search by order number, customer name, or email
- **Order Filtering**: Filter by status and payment status
- **Order Details Modal**: Comprehensive order view with:
  - Customer information and shipping address
  - Order items with images
  - Payment and shipping details
  - Order notes and tracking information

### 4. Content Management
- **Homepage Content**: Manage hero section, featured products, and page content
- **About Page**: Edit company information, mission, and vision statements
- **Contact Page**: Update contact information, business hours, and address
- **Content Preview**: Real-time preview of content changes

### 5. Collections & Categories
- **Collections Page** (`/collections`): Overview of all product collections
- **Individual Collection Pages**:
  - Women's Collection (`/collections/womens`)
  - Men's Collection (`/collections/mens`)
  - Travel Collection (`/collections/travel`)
- **Category Filtering**: Filter products by specific categories within collections
- **Product Search**: Search functionality across all collections

## Admin Authentication

- Admin users are created through the seed script (`/api/admin/seed`)
- Admin status is verified through JWT tokens
- Protected routes ensure only authenticated admins can access admin features

## Sample Data

The system includes sample products representing all categories from the PRD:
- 5 Women's collection products (including featured items)
- 2 Men's collection products
- 1 Travel collection product

## Navigation

- Admin dashboard accessible from user dropdown menu when logged in as admin
- Breadcrumb navigation for easy navigation between admin sections
- Responsive design works on desktop and mobile devices

## API Endpoints

### Admin Product APIs
- `GET /api/admin/products` - List products with pagination and search
- `POST /api/admin/products` - Create new product
- `GET /api/admin/products/[id]` - Get specific product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product

### Admin Order APIs
- `GET /api/admin/orders` - List orders with filtering and pagination
- `GET /api/admin/orders/[orderNumber]` - Get specific order
- `PUT /api/admin/orders/[orderNumber]` - Update order status

### Admin Seed API
- `GET /api/admin/seed` - Check admin user status
- `POST /api/admin/seed` - Create admin user

## Usage Instructions

1. **Access Admin Panel**: Log in as admin user and click "Admin Dashboard" in user menu
2. **Manage Products**: Use Products tab to add, edit, or delete products
3. **Process Orders**: Use Orders tab to view and update order statuses
4. **Update Content**: Use Content tab to manage website content
5. **View Analytics**: Dashboard overview provides key business metrics

## Technical Notes

- All admin routes are protected with `requireAdmin` middleware
- Product images are handled with URL-based storage (ready for cloud integration)
- Order status updates are real-time and reflected immediately
- Content management includes live preview functionality
- All admin components are responsive and mobile-friendly
