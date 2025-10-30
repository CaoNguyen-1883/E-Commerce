// ============================================
// COMMON TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
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
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  SELLER = "SELLER",
  STAFF = "STAFF",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BANNED = "BANNED",
}

export interface User {
  id: number;
  email: string;
  username: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ============================================
// PRODUCT TYPES
// ============================================

export enum ProductStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  OUT_OF_STOCK = "OUT_OF_STOCK",
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  slug: string;
  parentId?: number;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: number;
  sku: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  reservedQuantity: number;
  soldQuantity: number;
  weight?: number;
  imageUrl?: string;
  attributes: Record<string, string>; // e.g., {color: "Red", size: "XL"}
  isActive: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  categoryId: number;
  categoryName: string;
  sellerId: number;
  sellerName: string;
  status: ProductStatus;
  averageRating: number;
  totalReviews: number;
  totalSold: number;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  shortDescription?: string;
  categoryId: number;
  status: ProductStatus;
  images: { imageUrl: string; displayOrder: number; isPrimary: boolean }[];
  variants: {
    sku: string;
    name: string;
    price: number;
    compareAtPrice?: number;
    stockQuantity: number;
    weight?: number;
    imageUrl?: string;
    attributes: Record<string, string>;
  }[];
}

// ============================================
// CART TYPES
// ============================================

export interface CartItem {
  id: number;
  variantId: number;
  productId: number;
  productName: string;
  variantName: string;
  variantSku: string;
  variantImageUrl?: string;
  price: number;
  quantity: number;
  maxQuantity: number; // Available stock
  subtotal: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  updatedAt: string;
}

export interface AddToCartRequest {
  variantId: number;
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

export interface ProductFilterParams {
  categoryId?: number;
  sellerId?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: ProductStatus;
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
}

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