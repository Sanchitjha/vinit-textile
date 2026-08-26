import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const schemas = {
  ApiSuccess: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string' },
      data: {},
    },
  },
  ApiError: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string' },
      error: {
        type: 'object',
        properties: { code: { type: 'string', example: 'BAD_REQUEST' } },
      },
    },
  },
  PaginationMeta: {
    type: 'object',
    properties: {
      page: { type: 'integer', example: 1 },
      limit: { type: 'integer', example: 20 },
      total: { type: 'integer', example: 42 },
      totalPages: { type: 'integer', example: 3 },
    },
  },
  Address: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      name: { type: 'string' },
      phone: { type: 'string' },
      addressLine1: { type: 'string' },
      addressLine2: { type: 'string' },
      city: { type: 'string' },
      state: { type: 'string' },
      postalCode: { type: 'string' },
      country: { type: 'string', example: 'India' },
      isDefault: { type: 'boolean' },
    },
  },
  AddressInput: {
    type: 'object',
    required: ['name', 'phone', 'addressLine1', 'city', 'state', 'postalCode', 'country'],
    properties: {
      name: { type: 'string' },
      phone: { type: 'string' },
      addressLine1: { type: 'string' },
      addressLine2: { type: 'string' },
      city: { type: 'string' },
      state: { type: 'string' },
      postalCode: { type: 'string' },
      country: { type: 'string', example: 'India' },
      isDefault: { type: 'boolean', default: false },
    },
  },
  User: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      phone: { type: 'string' },
      role: { type: 'string', enum: ['CUSTOMER', 'ADMIN'] },
      avatar: { type: 'string', nullable: true },
      addresses: { type: 'array', items: { $ref: '#/components/schemas/Address' } },
      isActive: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  RegisterInput: {
    type: 'object',
    required: ['name', 'email', 'phone', 'password'],
    properties: {
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      phone: { type: 'string' },
      password: { type: 'string', format: 'password', minLength: 8 },
    },
  },
  LoginInput: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', format: 'password' },
    },
  },
  AuthResult: {
    type: 'object',
    properties: {
      user: { $ref: '#/components/schemas/User' },
      accessToken: { type: 'string' },
    },
  },
  UpdateProfileInput: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      phone: { type: 'string' },
      avatar: { type: 'string', format: 'uri' },
    },
  },
  Category: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      name: { type: 'string' },
      slug: { type: 'string' },
      description: { type: 'string' },
      image: { type: 'string' },
      parentCategory: { type: 'string', nullable: true },
      isActive: { type: 'boolean' },
    },
  },
  CategoryInput: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      image: { type: 'string', format: 'uri' },
      parentCategory: { type: 'string', nullable: true },
      isActive: { type: 'boolean', default: true },
    },
  },
  Saree: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      name: { type: 'string' },
      slug: { type: 'string' },
      description: { type: 'string' },
      category: { type: 'string' },
      subCategory: { type: 'string', nullable: true },
      images: { type: 'array', items: { type: 'string', format: 'uri' } },
      price: { type: 'number' },
      compareAtPrice: { type: 'number' },
      discount: { type: 'number' },
      sku: { type: 'string' },
      stock: { type: 'integer' },
      fabric: { type: 'string' },
      sareeType: { type: 'string' },
      weave: { type: 'string' },
      color: { type: 'string' },
      colors: { type: 'array', items: { type: 'string' } },
      pattern: { type: 'string' },
      borderType: { type: 'string' },
      blousePiece: { type: 'boolean' },
      blouseColor: { type: 'string' },
      sareeLength: { type: 'number' },
      blouseLength: { type: 'number' },
      occasion: { type: 'array', items: { type: 'string' } },
      region: { type: 'string' },
      tags: { type: 'array', items: { type: 'string' } },
      careInstructions: { type: 'string' },
      isFeatured: { type: 'boolean' },
      isActive: { type: 'boolean' },
      ratings: { type: 'number' },
      reviewCount: { type: 'integer' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  SareeInput: {
    type: 'object',
    required: ['name', 'description', 'category', 'images', 'price', 'sku', 'fabric', 'color'],
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      category: { type: 'string' },
      subCategory: { type: 'string', nullable: true },
      images: { type: 'array', items: { type: 'string', format: 'uri' } },
      price: { type: 'number' },
      compareAtPrice: { type: 'number' },
      discount: { type: 'number', default: 0 },
      sku: { type: 'string' },
      stock: { type: 'integer', default: 0 },
      fabric: { type: 'string' },
      sareeType: { type: 'string' },
      weave: { type: 'string' },
      color: { type: 'string' },
      colors: { type: 'array', items: { type: 'string' } },
      pattern: { type: 'string' },
      borderType: { type: 'string' },
      blousePiece: { type: 'boolean', default: false },
      blouseColor: { type: 'string' },
      sareeLength: { type: 'number' },
      blouseLength: { type: 'number' },
      occasion: { type: 'array', items: { type: 'string' } },
      region: { type: 'string' },
      tags: { type: 'array', items: { type: 'string' } },
      careInstructions: { type: 'string' },
      isFeatured: { type: 'boolean', default: false },
      isActive: { type: 'boolean', default: true },
    },
  },
  AdjustStockInput: {
    type: 'object',
    required: ['quantity'],
    properties: {
      quantity: { type: 'integer', description: 'Signed delta, e.g. -2 or 10' },
    },
  },
  SareePaginated: {
    type: 'object',
    properties: {
      items: { type: 'array', items: { $ref: '#/components/schemas/Saree' } },
      meta: { $ref: '#/components/schemas/PaginationMeta' },
    },
  },
  CartItem: {
    type: 'object',
    properties: {
      saree: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          slug: { type: 'string' },
          image: { type: 'string', nullable: true },
          price: { type: 'number' },
          stock: { type: 'integer' },
          isActive: { type: 'boolean' },
        },
      },
      quantity: { type: 'integer' },
      lineTotal: { type: 'number' },
    },
  },
  Cart: {
    type: 'object',
    properties: {
      items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } },
      subtotal: { type: 'number' },
      itemCount: { type: 'integer' },
    },
  },
  AddCartItemInput: {
    type: 'object',
    required: ['sareeId'],
    properties: {
      sareeId: { type: 'string' },
      quantity: { type: 'integer', default: 1 },
    },
  },
  UpdateCartItemInput: {
    type: 'object',
    required: ['quantity'],
    properties: { quantity: { type: 'integer' } },
  },
  OrderItem: {
    type: 'object',
    properties: {
      saree: { type: 'string' },
      name: { type: 'string' },
      image: { type: 'string', nullable: true },
      price: { type: 'number' },
      quantity: { type: 'integer' },
    },
  },
  Order: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      orderNumber: { type: 'string' },
      user: { type: 'string' },
      items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
      shippingAddress: { $ref: '#/components/schemas/Address' },
      subtotal: { type: 'number' },
      discount: { type: 'number' },
      couponCode: { type: 'string', nullable: true },
      shippingFee: { type: 'number' },
      total: { type: 'number' },
      paymentMethod: { type: 'string', enum: ['COD', 'RAZORPAY'] },
      paymentStatus: { type: 'string', enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'] },
      orderStatus: {
        type: 'string',
        enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  CreateOrderInput: {
    type: 'object',
    required: ['items', 'addressId', 'paymentMethod'],
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          required: ['sareeId', 'quantity'],
          properties: {
            sareeId: { type: 'string' },
            quantity: { type: 'integer', minimum: 1 },
          },
        },
      },
      addressId: { type: 'string' },
      couponCode: { type: 'string' },
      paymentMethod: { type: 'string', enum: ['COD', 'RAZORPAY'] },
    },
  },
  UpdateOrderStatusInput: {
    type: 'object',
    required: ['orderStatus'],
    properties: {
      orderStatus: {
        type: 'string',
        enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      },
    },
  },
  OrderPaginated: {
    type: 'object',
    properties: {
      items: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
      meta: { $ref: '#/components/schemas/PaginationMeta' },
    },
  },
  Coupon: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      code: { type: 'string' },
      discountType: { type: 'string', enum: ['percentage', 'flat'] },
      discountValue: { type: 'number' },
      minimumOrderValue: { type: 'number' },
      maximumDiscount: { type: 'number', nullable: true },
      usageLimit: { type: 'integer', nullable: true },
      usedCount: { type: 'integer' },
      expiresAt: { type: 'string', format: 'date-time' },
      isActive: { type: 'boolean' },
    },
  },
  CouponInput: {
    type: 'object',
    required: ['code', 'discountType', 'discountValue', 'expiresAt'],
    properties: {
      code: { type: 'string' },
      discountType: { type: 'string', enum: ['percentage', 'flat'] },
      discountValue: { type: 'number' },
      minimumOrderValue: { type: 'number', default: 0 },
      maximumDiscount: { type: 'number', nullable: true },
      usageLimit: { type: 'integer', nullable: true },
      expiresAt: { type: 'string', format: 'date-time' },
      isActive: { type: 'boolean', default: true },
    },
  },
  ValidateCouponInput: {
    type: 'object',
    required: ['code', 'orderValue'],
    properties: {
      code: { type: 'string' },
      orderValue: { type: 'number' },
    },
  },
  Payment: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      order: { type: 'string' },
      user: { type: 'string' },
      provider: { type: 'string', enum: ['RAZORPAY', 'COD'] },
      providerOrderId: { type: 'string' },
      providerPaymentId: { type: 'string', nullable: true },
      amount: { type: 'number' },
      currency: { type: 'string', example: 'INR' },
      status: { type: 'string', enum: ['CREATED', 'PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'] },
    },
  },
  InitiatePaymentResult: {
    type: 'object',
    properties: {
      providerOrderId: { type: 'string' },
      amount: { type: 'number' },
      currency: { type: 'string' },
      keyId: { type: 'string' },
    },
  },
  VerifyPaymentInput: {
    type: 'object',
    required: ['providerOrderId', 'providerPaymentId', 'signature'],
    properties: {
      providerOrderId: { type: 'string' },
      providerPaymentId: { type: 'string' },
      signature: { type: 'string' },
    },
  },
  Review: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      user: { type: 'string' },
      saree: { type: 'string' },
      order: { type: 'string' },
      rating: { type: 'integer', minimum: 1, maximum: 5 },
      comment: { type: 'string' },
      images: { type: 'array', items: { type: 'string', format: 'uri' } },
      isApproved: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
    },
  },
  CreateReviewInput: {
    type: 'object',
    required: ['orderId', 'rating', 'comment'],
    properties: {
      orderId: { type: 'string' },
      rating: { type: 'integer', minimum: 1, maximum: 5 },
      comment: { type: 'string' },
      images: { type: 'array', items: { type: 'string', format: 'uri' } },
    },
  },
  ReviewPaginated: {
    type: 'object',
    properties: {
      items: { type: 'array', items: { $ref: '#/components/schemas/Review' } },
      meta: { $ref: '#/components/schemas/PaginationMeta' },
    },
  },
  DashboardStats: {
    type: 'object',
    properties: {
      totalOrders: { type: 'integer' },
      totalRevenue: { type: 'number' },
      lowStockCount: { type: 'integer' },
    },
  },
  UpdateUserStatusInput: {
    type: 'object',
    required: ['isActive'],
    properties: { isActive: { type: 'boolean' } },
  },
  UserPaginated: {
    type: 'object',
    properties: {
      items: { type: 'array', items: { $ref: '#/components/schemas/User' } },
      meta: { $ref: '#/components/schemas/PaginationMeta' },
    },
  },
} as const;

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Saree Ecommerce API',
    version: '1.0.0',
    description:
      'REST API backend for a Saree Ecommerce Platform. Framework-agnostic on the frontend side — ' +
      'the same API serves any UI design. All responses use the standard envelope ' +
      '`{ success, message, data }` on success or `{ success, message, error: { code } }` on failure.',
  },
  servers: [{ url: `/api/${env.apiVersion}`, description: 'Current server' }],
  tags: [
    { name: 'Auth', description: 'Registration, login, tokens' },
    { name: 'Users', description: 'Profile and saved addresses' },
    { name: 'Categories', description: 'Dynamic, DB-managed product categories' },
    { name: 'Sarees', description: 'Product catalog' },
    { name: 'Reviews', description: 'Ratings & reviews' },
    { name: 'Cart', description: 'Server-priced shopping cart' },
    { name: 'Wishlist', description: 'Saved-for-later sarees' },
    { name: 'Orders', description: 'Checkout and order tracking' },
    { name: 'Admin Orders', description: 'Admin order management' },
    { name: 'Payments', description: 'Provider-agnostic payment flow' },
    { name: 'Coupons', description: 'Discount codes' },
    { name: 'Admin', description: 'Dashboard, customers, review moderation' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas,
  },
} as const;

export const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: [
    'src/modules/**/*.routes.ts',
    'dist/modules/**/*.routes.js',
  ],
});
