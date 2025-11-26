// Common validation patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  nigerianPhone: /^(\+234|234|0)?[789][01]\d{8}$/,
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
};

// Sanitization functions
export const sanitize = {
  email: (email) => {
    if (!email) return '';
    return email.trim().toLowerCase();
  },
  string: (str) => {
    if (!str) return '';
    // Basic HTML escaping
    return str.trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  },
  phone: (phone) => phone?.replace(/[^\d+]/g, '') || '',
  slug: (slug) => {
    if (!slug) return '';
    return slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  },
  html: (html) => {
    if (!html) return '';
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  },
};

// Validation functions
export const validate = {
  email: (email) => {
    if (!email) return 'Email is required';
    if (!patterns.email.test(email)) return 'Invalid email format';
    return null;
  },

  password: (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password.length > 128) return 'Password must be less than 128 characters';
    return null;
  },

  strongPassword: (password) => {
    if (!password) return 'Password is required';
    if (!patterns.password.test(password)) {
      return 'Password must contain at least 8 characters with uppercase, lowercase, and number';
    }
    return null;
  },

  phone: (phone) => {
    if (!phone) return 'Phone number is required';
    if (!patterns.nigerianPhone.test(phone)) return 'Invalid Nigerian phone number';
    return null;
  },

  required: (value, fieldName) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return null;
  },

  minLength: (value, min, fieldName) => {
    if (value && value.length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (value, max, fieldName) => {
    if (value && value.length > max) {
      return `${fieldName} must be less than ${max} characters`;
    }
    return null;
  },

  number: (value, fieldName) => {
    if (value !== undefined && value !== null && isNaN(Number(value))) {
      return `${fieldName} must be a valid number`;
    }
    return null;
  },

  positiveNumber: (value, fieldName) => {
    const numError = validate.number(value, fieldName);
    if (numError) return numError;
    if (value !== undefined && value !== null && Number(value) < 0) {
      return `${fieldName} must be positive`;
    }
    return null;
  },

  array: (value, fieldName) => {
    if (value && !Array.isArray(value)) {
      return `${fieldName} must be an array`;
    }
    return null;
  },

  slug: (slug) => {
    if (!slug) return 'Slug is required';
    if (!patterns.slug.test(slug)) return 'Invalid slug format';
    return null;
  },

  url: (url) => {
    if (url && !patterns.url.test(url)) {
      return 'Invalid URL format';
    }
    return null;
  },
};

// Validation schemas
export const schemas = {
  user: {
    email: validate.email,
    password: validate.password,
    firstName: (value) => validate.required(value, 'First name') || validate.minLength(value, 2, 'First name'),
    lastName: (value) => validate.required(value, 'Last name') || validate.minLength(value, 2, 'Last name'),
    phone: validate.phone,
  },

  product: {
    name: (value) => validate.required(value, 'Product name') || validate.minLength(value, 3, 'Product name'),
    description: (value) => validate.required(value, 'Description') || validate.minLength(value, 10, 'Description'),
    price: (value) => validate.required(value, 'Price') || validate.positiveNumber(value, 'Price'),
    category: (value) => validate.required(value, 'Category'),
    productCollection: (value) => validate.required(value, 'Collection'),
    // slug is optional - will be auto-generated from name if not provided
    slug: (value) => value ? validate.slug(value) : null,
    inventory: (value) => value !== undefined && value !== null ? validate.positiveNumber(value, 'Inventory') : null,
  },

  order: {
    items: (value) => validate.required(value, 'Order items') || validate.array(value, 'Order items'),
    shippingAddress: {
      firstName: (value) => validate.required(value, 'First name'),
      lastName: (value) => validate.required(value, 'Last name'),
      email: validate.email,
      phone: validate.phone,
      street: (value) => validate.required(value, 'Street address'),
      city: (value) => validate.required(value, 'City'),
      state: (value) => validate.required(value, 'State'),
      zipCode: (value) => validate.required(value, 'ZIP code'),
      country: (value) => validate.required(value, 'Country'),
    },
  },
};

// Main validation function
export function validateData(data, schema, sanitizeData = true) {
  const errors = {};
  const sanitizedData = {};

  for (const [field, validator] of Object.entries(schema)) {
    const value = data[field];

    // Sanitize if requested
    let sanitizedValue = value;
    if (sanitizeData) {
      if (typeof value === 'string') {
        if (field === 'email') {
          sanitizedValue = sanitize.email(value);
        } else if (field === 'phone') {
          sanitizedValue = sanitize.phone(value);
        } else if (field === 'slug') {
          sanitizedValue = sanitize.slug(value);
        } else {
          sanitizedValue = sanitize.string(value);
        }
      }
    }

    // Validate
    if (typeof validator === 'function') {
      const error = validator(sanitizedValue);
      if (error) {
        errors[field] = error;
      } else {
        sanitizedData[field] = sanitizedValue;
      }
    } else if (typeof validator === 'object' && validator !== null) {
      // Nested object validation
      const nestedResult = validateData(value || {}, validator, sanitizeData);
      if (Object.keys(nestedResult.errors).length > 0) {
        errors[field] = nestedResult.errors;
      }
      sanitizedData[field] = nestedResult.data;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: sanitizedData,
  };
}

// Express-style validation middleware
export function validateRequest(schema, options = {}) {
  return (handler) => {
    return async (request, context) => {
      try {
        let requestData;
        
        if (request.method === 'GET') {
          requestData = Object.fromEntries(new URL(request.url).searchParams);
        } else {
          requestData = await request.json();
        }

        const result = validateData(requestData, schema, options.sanitize !== false);
        
        if (!result.isValid) {
          return Response.json({
            error: 'Validation failed',
            details: result.errors,
          }, { status: 400 });
        }

        // Add validated data to request
        request.validatedData = result.data;
        return handler(request, context);
        
      } catch (error) {
        console.error('Validation error:', error);
        return Response.json({
          error: 'Invalid request format',
        }, { status: 400 });
      }
    };
  };
}
