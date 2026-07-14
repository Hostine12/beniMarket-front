import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Bell, LogOut, Menu, X, ChevronLeft } from 'lucide-react'
import { getIcon } from '../ui/icons'
import Logo from '../ui/Logo'
import Avatar from '../ui/Avatar'
import { useAuth } from '../../context/AuthContext'

export default function DashboardLayout({ title, subtitle, navItems = [], accent = 'teal', children }) {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const onLogout = () => {
    logout()
    navigate('/')
  }

  const SidebarContent = () => (
    <>
      <div className="px-5 pb-2 pt-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = getIcon(item.icon)
          
          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive: navLinkActive }) => {
                const isCurrentActive = item.isActive !== undefined ? item.isActive : navLinkActive;
                
                return `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isCurrentActive
                    ? 'bg-teal-700 text-white shadow-soft'
                    : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                }`
              }}
            >
              <Icon size={18} strokeWidth={2} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
      <div className="border-t border-ink-200 p-3">
        <Link to="/" className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-600 hover:bg-ink-100">
          <ChevronLeft size={18} /> Retour à l'accueil
        </Link>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </div>
    </>
  )

  return (
    // AJOUT : overflow-x-hidden global pour tuer toute tentative de scroll horizontal sur l'application
    <div className="min-h-screen w-full overflow-x-hidden bg-ink-50 flex">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-ink-200 bg-white lg:flex">
        <SidebarContent />
      </aside>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[82%] animate-[fade-up_0.25s_ease] flex-col bg-white shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Conteneur de droite réajusté pour isoler le flux flex et empêcher les enfants de pousser les murs */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 w-full">
        {/* Topbar */}
        <header className="sticky top-0 z-20 shrink-0 border-b border-ink-200 bg-white/85 backdrop-blur-lg">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              onClick={() => setOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-xl text-ink-700 hover:bg-ink-100 lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-lg font-bold text-ink-900 sm:text-xl">{title}</h1>
              {subtitle && <p className="truncate text-xs text-ink-500 sm:text-sm">{subtitle}</p>}
            </div>
            <div className="ml-auto flex items-center gap-2 shrink-0">
              <button className="relative grid h-11 w-11 place-items-center rounded-xl text-ink-600 hover:bg-ink-100" aria-label="Notifications">
                <Bell size={20} />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
              </button>
              <div className="flex items-center gap-2.5 rounded-xl border border-ink-200 py-1.5 pl-1.5 pr-3 bg-white">
                <Avatar name={user?.name || '?'} role={user?.role} size="sm" rounded="rounded-lg" />
                <div className="hidden leading-tight sm:block max-w-[120px]">
                  <p className="text-sm font-semibold text-ink-900 truncate">{user?.name || 'Invité'}</p>
                  <p className="text-[11px] capitalize text-ink-400 truncate">{user?.role || 'visiteur'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 
          MODIFICATION STRATÉGIQUE ICI :
          - w-full max-w-full : Empêche le conteneur principal de dépasser de l'écran.
          - overflow-x-hidden : Élimine définitivement le scroll horizontal parasite.
          - box-border : S'assure que les paddings (px-4) ne gonflent pas la largeur totale.
        */}
        <main className="w-full max-w-full flex-1 px-4 py-6 sm:px-6 lg:px-8 box-border overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}