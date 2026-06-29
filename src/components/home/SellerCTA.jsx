import { Link } from 'react-router-dom'
import { Store, Bike, ArrowRight, Check } from 'lucide-react'
import SmartImage from '../ui/SmartImage'

export default function SellerCTA() {
  return (
    <section className="py-16 lg:py-20">
      <div className="max-shell container-px">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Vendeur */}
          <div className="group relative overflow-hidden rounded-4xl bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 p-8 text-white shadow-card ring-1 ring-ink-900/5 sm:p-10">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl transition-transform duration-500 group-hover:scale-125" />
            <div className="absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-amber-400/20 blur-3xl" />
            <div className="relative">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
                <Store size={24} />
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold sm:text-3xl">Devenez vendeur sur BeniMarket</h3>
              <p className="mt-3 max-w-md text-teal-50">
                Ouvrez votre boutique en ligne en quelques minutes et touchez des milliers de clients
                dans votre ville.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-teal-50">
                {['Inscription gratuite', 'Paiements Mobile Money sécurisés', 'Gestion simple du stock'].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-white/15">
                      <Check size={13} className="text-amber-300" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/connexion" className="btn-accent mt-7 transition-transform hover:-translate-y-0.5">
                Ouvrir ma boutique <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Livreur */}
          <div className="group relative overflow-hidden rounded-4xl bg-ink-900 p-8 text-white shadow-card ring-1 ring-ink-900/5 sm:p-10">
            <SmartImage
              id="photo-1558981403-c5f9899a28bc"
              alt="Livreur à moto en ville"
              w={700}
              h={500}
              className="absolute inset-0 h-full w-full opacity-25 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/70 to-ink-900/30" />
            <div className="absolute -right-12 -bottom-12 h-52 w-52 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="relative">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-ink-900 shadow-soft">
                <Bike size={24} />
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold sm:text-3xl">Roulez avec BeniMarket</h3>
              <p className="mt-3 max-w-md text-ink-200">
                Devenez livreur partenaire, choisissez vos courses et gagnez un revenu flexible à
                votre rythme.
              </p>
              <Link to="/connexion" className="btn-outline mt-7 border-white/30 bg-white/10 text-white backdrop-blur transition-transform hover:-translate-y-0.5 hover:bg-white/20">
                Devenir livreur <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
