import { Search, Smartphone, Truck } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Choisissez vos produits',
    desc: 'Parcourez les étals de centaines de vendeurs vérifiés et remplissez votre panier en quelques clics.',
    tint: 'from-teal-500 to-emerald-500',
    glow: 'bg-teal-500/15',
  },
  {
    icon: Smartphone,
    title: 'Payez en Mobile Money',
    desc: 'Réglez en toute sécurité avec MTN ou Moov Money. Aucune carte bancaire requise.',
    tint: 'from-amber-500 to-orange-500',
    glow: 'bg-amber-500/15',
  },
  {
    icon: Truck,
    title: 'Recevez à domicile',
    desc: 'Un livreur vous apporte votre commande et la confirme avec un code OTP. Simple et sûr.',
    tint: 'from-plum-600 to-violet-500',
    glow: 'bg-plum-500/15',
  },
]

export default function HowItWorks() {
  return (
    <section id="comment" className="relative scroll-mt-20 overflow-hidden py-16 lg:py-24">
      {/* Fond dégradé doux */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-ink-50/50 to-white" />
      <div className="absolute left-1/2 top-1/3 -z-10 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-teal-100/40 blur-3xl" />

      <div className="max-shell container-px">
        <div className="mx-auto max-w-2xl text-center">
          <span className="badge-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
            Simple comme bonjour
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink-900 text-balance sm:text-4xl">
            Comment ça marche ?
          </h2>
          <p className="mt-3 text-ink-500">
            De la recherche à la livraison, BeniMarket rend le commerce local fluide et rassurant.
          </p>
        </div>

        <div className="relative mt-14 grid gap-6 md:grid-cols-3">
          {/* Ligne de connexion (desktop) */}
          <div className="absolute left-[16.66%] right-[16.66%] top-12 hidden border-t-2 border-dashed border-ink-200 md:block" />

          {steps.map((s, i) => (
            <div
              key={s.title}
              className="group relative overflow-hidden rounded-3xl border border-ink-100 bg-white/80 p-7 text-center shadow-soft backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card"
            >
              <div className={`pointer-events-none absolute -top-6 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full ${s.glow} blur-2xl`} />
              <div className={`relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${s.tint} text-white shadow-soft transition-transform duration-300 group-hover:scale-105`}>
                <s.icon size={26} />
                <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-sm font-bold text-ink-900 shadow-card ring-1 ring-ink-900/5">
                  {i + 1}
                </span>
              </div>
              <h3 className="relative mt-5 font-display text-lg font-bold text-ink-900">{s.title}</h3>
              <p className="relative mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
