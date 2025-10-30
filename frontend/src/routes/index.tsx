import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { UserRole } from "../lib/types";


import { PublicLayout } from "../components/layout/PublicLayout";
import { CustomerLayout } from "../components/layout/CustomerLayout";
import { SellerLayout } from "../components/layout/SellerLayout";
import { AdminLayout } from "../components/layout/AdminLayout";
import { StaffLayout } from "../components/layout/StaffLayout";


import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";


import { HomePage } from "../pages/public/HomePage";
import { ProductListPage } from "../pages/public/ProductListPage";
import { ProductDetailPage } from "../pages/public/ProductDetailPage";


import { CustomerDashboard } from "../pages/customer/Dashboard";
import { CartPage } from "../pages/customer/CartPage";
import { CheckoutPage } from "../pages/customer/CheckoutPage";
import { CustomerOrdersPage } from "../pages/customer/OrdersPage";
import { CustomerOrderDetailPage } from "../pages/customer/OrderDetailPage";
import { CustomerProfilePage } from "../pages/customer/ProfilePage";


import { SellerDashboard } from "../pages/seller/Dashboard";
import { SellerProductsPage } from "../pages/seller/ProductsPage";
import { SellerOrdersPage } from "../pages/seller/OrdersPage";
import { SellerProfilePage } from "../pages/seller/ProfilePage";


import { AdminDashboard } from "../pages/admin/Dashboard";
import { AdminUsersPage } from "../pages/admin/UsersPage";
import { AdminProductsPage } from "../pages/admin/ProductsPage";
import { AdminOrdersPage } from "../pages/admin/OrdersPage";
import { AdminReviewsPage } from "../pages/admin/ReviewsPage";


import { StaffDashboard } from "../pages/staff/Dashboard";
import { StaffOrdersPage } from "../pages/staff/OrdersPage";

export const router = createBrowserRouter([
  // ===================================
  // PUBLIC ROUTES
  // ===================================
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "products",
        element: <ProductListPage />,
      },
      {
        path: "products/:slug",
        element: <ProductDetailPage />,
      },
    ],
  },

  // ===================================
  // AUTH ROUTES
  // ===================================
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

  // ===================================
  // CUSTOMER ROUTES
  // ===================================
  {
    path: "/customer",
    element: (
      <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
        <CustomerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <CustomerDashboard />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "orders",
        element: <CustomerOrdersPage />,
      },
      {
        path: "orders/:id",
        element: <CustomerOrderDetailPage />,
      },
      {
        path: "profile",
        element: <CustomerProfilePage />,
      },
    ],
  },

  // ===================================
  // SELLER ROUTES
  // ===================================
  {
    path: "/seller",
    element: (
      <ProtectedRoute allowedRoles={[UserRole.SELLER]}>
        <SellerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <SellerDashboard />,
      },
      {
        path: "products",
        element: <SellerProductsPage />,
      },
      {
        path: "orders",
        element: <SellerOrdersPage />,
      },
      {
        path: "profile",
        element: <SellerProfilePage />,
      },
    ],
  },

  // ===================================
  // ADMIN ROUTES
  // ===================================
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <AdminUsersPage />,
      },
      {
        path: "products",
        element: <AdminProductsPage />,
      },
      {
        path: "orders",
        element: <AdminOrdersPage />,
      },
      {
        path: "reviews",
        element: <AdminReviewsPage />,
      },
    ],
  },

  // ===================================
  // STAFF ROUTES
  // ===================================
  {
    path: "/staff",
    element: (
      <ProtectedRoute allowedRoles={[UserRole.STAFF]}>
        <StaffLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <StaffDashboard />,
      },
      {
        path: "orders",
        element: <StaffOrdersPage />,
      },
    ],
  },

  // ===================================
  // 404 NOT FOUND
  // ===================================
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);