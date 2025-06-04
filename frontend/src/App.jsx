import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout'; // Create this layout

// Public Pages
import HomePage from './pages/HomePage'; // Create this page
import CategoriesPage from './pages/CategoriesPage'; // Create this page
import ProductDetailPage from './pages/ProductDetailPage'; // Create this page
import CartPage from './pages/CartPage'; // Create this page
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
// import AboutPage from './pages/AboutPage'; // Create if needed
// import ContactPage from './pages/ContactPage'; // Create if needed
import NotFoundPage from './pages/NotFoundPage'; // Import the new NotFoundPage

// Admin Pages
import AdminDashboardPage from './pages/Admin/AdminDashboardPage'; // Create this page
import ManageCategoriesPage from './pages/Admin/ManageCategoriesPage';
import ManageProductsPage from './pages/Admin/ManageProductsPage';
// import ManageUsersPage from './pages/Admin/ManageUsersPage'; // Create if needed

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>; // Or a loading spinner component
  }

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.isAdmin) {
    // Logged in but not admin, trying to access admin route
    return <Navigate to="/" replace />; // Redirect to home or an unauthorized page
  }

  return children;
};

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Public Routes using MainLayout */}
        <Route path="" element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/categorias" element={<CategoriesPage />} />
          <Route path="produto/:id" element={<ProductDetailPage />} />
          <Route path="carrinho" element={<CartPage />} />
          {/* <Route path="sobre" element={<AboutPage />} /> */}
          {/* <Route path="contato" element={<ContactPage />} /> */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Admin Routes using AdminLayout */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout /> {/* Create AdminLayout component */} 
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="categorias" element={<ManageCategoriesPage />} />
          <Route path="produtos" element={<ManageProductsPage />} />
          {/* <Route path="usuarios" element={<ManageUsersPage />} /> */}
        </Route>

        {/* Catch-all or Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

// Wrap AppRouter with AuthProvider in main.jsx or App.jsx
export default AppRouter;

