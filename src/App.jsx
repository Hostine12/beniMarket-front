import { Routes, Route } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderTracking from './pages/OrderTracking'
import ShopPage from './pages/ShopPage'
import Aide from './pages/Aide'
import Vendre from './pages/Vendre'
import CategorySellers from './pages/CategorySellers'
import ResetPassword from './pages/ResetPassword'
import ClientDashboard from './pages/dashboard/ClientDashboard'
import VendorDashboard from './pages/dashboard/VendorDashboard'
import CourierSpace from './pages/dashboard/CourierSpace'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLogin from './pages/dashboard/AdminLogin'

export default function App() {
  return (
    <Routes>
      {/* Authentification — plein écran, hors layout public */}
      <Route path="/connexion" element={<Auth />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Tableaux de bord — protégés par rôle */}
      <Route
        path="/compte"
        element={
          <ProtectedRoute allowedRole="client">
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendeur"
        element={
          <ProtectedRoute allowedRole="vendor">
            <VendorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/livreur"
        element={
          <ProtectedRoute allowedRole="courier">
            <CourierSpace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Réinitialisation de mot de passe — plein écran */}
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Boutique publique BeniMarket */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalogue" element={<Catalog />} />
        <Route path="/produit/:id" element={<ProductDetail />} />
        <Route path="/boutique/:id" element={<ShopPage />} />
        <Route path="/categorie/:id/vendeurs" element={<CategorySellers />} />
        <Route path="/panier" element={<Cart />} />
        <Route path="/paiement" element={<Checkout />} />
        <Route path="/suivi/:id" element={<OrderTracking />} />
        <Route path="/aide" element={<Aide />} />
        <Route path="/vendre" element={<Vendre />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
