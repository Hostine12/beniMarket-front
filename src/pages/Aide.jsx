import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag, Truck, Smartphone, AlertTriangle, User,
  ChevronDown, ChevronRight, Phone, Mail, MessageSquare
} from 'lucide-react'

const sections = [
  {
    id: 'commander',
    icon: ShoppingBag,
    title: 'Passer une commande',
    color: 'teal',
    questions: [
      {
        q: 'Comment passer une commande sur BeniMarket ?',
        a: 'Naviguez dans le catalogue, ajoutez les produits souhaités à votre panier, puis cliquez sur "Passer à la caisse". Vous devrez être connecté avec un compte client pour valider votre commande.',
      },
      {
        q: 'Puis-je modifier ma commande après validation ?',
        a: 'Non, une commande validée et payée ne peut pas être modifiée. Si vous avez une erreur, contactez-nous immédiatement via le formulaire de litige dans votre espace client.',
      },
      {
        q: 'Dans quelles zones BeniMarket livre-t-il ?',
        a: 'BeniMarket opère actuellement exclusivement à Parakou, Bénin. Tous les quartiers de Parakou sont desservis dans un délai de quelques heures.',
      },
      {
        q: 'Puis-je commander pour quelqu\'un d\'autre ?',
        a: 'Oui ! Lors du checkout, saisissez le nom et le numéro de téléphone du destinataire dans les informations de livraison. Le livreur le contactera directement.',
      },
    ],
  },
  {
    id: 'livraison',
    icon: Truck,
    title: 'Livraison & suivi',
    color: 'blue',
    questions: [
      {
        q: 'Quels sont les délais de livraison ?',
        a: 'La livraison est effectuée le jour même pour les commandes passées avant 16h. Un livreur est affecté dès que le vendeur confirme la préparation de votre colis.',
      },
      {
        q: 'Comment suivre ma commande ?',
        a: 'Rendez-vous dans "Mon espace" → "Mes commandes" → cliquez sur "Suivre". Vous verrez en temps réel l\'avancement : En attente, Confirmée, En préparation, En livraison, Livrée.',
      },
      {
        q: 'Qu\'est-ce que le code OTP de livraison ?',
        a: 'Lorsque le livreur arrive chez vous, il vous demandera de lui communiquer un code à 4 chiffres reçu par notification. Ce code confirme que vous avez bien reçu votre commande. Ne le partagez qu\'en main propre.',
      },
      {
        q: 'Combien coûte la livraison ?',
        a: 'Les frais de livraison sont calculés sur la base de 200 FCFA/km depuis la boutique vendeur jusqu\'à votre adresse. Le montant est affiché dans votre récapitulatif avant paiement.',
      },
    ],
  },
  {
    id: 'paiement',
    icon: Smartphone,
    title: 'Paiement Mobile Money',
    color: 'amber',
    questions: [
      {
        q: 'Quels opérateurs sont acceptés ?',
        a: 'BeniMarket accepte MTN Mobile Money, Moov Money et Celtiis Cash — les trois principaux opérateurs de Mobile Money au Bénin.',
      },
      {
        q: 'Mon paiement est-il sécurisé ?',
        a: 'Oui, les paiements sont traités par FedaPay, la solution de paiement de référence en Afrique de l\'Ouest. Vos données bancaires ne transitent jamais par nos serveurs.',
      },
      {
        q: 'Que faire si mon paiement échoue ?',
        a: 'Vérifiez que votre numéro Mobile Money est correct et que votre solde est suffisant. Si le problème persiste, essayez un autre opérateur ou contactez-nous.',
      },
      {
        q: 'Puis-je payer en espèces ?',
        a: 'Non, BeniMarket fonctionne uniquement en paiement Mobile Money pour garantir la traçabilité des transactions et la sécurité des vendeurs et clients.',
      },
    ],
  },
  {
    id: 'litiges',
    icon: AlertTriangle,
    title: 'Retours & litiges',
    color: 'red',
    questions: [
      {
        q: 'Que faire si je reçois un produit abîmé ou incorrect ?',
        a: 'Signalez un litige depuis votre espace client : "Mon espace" → "Signaler un litige". Décrivez le problème et sélectionnez la commande concernée. Notre équipe traite les litiges sous 24h.',
      },
      {
        q: 'Puis-je retourner un produit ?',
        a: 'Les produits frais (alimentaires) ne peuvent pas être retournés une fois livrés. Pour tout autre produit, contactez-nous dans les 48h suivant la livraison avec des photos du problème.',
      },
      {
        q: 'Combien de temps pour être remboursé ?',
        a: 'En cas de litige validé en votre faveur, le remboursement est effectué sur votre compte Mobile Money sous 48-72h ouvrées.',
      },
    ],
  },
  {
    id: 'compte',
    icon: User,
    title: 'Compte & inscription',
    color: 'violet',
    questions: [
      {
        q: 'Comment créer un compte client ?',
        a: 'Cliquez sur "Connexion" dans la barre de navigation, puis sur "Créer un compte". Saisissez votre nom, email ou téléphone, et choisissez un mot de passe. Votre compte est activé immédiatement.',
      },
      {
        q: 'J\'ai oublié mon mot de passe, que faire ?',
        a: 'Contactez notre support par email ou téléphone avec votre numéro ou email enregistré. Notre équipe vous aidera à réinitialiser votre accès.',
      },
      {
        q: 'Comment devenir vendeur sur BeniMarket ?',
        a: 'Créez un compte en sélectionnant le rôle "Vendeur". Votre dossier est examiné par notre équipe sous 72h. Une fois validé, créez votre boutique depuis votre espace et commencez à publier vos produits.',
      },
      {
        q: 'Comment devenir livreur sur BeniMarket ?',
        a: 'Inscrivez-vous avec le rôle "Livreur". Après validation de votre profil et de votre véhicule, vous pourrez accepter des missions directement depuis l\'application.',
      },
    ],
  },
]

const colorMap = {
  teal:   { bg: 'bg-teal-50',   text: 'text-teal-600',   border: 'border-teal-100',  ring: 'bg-teal-100',   grad: 'from-teal-500 to-emerald-500'  },
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-100',  ring: 'bg-blue-100',   grad: 'from-blue-500 to-cyan-500'     },
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-100', ring: 'bg-amber-100',  grad: 'from-amber-500 to-orange-500'  },
  red:    { bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-100',   ring: 'bg-red-100',    grad: 'from-red-500 to-rose-500'      },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100',ring: 'bg-violet-100', grad: 'from-violet-500 to-purple-500' },
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-ink-100 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
      >
        <span className={`text-sm font-semibold ${open ? 'text-teal-700' : 'text-ink-800'}`}>
          {question}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-ink-400 transition-transform ${open ? 'rotate-180 text-teal-600' : ''}`}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm text-ink-600 leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  )
}

export default function Aide() {
  return (
    <div className="max-shell container-px py-10">
      {/* En-tête */}
      <div className="mb-10 text-center">
        <nav className="mb-4 flex items-center justify-center gap-1.5 text-sm text-ink-400">
          <Link to="/" className="hover:text-ink-700">Accueil</Link>
          <ChevronRight size={14} />
          <span className="text-ink-700">Centre d'aide</span>
        </nav>
        <span className="badge-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
          Centre d'aide
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink-900 text-balance sm:text-4xl">
          Comment pouvons-nous vous aider ?
        </h1>
        <p className="mt-3 text-ink-500 max-w-xl mx-auto">
          Trouvez les réponses aux questions les plus fréquentes sur BeniMarket.
        </p>
      </div>

      {/* Raccourcis par section */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 mb-10">
        {sections.map(s => {
          const c = colorMap[s.color]
          const Icon = s.icon
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`group flex flex-col items-center gap-2 rounded-2xl border ${c.border} bg-white p-4 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card`}
            >
              <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${c.grad} text-white shadow-soft transition-transform duration-300 group-hover:scale-110`}>
                <Icon size={20} />
              </div>
              <span className="text-xs font-semibold text-ink-700 leading-tight">{s.title}</span>
            </a>
          )
        })}
      </div>

      {/* Sections FAQ */}
      <div className="space-y-6">
        {sections.map(s => {
          const c = colorMap[s.color]
          const Icon = s.icon
          return (
            <div key={s.id} id={s.id} className="card overflow-hidden scroll-mt-20">
              <div className={`flex items-center gap-3 px-6 py-4 border-b border-ink-100 ${c.bg}`}>
                <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${c.grad} text-white shadow-soft`}>
                  <Icon size={18} />
                </div>
                <h2 className="font-display font-bold text-ink-900">{s.title}</h2>
              </div>
              <div className="px-6">
                {s.questions.map((item, i) => (
                  <FaqItem key={i} question={item.q} answer={item.a} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Contact */}
      <div className="relative mt-10 overflow-hidden card bg-gradient-to-br from-teal-600 via-teal-600 to-emerald-600 p-8 text-center text-white">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="relative">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/20 ring-1 ring-white/25 backdrop-blur">
            <MessageSquare size={26} className="text-white" />
          </div>
          <h2 className="mb-2 font-display text-xl font-bold">Vous n'avez pas trouvé votre réponse ?</h2>
          <p className="mb-6 text-sm text-teal-100">Notre équipe est disponible du lundi au samedi, de 8h à 18h.</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="tel:+22921000000"
              className="flex items-center gap-2 rounded-2xl bg-white/15 px-5 py-3 text-sm font-semibold ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-white/25"
            >
              <Phone size={16} /> +229 21 00 00 00
            </a>
            <a
              href="mailto:contact@benimarket.bj"
              className="flex items-center gap-2 rounded-2xl bg-white/15 px-5 py-3 text-sm font-semibold ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-white/25"
            >
              <Mail size={16} /> contact@benimarket.bj
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
