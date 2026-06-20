import React, {useEffect, useState} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import {useDispatch} from 'react-redux';
import {getProfile} from './store/slices/authSlice';
import {setPreloaderDone} from './store/slices/uiSlice';

// Layout
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';

// Pages - Customer
import HomePage from './pages/customer/HomePage';
import CollectionsPage from './pages/customer/CollectionsPage';
import ClothingPage from './pages/customer/ClothingPage';
import JewelleryPage from './pages/customer/JewelleryPage';
import BridalPage from './pages/customer/BridalPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import SearchResultsPage from './pages/customer/SearchResultsPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';
import AboutPage from './pages/customer/AboutPage';
import ContactPage from './pages/customer/ContactPage';
import LoginPage from './pages/customer/LoginPage';
import RegisterPage from './pages/customer/RegisterPage';
import ForgotPasswordPage from './pages/customer/ForgotPasswordPage';
import ResetPasswordPage from './pages/customer/ResetPasswordPage';
import ProfilePage from './pages/customer/ProfilePage';
import WishlistPage from './pages/customer/WishlistPage';
import PrivacyPage from './pages/customer/PrivacyPage';
import TermsPage from './pages/customer/TermsPage';
import ShippingPage from './pages/customer/ShippingPage';
import NotFoundPage from './pages/customer/NotFoundPage';
import CustomPage from './pages/customer/CustomPage';
import AccessoriesPage from './pages/customer/AccessoriesPage';

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBanners from './pages/admin/AdminBanners';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminUsers from './pages/admin/AdminUsers';

// Components
import Preloader from './components/common/Preloader';
import WhatsAppButton from './components/common/WhatsAppButton';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

// Backward-compatible redirect for old /order-success/:orderId links
function LegacyOrderSuccessRedirect () {
  const {orderId} = useParams ();
  return <Navigate to={`/order-confirmation/${orderId}`} replace />;
}

export default function App () {
  const dispatch = useDispatch ();
  const [showPreloader, setShowPreloader] = useState (true);

  useEffect (() => {
    const token = localStorage.getItem ('sk_token');
    if (token) dispatch (getProfile ());
    const timer = setTimeout (() => {
      setShowPreloader (false);
      dispatch (setPreloaderDone ());
    }, 2800);
    return () => clearTimeout (timer);
  }, []);

  if (showPreloader) return <Preloader />;

  return (
    <ErrorBoundary>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '13px',
              borderRadius: '0',
            },
            success: {iconTheme: {primary: '#C9A84C', secondary: '#fff'}},
          }}
        />
        <WhatsAppButton />
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="collections" element={<CollectionsPage />} />
            <Route path="collections/clothing" element={<ClothingPage />} />
            <Route path="collections/jewellery" element={<JewelleryPage />} />
            <Route path="collections/bridal" element={<BridalPage />} />
            <Route path="collections/custom" element={<CustomPage />} />
            <Route
              path="collections/accessories"
              element={<AccessoriesPage />}
            />
            <Route path="product/:slug" element={<ProductDetailPage />} />
            <Route path="search" element={<SearchResultsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route
              path="order-confirmation/:orderId"
              element={<OrderConfirmationPage />}
            />
            <Route
              path="order-success/:orderId"
              element={<LegacyOrderSuccessRedirect />}
            />
            <Route path="track-order" element={<OrderTrackingPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="reset-password/:token"
              element={<ResetPasswordPage />}
            />
            <Route path="privacy-policy" element={<PrivacyPage />} />
            <Route path="terms-conditions" element={<TermsPage />} />
            <Route path="shipping-policy" element={<ShippingPage />} />
            <Route
              path="profile"
              element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
            />
            <Route
              path="wishlist"
              element={<ProtectedRoute><WishlistPage /></ProtectedRoute>}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={<AdminRoute><AdminLayout /></AdminRoute>}
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<AdminAddProduct />} />
            <Route path="products/edit/:id" element={<AdminAddProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
