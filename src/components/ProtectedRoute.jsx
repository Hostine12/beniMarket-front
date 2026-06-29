import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const dashboardByRole = {
  client:  '/compte',
  vendor:  '/vendeur',
  courier: '/livreur',
  admin:   '/admin',
}

const loginByRole = {
  admin: '/admin/login',
}

export default function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth()
  const location = useLocation()

  // Non connecté → redirection vers la page de connexion appropriée
  if (!user) {
    const loginPath = loginByRole[allowedRole] || '/connexion'
    return <Navigate to={loginPath} state={{ from: location.pathname }} replace />
  }

  // Connecté mais mauvais rôle → redirection vers son propre dashboard
  if (allowedRole && user.role !== allowedRole) {
    const ownDashboard = dashboardByRole[user.role] || '/compte'
    return <Navigate to={ownDashboard} replace />
  }

  return children
}
