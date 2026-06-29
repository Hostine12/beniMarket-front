import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ShieldCheck, Truck, Star, Smartphone, CheckCircle2 } from 'lucide-react'

const popular = ['Tomates', 'Tissu Wax', 'Karité', 'Bissap', 'Riz local']

export default function Hero() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const go = (e) => {
    e.preventDefault()
    navigate(`/catalogue${q ? `?q=${encodeURIComponent(q)}` : ''}`)
  }

  return (
    <section className="relative overflow-hidden">
      {/* Image de fond plein cadre + dégradés pour la lisibilité du texte */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/hero-section.jpg"
          alt="Cliente enthousiaste commandant des produits frais du marché de Parakou depuis son téléphone"
          className="h-full w-full object-cover object-[68%_center]"
        />
        {/* Voile sombre : uniforme sur mobile, dégradé vers la gauche sur grand écran */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/60 to-ink-900/45 lg:bg-gradient-to-r lg:from-ink-900/92 lg:via-ink-900/55 lg:to-transparent" />
        {/* Halos colorés pour la profondeur */}
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
      </div>

      <div className="max-shell container-px flex min-h-[600px] items-center py-16 sm:min-h-[660px] lg:min-h-[86vh]">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
            🌿 100% local — Parakou, Bénin
          </span>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.04] text-white text-balance drop-shadow-sm sm:text-5xl lg:text-[3.75rem]">
            Achetez <span className="text-amber-400">frais</span>, payez en{' '}
            <span className="text-teal-300">Mobile&nbsp;Money</span>, recevez vite.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
            BeniMarket connecte les commerçants de confiance près de chez vous à des milliers de clients —
            des produits locaux de qualité, livrés à domicile en toute sécurité.
          </p>

          {/* Barre de recherche en verre */}
          <form onSubmit={go} className="mt-8 max-w-xl">
            <div className="flex items-center gap-2 rounded-2xl border border-white/30 bg-white/95 p-2 shadow-2xl backdrop-blur">
              <Search size={20} className="ml-2 text-ink-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="min-h-[44px] flex-1 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400"
                placeholder="Que recherchez-vous aujourd’hui ?"
                aria-label="Rechercher un produit"
              />
              <button type="submit" className="btn-accent shrink-0">
                Commander
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-white/60">Populaire :</span>
              {popular.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => navigate(`/catalogue?q=${encodeURIComponent(p)}`)}
                  className="rounded-full border border-white/25 bg-white/5 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur transition-colors hover:border-amber-400 hover:text-amber-300"
                >
                  {p}
                </button>
              ))}
            </div>
          </form>

          {/* Badges de confiance */}
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/90">
            <span className="flex items-center gap-2"><ShieldCheck size={18} className="text-teal-300" /> Vendeurs vérifiés</span>
            <span className="flex items-center gap-2"><Truck size={18} className="text-teal-300" /> Livraison 24h</span>
            <span className="flex items-center gap-2"><Star size={18} className="fill-amber-400 text-amber-400" /> 4,8/5 (8 200 avis)</span>
          </div>
        </div>
      </div>

      {/* Carte flottante — paiement (proche du téléphone de la cliente) */}
      <div className="pointer-events-none absolute right-6 top-24 hidden w-52 animate-fade-up rounded-2xl bg-white/95 p-3.5 shadow-2xl ring-1 ring-ink-900/5 backdrop-blur xl:block">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-700">
            <Smartphone size={20} />
          </span>
          <div className="leading-tight">
            <p className="text-xs text-ink-400">Paiement</p>
            <p className="text-sm font-bold text-ink-900">Mobile Money sécurisé</p>
          </div>
        </div>
      </div>

      {/* Carte flottante — commande confirmée */}
      <div className="pointer-events-none absolute bottom-8 right-6 hidden w-52 animate-fade-up rounded-2xl bg-white/95 p-3.5 shadow-2xl ring-1 ring-ink-900/5 backdrop-blur lg:block">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={20} />
          </span>
          <div className="leading-tight">
            <p className="text-xs text-ink-400">Commande confirmée</p>
            <p className="text-sm font-bold text-ink-900">En route · 30 min</p>
          </div>
        </div>
      </div>
    </section>
  )
}
