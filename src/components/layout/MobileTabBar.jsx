import { NavLink } from 'react-router-dom'
import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth, ROLES } from '../../context/AuthContext'

// Barre d'onglets façon application mobile (cachée sur ≥ lg).
export default function MobileTabBar() {
  const { totals } = useCart()
  const { user } = useAuth()
  const account = user ? ROLES[user.role]?.dashboard || '/compte' : '/connexion'

  const tabs = [
    { to: '/', label: 'Accueil', icon: Home, end: true },
    { to: '/catalogue', label: 'Catalogue', icon: LayoutGrid },
    { to: '/panier', label: 'Panier', icon: ShoppingBag, badge: totals.count },
    { to: account, label: 'Compte', icon: User },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-200 bg-white/95 backdrop-blur-lg lg:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
                isActive ? 'text-teal-700' : 'text-ink-400'
              }`
            }
          >
            <span className="relative">
              <Icon size={22} strokeWidth={2} />
              {badge > 0 && (
                <span className="absolute -right-2 -top-1.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-ink-900">
                  {badge}
                </span>
              )}
            </span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
