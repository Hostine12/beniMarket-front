import { Link } from 'react-router-dom'
import {
  Store, TrendingUp, ShieldCheck, Smartphone, Users,
  Package, ChevronRight, Check, Star, ArrowRight
} from 'lucide-react'

const benefits = [
  {
    icon: TrendingUp,
    title: 'Augmentez vos ventes',
    desc: 'Accédez à une clientèle digitale à Parakou. Vos produits sont visibles 24h/24 sur notre plateforme.',
    color: 'teal',
  },
  {
    icon: Smartphone,
    title: 'Paiements Mobile Money',
    desc: 'Recevez vos paiements directement sur MTN, Moov ou Celtiis. Zéro manipulation d\'espèces.',
    color: 'amber',
  },
  {
    icon: Users,
    title: 'Livreurs disponibles',
    desc: 'Notre réseau de livreurs prend en charge la livraison chez vos clients. Vous n\'avez qu\'à préparer.',
    color: 'blue',
  },
  {
    icon: ShieldCheck,
    title: 'Paiement garanti',
    desc: 'Vous êtes payé dès la confirmation de la commande, avant même la livraison. Aucun risque d\'impayé.',
    color: 'emerald',
  },
]

const steps = [
  {
    num: '01',
    title: 'Créez votre compte vendeur',
    desc: 'Inscrivez-vous gratuitement en sélectionnant le rôle "Vendeur". Renseignez vos informations de contact.',
  },
  {
    num: '02',
    title: 'Validation par notre équipe',
    desc: 'Notre équipe examine votre dossier sous 72h et active votre compte. Vous recevez une notification.',
  },
  {
    num: '03',
    title: 'Créez votre boutique',
    desc: 'Depuis votre espace vendeur, créez votre boutique : nom, description, ville. En attente de validation admin.',
  },
  {
    num: '04',
    title: 'Publiez vos produits',
    desc: 'Ajoutez vos produits avec photos, descriptions et prix. Ils apparaissent immédiatement dans le catalogue.',
  },
  {
    num: '05',
    title: 'Recevez et préparez',
    desc: 'Lorsqu\'un client commande, vous êtes notifié. Préparez le colis, un livreur vient le récupérer.',
  },
  {
    num: '06',
    title: 'Soyez payé',
    desc: 'Le paiement Mobile Money est crédité sur votre compte une fois la livraison confirmée par OTP.',
  },
]

const testimonials = [
  {
    name: 'Maman Chantal',
    shop: 'Saveurs de Mama',
    text: 'Depuis que je vends sur BeniMarket, mes ventes de légumes ont doublé. Je n\'ai plus à attendre les clients au marché !',
    rating: 5,
  },
  {
    name: 'Tantie Reine',
    shop: 'Épices de Reine',
    text: 'Le paiement Mobile Money c\'est révolutionnaire. Je reçois mon argent directement, c\'est simple et sécurisé.',
    rating: 5,
  },
  {
    name: 'Maman Beni',
    shop: 'Beauté Naturelle',
    text: 'J\'ai lancé ma boutique de cosmétiques en 3 jours. L\'équipe BeniMarket m\'a accompagnée à chaque étape.',
    rating: 5,
  },
]

const colorMap = {
  teal:    { bg: 'from-teal-50 to-white',    icon: 'from-teal-500 to-emerald-500' },
  amber:   { bg: 'from-amber-50 to-white',   icon: 'from-amber-500 to-orange-500' },
  blue:    { bg: 'from-blue-50 to-white',    icon: 'from-blue-500 to-cyan-500'    },
  emerald: { bg: 'from-emerald-50 to-white', icon: 'from-emerald-500 to-teal-500' },
}

export default function Vendre() {
  return (
    <div className="max-shell container-px py-10 space-y-16">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 px-8 py-16 text-center text-white shadow-card ring-1 ring-ink-900/5">
        <div className="absolute -top-16 right-0 h-72 w-72 translate-x-16 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-16 left-0 h-64 w-64 -translate-x-12 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-white" /> Espace vendeurs · Parakou
          </span>
          <div className="mx-auto mt-5 grid h-16 w-16 place-items-center rounded-2xl bg-white/20 ring-1 ring-white/25 backdrop-blur">
            <Store size={32} className="text-white" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold leading-tight text-balance sm:text-5xl">
            Vendez sur BeniMarket
          </h1>
          <p className="mt-4 text-amber-100 max-w-xl mx-auto text-lg">
            Rejoignez des dizaines de commerçants de Parakou qui développent leurs ventes en ligne,
            sans frais d'entrée et avec paiement Mobile Money garanti.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/connexion"
              className="flex items-center gap-2 rounded-2xl bg-white text-amber-600 font-bold px-7 py-3.5 hover:bg-amber-50 transition-colors"
            >
              Créer mon compte vendeur <ArrowRight size={18} />
            </Link>
            <a
              href="#comment"
              className="flex items-center gap-2 rounded-2xl bg-white/20 hover:bg-white/30 font-semibold px-7 py-3.5 transition-colors"
            >
              Comment ça marche
            </a>
          </div>
          <p className="mt-4 text-xs text-amber-200">✓ Inscription gratuite · ✓ Aucune commission les 3 premiers mois · ✓ Support dédié</p>
        </div>
      </section>

      {/* Avantages */}
      <section>
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">
            Pourquoi vendre sur BeniMarket ?
          </h2>
          <p className="mt-2 text-ink-500 max-w-lg mx-auto">
            Une plateforme pensée pour les commerçants de Parakou, simple d'utilisation et rentable.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(b => {
            const c = colorMap[b.color]
            const Icon = b.icon
            return (
              <div key={b.title} className={`group card bg-gradient-to-br p-6 ${c.bg} transition-all duration-300 hover:-translate-y-1 hover:shadow-card`}>
                <div className={`mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${c.icon} text-white shadow-soft transition-transform duration-300 group-hover:scale-110`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-ink-900 mb-2">{b.title}</h3>
                <p className="text-sm text-ink-600 leading-relaxed">{b.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Étapes */}
      <section id="comment">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">
            Lancez-vous en 6 étapes
          </h2>
          <p className="mt-2 text-ink-500">De l'inscription à votre première vente, c'est simple.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.num} className="group card flex items-start gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-soft transition-transform duration-300 group-hover:scale-110">
                <span className="font-display text-sm font-bold">{s.num}</span>
              </div>
              <div>
                <h3 className="font-bold text-ink-900 text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-ink-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Témoignages */}
      <section>
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">
            Ce que disent nos vendeurs
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {testimonials.map(t => (
            <div key={t.name} className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
              <div className="flex gap-1 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={14} fill="#f59e0b" className="text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-ink-600 italic leading-relaxed mb-4">"{t.text}"</p>
              <div>
                <p className="font-bold text-ink-900 text-sm">{t.name}</p>
                <p className="text-xs text-ink-400">{t.shop}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tarifs */}
      <section>
        <div className="card overflow-hidden">
          <div className="px-8 py-6 border-b border-ink-100 text-center">
            <h2 className="font-display text-2xl font-bold text-ink-900">Tarifs transparents</h2>
            <p className="mt-1 text-ink-500 text-sm">Pas de surprises, pas de frais cachés.</p>
          </div>
          <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-ink-100">
            {[
              { label: 'Inscription', value: 'Gratuit', note: 'Pour toujours', highlight: false },
              { label: 'Commission BeniMarket', value: '15%', note: 'Par transaction réussie', highlight: true },
              { label: 'Frais livraison', value: '200 FCFA/km', note: 'À la charge du client', highlight: false },
            ].map(item => (
              <div key={item.label} className={`p-6 text-center ${item.highlight ? 'bg-amber-50' : ''}`}>
                <p className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2">{item.label}</p>
                <p className={`font-display text-3xl font-bold ${item.highlight ? 'text-amber-600' : 'text-ink-900'}`}>
                  {item.value}
                </p>
                <p className="text-xs text-ink-400 mt-1">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="text-center">
        <div className="inline-flex flex-col items-center gap-4 card px-10 py-10">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-soft">
            <Package size={30} />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink-900">
            Prêt à commencer ?
          </h2>
          <p className="text-ink-500 max-w-sm">
            Rejoignez la communauté BeniMarket et commencez à vendre vos produits à Parakou dès aujourd'hui.
          </p>
          <ul className="space-y-2 text-sm text-ink-600 text-left">
            {['Inscription gratuite en 2 minutes', 'Validation sous 72h', 'Support dédié par téléphone', 'Paiements mobiles sécurisés'].map(item => (
              <li key={item} className="flex items-center gap-2">
                <Check size={15} className="text-teal-600 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <Link to="/connexion" className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 transition hover:brightness-110">
            Créer mon compte vendeur <ChevronRight size={18} />
          </Link>
          <p className="text-xs text-ink-400">
            Déjà inscrit ?{' '}
            <Link to="/connexion" className="text-teal-600 hover:underline">Se connecter</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
