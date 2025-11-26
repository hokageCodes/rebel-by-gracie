# RebelByGrace API Documentation

## Overview

The RebelByGrace API provides endpoints for managing an e-commerce platform with user authentication, product management, order processing, and admin functionality.

## Base URL

```
Production: https://your-domain.com/api
Development: http://localhost:3000/api
```

## Authentication

The API uses JWT tokens stored in HTTP-only cookies for authentication.

### Headers

```http
Content-Type: application/json
Cookie: auth-token=your-jwt-token
```

## Rate Limiting

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| General API | 1000 requests | 15 minutes |
| Authentication | 5 requests | 15 minutes |
| Registration | 3 requests | 1 hour |
| Password Reset | 3 requests | 1 hour |
| Admin Operations | 100 requests | 1 minute |

## Error Responses

All errors follow this format:

```json
{
  "error": true,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {
    "field": "Specific field error"
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Access denied
- `NOT_FOUND` - Resource not found
- `ALREADY_EXISTS` - Resource already exists
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

## Success Responses

```json
{
  "success": true,
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

---

## Authentication Endpoints

### POST /auth/register

Register a new user account.

**Rate Limit:** 3 requests per hour

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+2347012345678"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Check your email for the verification code.",
  "data": {
    "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "email": "user@example.com",
    "firstName": "John",
    "emailSent": true
  }
}
```

### POST /auth/login

Authenticate a user and receive a JWT token.

**Rate Limit:** 5 requests per 15 minutes

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer",
      "isEmailVerified": true
    }
  }
}
```

### POST /auth/verify

Verify email with OTP code.

**Request Body:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

### GET /auth/me

Get current user information.

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer",
      "isEmailVerified": true,
      "createdAt": "2023-09-06T10:30:00.000Z"
    }
  }
}
```

### POST /auth/logout

Logout current user.

**Authentication:** Required

---

## Product Endpoints

### GET /products

Get list of products with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `category` (string): Filter by category
- `collection` (string): Filter by collection
- `search` (string): Search term
- `featured` (boolean): Show only featured products
- `sort` (string): Sort by (price-asc, price-desc, name-asc, name-desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "RG Midi Handbag",
        "slug": "rg-midi-handbag",
        "description": "Premium leather handbag...",
        "price": 45000,
        "category": "rg-midi-handbag",
        "collection": "womens",
        "images": [
          {
            "url": "https://example.com/image.jpg",
            "alt": "RG Midi Handbag",
            "isPrimary": true
          }
        ],
        "inventory": 10,
        "isFeatured": true,
        "createdAt": "2023-09-06T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 50,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### GET /products/[slug]

Get single product by slug.

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "RG Midi Handbag",
      "slug": "rg-midi-handbag",
      "description": "Premium leather handbag...",
      "price": 45000,
      "originalPrice": 50000,
      "category": "rg-midi-handbag",
      "collection": "womens",
      "images": [...],
      "variants": [...],
      "inventory": 10,
      "isActive": true,
      "isFeatured": true,
      "tags": ["leather", "handbag", "women"],
      "seo": {
        "metaTitle": "RG Midi Handbag - RebelByGrace",
        "metaDescription": "Premium leather handbag...",
        "metaKeywords": ["handbag", "leather", "women"]
      }
    }
  }
}
```

---

## Order Endpoints

### GET /orders

Get user's order history.

**Authentication:** Required

**Query Parameters:**
- `guestEmail` (string): For guest orders

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "orderNumber": "RBG230906001",
        "items": [
          {
            "product": {
              "id": "64f8a1b2c3d4e5f6a7b8c9d1",
              "name": "RG Midi Handbag",
              "price": 45000
            },
            "quantity": 1,
            "price": 45000
          }
        ],
        "shippingAddress": {
          "firstName": "John",
          "lastName": "Doe",
          "email": "user@example.com",
          "phone": "+2347012345678",
          "street": "123 Main St",
          "city": "Lagos",
          "state": "Lagos",
          "zipCode": "100001",
          "country": "Nigeria"
        },
        "orderStatus": "pending",
        "paymentStatus": "pending",
        "subtotal": 45000,
        "shippingCost": 2000,
        "totalAmount": 47000,
        "createdAt": "2023-09-06T10:30:00.000Z"
      }
    ]
  }
}
```

### POST /orders

Create a new order.

**Request Body:**
```json
{
  "items": [
    {
      "productId": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "RG Midi Handbag",
      "price": 45000,
      "quantity": 1,
      "image": "https://example.com/image.jpg"
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "phone": "+2347012345678",
    "street": "123 Main St",
    "city": "Lagos",
    "state": "Lagos",
    "zipCode": "100001",
    "country": "Nigeria"
  },
  "paymentMethod": "cash_on_delivery",
  "shippingCost": 2000,
  "notes": "Please deliver after 5 PM"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "orderNumber": "RBG230906001",
      "items": [...],
      "shippingAddress": {...},
      "orderStatus": "pending",
      "paymentStatus": "pending",
      "subtotal": 45000,
      "shippingCost": 2000,
      "totalAmount": 47000,
      "createdAt": "2023-09-06T10:30:00.000Z"
    }
  }
}
```

### GET /orders/[orderNumber]

Get specific order details.

**Authentication:** Required (or guest with order number)

---

## Cart Endpoints

### GET /cart

Get user's cart.

**Authentication:** Required

### POST /cart

Add item to cart.

**Authentication:** Required

**Request Body:**
```json
{
  "productId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "quantity": 1,
  "variant": {
    "name": "Color",
    "options": [
      {
        "name": "Color",
        "value": "Black"
      }
    ]
  }
}
```

### PUT /cart/[itemId]

Update cart item quantity.

### DELETE /cart/[itemId]

Remove item from cart.

---

## Admin Endpoints

All admin endpoints require admin authentication.

### Products Management

#### GET /admin/products

Get all products with admin filters.

**Query Parameters:**
- `page`, `limit`, `search` (same as public)
- `category`, `collection`, `priceRange`
- `isActive`, `isFeatured`

#### POST /admin/products

Create new product.

#### PUT /admin/products/[id]

Update product.

#### DELETE /admin/products/[id]

Delete product.

### Orders Management

#### GET /admin/orders

Get all orders with admin filters.

#### PUT /admin/orders/[orderNumber]

Update order status.

### Users Management

#### GET /admin/users

Get all users with pagination and filters.

#### PUT /admin/users/[id]

Update user details.

#### DELETE /admin/users/[id]

Delete user.

#### POST /admin/users/export

Export users data.

**Request Body:**
```json
{
  "userIds": ["64f8a1b2c3d4e5f6a7b8c9d0"],
  "format": "csv"
}
```

### Content Management

#### GET /admin/content

Get all content pages.

#### GET /admin/content/[page]

Get specific content page.

#### PUT /admin/content/[page]

Update content page.

### File Upload

#### POST /admin/upload

Upload image to Cloudinary.

**Request:** Multipart form data with `image` field.

**Response:**
```json
{
  "success": true,
  "data": {
    "image": {
      "url": "https://res.cloudinary.com/...",
      "public_id": "rebelbygrace/products/...",
      "width": 800,
      "height": 600,
      "format": "jpg",
      "bytes": 123456
    }
  }
}
```

#### DELETE /admin/upload

Delete image from Cloudinary.

**Query Parameters:**
- `public_id`: Cloudinary public ID

---

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'customer' | 'admin';
  address?: Address;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Product
```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  category: string;
  collection: 'womens' | 'mens' | 'travel';
  images: ProductImage[];
  variants?: ProductVariant[];
  inventory: number;
  isActive: boolean;
  isFeatured: boolean;
  tags?: string[];
  weight?: number;
  dimensions?: Dimensions;
  seo?: SEO;
  createdAt: Date;
  updatedAt: Date;
}
```

### Order
```typescript
interface Order {
  id: string;
  orderNumber: string;
  user?: string; // User ID
  guestEmail?: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'cash_on_delivery' | 'bank_transfer';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  notes?: string;
  trackingNumber?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `413` - Payload Too Large
- `429` - Too Many Requests
- `500` - Internal Server Error
- `503` - Service Unavailable

---

## SDK Examples

### JavaScript/TypeScript

```typescript
class RebelByGraceAPI {
  private baseURL: string;
  private token?: string;

  constructor(baseURL = 'http://localhost:3000/api') {
    this.baseURL = baseURL;
  }

  async login(email: string, password: string) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    return response.json();
  }

  async getProducts(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${this.baseURL}/products?${params}`, {
      credentials: 'include'
    });
    return response.json();
  }

  async createOrder(orderData: any) {
    const response = await fetch(`${this.baseURL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
      credentials: 'include'
    });
    return response.json();
  }
}
```

### Python

```python
import requests

class RebelByGraceAPI:
    def __init__(self, base_url="http://localhost:3000/api"):
        self.base_url = base_url
        self.session = requests.Session()
    
    def login(self, email, password):
        response = self.session.post(
            f"{self.base_url}/auth/login",
            json={"email": email, "password": password}
        )
        return response.json()
    
    def get_products(self, **filters):
        response = self.session.get(
            f"{self.base_url}/products",
            params=filters
        )
        return response.json()
```

---

## Changelog

### Version 1.0.0
- Initial API release
- User authentication and registration
- Product management
- Order processing
- Admin dashboard
- File upload with Cloudinary
- Rate limiting and security headers

