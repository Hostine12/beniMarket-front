import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Smartphone } from 'lucide-react'
import Logo from '../ui/Logo'

const cols = [
  {
    title: 'Marketplace',
    links: [
      { label: 'Catalogue',          to: '/catalogue' },
      { label: 'Catégories',         to: '/#categories' },
      { label: 'Vendeurs vérifiés',  to: '/catalogue?verified=1' },
      { label: 'Nouveautés',         to: '/catalogue?sort=new' },
    ],
  },
  {
    title: 'Vendre & Livrer',
    links: [
      { label: 'Devenir vendeur',  to: '/vendre' },
      { label: 'Devenir livreur', to: '/connexion' },
      { label: 'Espace vendeur',  to: '/vendeur' },
      { label: 'Espace livreur',  to: '/livreur' },
    ],
  },
  {
    title: 'Aide',
    links: [
      { label: 'Centre d\'aide',          to: '/aide' },
      { label: 'Comment ça marche',       to: '/#comment' },
      { label: 'Paiement Mobile Money',   to: '/aide#paiement' },
      { label: 'Suivi de commande',       to: '/aide#livraison' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-200 bg-black/10">
      <div className="max-shell container-px py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500">
              La marketplace qui rapproche les commerçants de votre quartier de vous. Achetez frais,
              payez en Mobile Money, recevez en un éclair.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="#" className="h-9 w-9 grid place-items-center rounded-xl bg-ink-100 text-ink-500 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="h-9 w-9 grid place-items-center rounded-xl bg-ink-100 text-ink-500 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="h-9 w-9 grid place-items-center rounded-xl bg-ink-100 text-ink-500 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-display text-sm font-bold text-ink-900">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-ink-500 transition-colors hover:text-teal-700">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 rounded-2xl bg-ink-50 p-5 sm:grid-cols-3">
          <a href="tel:+22921000000" className="flex items-center gap-2.5 text-sm text-ink-600 hover:text-teal-700">
            <Phone size={16} className="text-teal-700 shrink-0" /> +229 21 00 00 00
          </a>
          <a href="mailto:contact@marketplace.bj" className="flex items-center gap-2.5 text-sm text-ink-600 hover:text-teal-700">
            <Mail size={16} className="text-teal-700 shrink-0" /> contact@marketplace.bj
          </a>
          <span className="flex items-center gap-2.5 text-sm text-ink-600">
            <MapPin size={16} className="text-teal-700 shrink-0" /> Parakou, Bénin
          </span>
        </div>
      </div>

      <div className="border-t border-ink-200">
        <div className="max-shell container-px flex flex-col items-center justify-between gap-3 py-5 text-sm text-ink-400 sm:flex-row">
          <p>© {new Date().getFullYear()} BeniMarket. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <Link to="/aide" className="hover:text-teal-600 transition-colors">Centre d'aide</Link>
            <span className="flex items-center gap-1.5">
              <Smartphone size={14} /> Paiements sécurisés Celtis, MTN & Moov
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
