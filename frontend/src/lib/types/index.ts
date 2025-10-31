// ============================================
// COMMON TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
  statusCode?: number;
  timestamp?: string;
  path?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// ============================================
// USER & AUTH TYPES
// ============================================

export enum UserRole {
  ROLE_ADMIN = "ROLE_ADMIN",
  ROLE_CUSTOMER = "ROLE_CUSTOMER",
  ROLE_SELLER = "ROLE_SELLER",
  ROLE_STAFF = "ROLE_STAFF",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BANNED = "BANNED",
}

export interface User {
  id: string; // UUID
  email: string;
  fullName: string;
  avatarUrl?: string;
  roles: string[]; // Array of role names
  emailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  expectedRole?: string; // NEW - Optional
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string; // Changed from phoneNumber, optional
  // Removed: username, role (backend auto-assigns ROLE_CUSTOMER)
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ============================================
// PRODUCT TYPES
// ============================================

export enum ProductStatus {
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  INACTIVE = "INACTIVE",
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  imageUrl?: string;
  parentId?: string;
  parentName?: string;       
  children?: Category[];      
  displayOrder?: number;     
  createdAt?: string;         
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  slug: string;
  logoUrl?: string;
  website?: string;          
  countryOfOrigin?: string;  
  isFeatured?: boolean;     
  createdAt?: string;       
}

export interface ProductImage {
  id: string;
  imageUrl: string;     
  altText?: string;      
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;                       
  stock: number;                        
  availableStock: number;              
  specifications?: Record<string, any>; 
  attributes: Record<string, any>;     
  isDefault: boolean;                  
}

// For Product List (summary)
export interface ProductSummary {
  id: string; // UUID
  name: string;
  slug: string;
  shortDescription?: string;
  categoryName: string;
  brandName: string;
  basePrice: number;
  minPrice: number;
  maxPrice: number;
  status: ProductStatus;
  primaryImage: string;
  averageRating: number;
  totalReviews: number;
  totalStock: number;
  hasStock: boolean;
}

// For Product Detail
export interface Product {
  id: string; // UUID
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: Category;
  brand: Brand;
  sellerId: string;
  sellerName: string;
  basePrice: number;
  status: ProductStatus;
  tags: string[];
  viewCount: number;
  purchaseCount: number;
  averageRating: number;
  totalReviews: number;
  totalStock: number;
  variants: ProductVariant[];
  images: ProductImage[];
  createdAt: string;
  approvedAt?: string;
}

export interface ProductFilterParams {
  keyword?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ProductStatus;
  page?: number;
  size?: number;
  sort?: string;
}


// ============================================
// CART TYPES
// ============================================

export interface CartItem {
  id: string;                 
  variantId: string;          
  variantSku: string;
  variantName: string;
  productName: string;
  productId: string;          
  productSlug: string;        
  primaryImage: string;       
  priceAtAdd: number;          
  quantity: number;
  subtotal: number;
  availableStock: number;      
  isAvailable: boolean;       
}

export interface Cart {
  id: string;                 
  userId: string;              
  items: CartItem[];
  totalItems: number;
  totalPrice: number;         
  updatedAt: string;
}
export interface AddToCartRequest {
  variantId: string;         
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// ============================================
// ORDER TYPES
// ============================================

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  COD = "COD",
  BANK_TRANSFER = "BANK_TRANSFER",
  CREDIT_CARD = "CREDIT_CARD",
  E_WALLET = "E_WALLET",
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  variantId: number;
  variantName: string;
  variantSku: string;
  variantImageUrl?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  userFullName: string;
  userEmail: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: string;
  shippingPhone: string;
  shippingName: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  note?: string;
  items: OrderItem[];
  createdAt: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

export interface CreateOrderRequest {
  shippingAddress: string;
  shippingPhone: string;
  shippingName: string;
  paymentMethod: PaymentMethod;
  note?: string;
}

export interface CancelOrderRequest {
  orderId: number;
  reason: string;
}

// ============================================
// REVIEW TYPES
// ============================================

export enum ReviewStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface ReviewImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
}

export interface Review {
  id: number;
  productId: number;
  productName: string;
  userId: number;
  userName: string;
  userAvatarUrl?: string;
  rating: number;
  title: string;
  comment: string;
  images: ReviewImage[];
  isVerifiedPurchase: boolean;
  status: ReviewStatus;
  helpfulCount: number;
  isHelpfulByCurrentUser?: boolean;
  sellerReply?: string;
  sellerRepliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  productId: number;
  rating: number;
  title: string;
  comment: string;
  images?: { imageUrl: string; displayOrder: number }[];
}

export interface UpdateReviewRequest {
  rating: number;
  title: string;
  comment: string;
  images?: { imageUrl: string; displayOrder: number }[];
}

export interface ReviewFilterParams {
  productId?: number;
  userId?: number;
  rating?: number;
  status?: ReviewStatus;
  isVerifiedPurchase?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

// ============================================
// STATISTICS TYPES (for Admin/Seller)
// ============================================

export interface RevenueStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  period: string;
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;
  totalVariants: number;
}

export interface OrderStats {
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

// ============================================
// FILTER & SEARCH PARAMS
// ============================================

// export interface ProductFilterParams {
//   categoryId?: number;
//   sellerId?: number;
//   minPrice?: number;
//   maxPrice?: number;
//   status?: ProductStatus;
//   search?: string;
//   page?: number;
//   size?: number;
//   sort?: string;
// }

export interface OrderFilterParams {
  userId?: number;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
  sort?: string;
}