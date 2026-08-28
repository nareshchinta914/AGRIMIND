import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Public Marketing Pages
import LandingPage from '../pages/LandingPage';
import AboutPage from '../pages/AboutPage';
import NotFoundPage from '../pages/NotFoundPage';

// Protected Tool Pages
import FeaturesPage from '../pages/FeaturesPage';
import AiAssistantPage from '../pages/AiAssistantPage';
import MarketplacePage from '../pages/MarketplacePage';

// Authentication Pages
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import VerifyPage from '../pages/VerifyPage';

// Farmer Suite Pages
import FarmerDashboard from '../pages/farmer/FarmerDashboard';
import FarmerProfilePage from '../pages/farmer/FarmerProfilePage';
import FarmerCropsPage from '../pages/farmer/FarmerCropsPage';
import FarmerWaterPage from '../pages/farmer/FarmerWaterPage';
import FarmerWeatherPage from '../pages/farmer/FarmerWeatherPage';
import FarmerCostPage from '../pages/farmer/FarmerCostPage';
import FarmerReportsPage from '../pages/farmer/FarmerReportsPage';
import FarmerActivitiesPage from '../pages/farmer/FarmerActivitiesPage';
import FarmerAssistantPage from '../pages/farmer/FarmerAssistantPage';
import FarmerMarketplacePage from '../pages/farmer/FarmerMarketplacePage';

// Customer Suite Pages
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import CustomerProductsPage from '../pages/customer/CustomerProductsPage';
import CustomerProductDetailPage from '../pages/customer/CustomerProductDetailPage';
import CustomerCartPage from '../pages/customer/CustomerCartPage';
import CustomerOrdersPage from '../pages/customer/CustomerOrdersPage';
import CustomerWishlistPage from '../pages/customer/CustomerWishlistPage';
import CustomerProfilePage from '../pages/customer/CustomerProfilePage';

// Merchant Suite Pages
import MerchantDashboard from '../pages/merchant/MerchantDashboard';
import MerchantProductsPage from '../pages/merchant/MerchantProductsPage';
import MerchantAddProductPage from '../pages/merchant/MerchantAddProductPage';
import MerchantEditProductPage from '../pages/merchant/MerchantEditProductPage';
import MerchantOrdersPage from '../pages/merchant/MerchantOrdersPage';
import MerchantSalesPage from '../pages/merchant/MerchantSalesPage';
import MerchantProfilePage from '../pages/merchant/MerchantProfilePage';

import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';
import { useAuth } from '../hooks/useAuth';

// Role-Aware Dashboard Redirector
const DynamicDashboardRedirector = () => {
  const { user } = useAuth();
  const role = (user?.role || 'FARMER').toUpperCase();
  if (role === 'MERCHANT') return <Navigate to="/merchant/dashboard" replace />;
  if (role === 'CUSTOMER') return <Navigate to="/customer/dashboard" replace />;
  return <Navigate to="/farmer/dashboard" replace />;
};

// Role-Aware Profile Redirector
const DynamicProfileRedirector = () => {
  const { user } = useAuth();
  const role = (user?.role || 'FARMER').toUpperCase();
  if (role === 'MERCHANT') return <Navigate to="/merchant/profile" replace />;
  if (role === 'CUSTOMER') return <Navigate to="/customer/profile" replace />;
  return <Navigate to="/farmer/profile" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. PUBLIC MARKETING PAGES */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/404" element={<NotFoundPage />} />

        {/* PROTECTED FEATURE & TOOL ROUTES (Requires Login/Signup) */}
        <Route
          path="/features"
          element={
            <ProtectedRoute>
              <FeaturesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <AiAssistantPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <MarketplacePage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 2. AUTHENTICATION PAGES */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify" element={<VerifyPage />} />
      </Route>

      {/* 3. FARMER DASHBOARD & SUITE */}
      <Route
        element={
          <RoleBasedRoute allowedRoles={['FARMER']}>
            <DashboardLayout />
          </RoleBasedRoute>
        }
      >
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/farmer/profile" element={<FarmerProfilePage />} />
        <Route path="/farmer/crops" element={<FarmerCropsPage />} />
        <Route path="/farmer/water" element={<FarmerWaterPage />} />
        <Route path="/farmer/weather" element={<FarmerWeatherPage />} />
        <Route path="/farmer/cost" element={<FarmerCostPage />} />
        <Route path="/farmer/reports" element={<FarmerReportsPage />} />
        <Route path="/farmer/activities" element={<FarmerActivitiesPage />} />
        <Route path="/farmer/assistant" element={<FarmerAssistantPage />} />
        <Route path="/farmer/marketplace" element={<FarmerMarketplacePage />} />
      </Route>

      {/* 4. CUSTOMER DASHBOARD & SUITE */}
      <Route
        element={
          <RoleBasedRoute allowedRoles={['CUSTOMER']}>
            <DashboardLayout />
          </RoleBasedRoute>
        }
      >
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/products" element={<CustomerProductsPage />} />
        <Route path="/customer/product/:id" element={<CustomerProductDetailPage />} />
        <Route path="/customer/cart" element={<CustomerCartPage />} />
        <Route path="/customer/orders" element={<CustomerOrdersPage />} />
        <Route path="/customer/wishlist" element={<CustomerWishlistPage />} />
        <Route path="/customer/profile" element={<CustomerProfilePage />} />
      </Route>

      {/* 5. MERCHANT DASHBOARD & SUITE */}
      <Route
        element={
          <RoleBasedRoute allowedRoles={['MERCHANT']}>
            <DashboardLayout />
          </RoleBasedRoute>
        }
      >
        <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
        <Route path="/merchant/products" element={<MerchantProductsPage />} />
        <Route path="/merchant/products/add" element={<MerchantAddProductPage />} />
        <Route path="/merchant/products/edit/:id" element={<MerchantEditProductPage />} />
        <Route path="/merchant/orders" element={<MerchantOrdersPage />} />
        <Route path="/merchant/sales" element={<MerchantSalesPage />} />
        <Route path="/merchant/profile" element={<MerchantProfilePage />} />
      </Route>

      {/* Generic Dynamic Dashboard Redirect Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DynamicDashboardRedirector />
          </ProtectedRoute>
        }
      />

      {/* Generic Dynamic Profile Redirect Route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DynamicProfileRedirector />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
