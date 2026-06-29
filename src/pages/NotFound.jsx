import { Link, useNavigate } from 'react-router-dom'
import { Home, Search, ArrowLeft, ShoppingBag, HelpCircle } from 'lucide-react'

const suggestions = [
  { to: '/catalogue', icon: ShoppingBag, label: 'Catalogue',     tint: 'from-teal-500 to-emerald-500' },
  { to: '/connexion', icon: Search,      label: 'Mon compte',    tint: 'from-amber-500 to-orange-500' },
  { to: '/aide',      icon: HelpCircle,  label: "Centre d'aide", tint: 'from-plum-600 to-violet-500'  },
]

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="relative overflow-hidden">
      {/* Halos décoratifs */}
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-teal-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl" />

      <div className="relative max-shell container-px flex min-h-[78vh] flex-col items-center justify-center py-20 text-center">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="select-none bg-gradient-to-br from-teal-600 via-emerald-500 to-amber-500 bg-clip-text font-display text-[120px] font-extrabold leading-none text-transparent sm:text-[170px]">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid h-24 w-24 place-items-center rounded-3xl bg-white/80 shadow-card ring-1 ring-ink-900/5 backdrop-blur">
              <Search size={40} className="text-teal-600" />
            </div>
          </div>
        </div>

        <h1 className="font-display text-2xl font-bold text-ink-900 text-balance sm:text-3xl">
          Page introuvable
        </h1>
        <p className="mt-3 max-w-md leading-relaxed text-ink-500">
          La page que vous cherchez n'existe pas, a été déplacée ou l'adresse a peut-être été mal saisie.
        </p>

        {/* Actions principales */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-ghost flex items-center gap-2">
            <ArrowLeft size={17} /> Retour
          </button>
          <Link to="/" className="btn-primary flex items-center gap-2 transition-transform hover:-translate-y-0.5">
            <Home size={17} /> Accueil
          </Link>
        </div>

        {/* Suggestions */}
        <div className="mt-12 w-full max-w-md">
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-400">Peut-être cherchez-vous…</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {suggestions.map(({ to, icon: Icon, label, tint }) => (
              <Link
                key={to}
                to={to}
                className="group flex flex-col items-center gap-2.5 rounded-2xl border border-ink-100 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <span className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${tint} text-white shadow-soft transition-transform duration-300 group-hover:scale-110`}>
                  <Icon size={20} />
                </span>
                <span className="text-sm font-semibold text-ink-700">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
