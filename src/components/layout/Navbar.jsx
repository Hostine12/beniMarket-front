import { useState, useEffect } from 'react' // 1. On ajoute useEffect
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom' // 2. On ajoute useLocation
import { Search, ShoppingBag, Menu, X, User, MapPin } from 'lucide-react'
import Logo from '../ui/Logo'
import { useCart } from '../../context/CartContext'
import { useAuth, ROLES } from '../../context/AuthContext'

const links = [
  { to: '/catalogue',  label: 'Catalogue' },
  { to: '/#categories', label: 'Catégories' },
  { to: '/vendre',     label: 'Vendre' },
  { to: '/aide',       label: 'Aide' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const { totals } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() // Permet de surveiller les changements d'URL et d'ancres

  // 3. Gestionnaire automatique de défilement pour les ancres (#)
  useEffect(() => {
    if (location.hash) {
      // On récupère l'élément HTML qui a l'ID correspondant (ex: #categories -> id="categories")
      const element = document.getElementById(location.hash.slice(1))
      if (element) {
        // Petit délai de 100ms pour laisser le temps à la page de se charger si on vient d'une autre page
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    }
  }, [location]) // S'exécute à chaque fois que l'URL ou l'ancre change

  const submit = (e) => {
    e.preventDefault()
    navigate(`/catalogue${q ? `?q=${encodeURIComponent(q)}` : ''}`)
    setOpen(false)
  }

  const accountLink = user ? ROLES[user.role]?.dashboard || '/compte' : '/connexion'

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/70 bg-white/85 backdrop-blur-lg">
      <div className="max-shell container-px">
        <div className="flex h-16 items-center gap-3 lg:gap-6">
          <Logo />

          {/* Recherche desktop */}
          <form onSubmit={submit} className="relative hidden flex-1 md:block">
            <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="input pl-10 pr-24"
              placeholder="Rechercher un produit, un vendeur…"
              aria-label="Rechercher"
            />
            <button type="submit" className="btn-primary btn-sm absolute right-1.5 top-1/2 -translate-y-1/2">
              Chercher
            </button>
          </form>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    // On n'active le style vert "isActive" pour les ancres que si on est sur la page d'accueil
                    isActive && !l.to.includes('#') 
                      ? 'text-teal-700' 
                      : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
            <Link
              to="/panier"
              className="relative grid h-11 w-11 place-items-center rounded-xl text-ink-700 transition-colors hover:bg-ink-100"
              aria-label={`Panier, ${totals.count} article(s)`}
            >
              <ShoppingBag size={21} />
              {totals.count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-amber-500 px-1 text-[11px] font-bold text-ink-900">
                  {totals.count}
                </span>
              )}
            </Link>

            <Link to={accountLink} className="btn-primary btn-sm hidden sm:inline-flex">
              <User size={16} />
              {user ? 'Mon espace' : 'Connexion'}
            </Link>

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="grid h-11 w-11 place-items-center rounded-xl text-ink-700 transition-colors hover:bg-ink-100 lg:hidden"
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Recherche mobile */}
        <form onSubmit={submit} className="relative pb-3 md:hidden">
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="input pl-10"
            placeholder="Rechercher sur BeniMarket…"
            aria-label="Rechercher"
          />
        </form>
      </div>

      {/* Menu mobile déroulant */}
      {open && (
        <div className="animate-fade-in border-t border-ink-200/70 bg-white lg:hidden">
          <nav className="max-shell container-px flex flex-col py-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-ink-700 hover:bg-ink-100"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to={accountLink}
              onClick={() => setOpen(false)}
              className="btn-primary mt-2"
            >
              <User size={16} /> {user ? 'Mon espace' : 'Connexion / Inscription'}
            </Link>
            <p className="mt-3 flex items-center gap-1.5 px-3 pb-1 text-xs text-ink-400">
              <MapPin size={13} /> Livraison exclusivement à Parakou
            </p>
          </nav>
        </div>
      )}
    </header>
  )
}