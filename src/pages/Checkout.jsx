import { useState, useEffect } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import {
  MapPin, Smartphone, Check, ChevronLeft, ShieldCheck, Loader2,
  Truck, Phone, Navigation, LockKeyhole, Download
} from 'lucide-react'

import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { formatXOF, validateBeninPhone, formatPhoneInput, getPhoneError } from '../utils/format'
import api from '../api/axios'
import GoogleMapPicker, { googleReverseGeocode } from '../components/maps/GoogleMapPicker'

const PARAKOU_CENTER = { lat: 9.3371, lng: 2.6303 }
const steps = ['Livraison', 'Paiement', 'Confirmation']

function MtnLogo() {
  return <img src="/mtn-momo-mobile-money-uganda-logo-png_seeklogo-556395.png" alt="MTN MoMo" className="h-8 w-auto object-contain" />
}

function MoovLogo() {
  return <img src="/moov.png" alt="Moov Money" className="h-8 w-auto object-contain" />
}

function CeltiisLogo() {
  return <img src="/celtis.png" alt="Celtiis Cash" className="h-8 w-auto object-contain" />
}

const operators = [
  { id: 'mtn',     name: 'MTN MoMo',     Logo: MtnLogo    },
  { id: 'moov',    name: 'Moov Money',   Logo: MoovLogo   },
  { id: 'celtiis', name: 'Celtiis Cash', Logo: CeltiisLogo },
]

// Confettis décoratifs de la page de confirmation (couleurs de la charte).
const CONFETTI = [
  { c: 'bg-teal-400',    s: 'h-2 w-2 rounded-sm',     l: '10%', t: '24%', r: 18  },
  { c: 'bg-amber-400',   s: 'h-2.5 w-2.5 rounded-full', l: '86%', t: '18%', r: 0   },
  { c: 'bg-emerald-400', s: 'h-2 w-3 rounded-sm',     l: '20%', t: '42%', r: -22 },
  { c: 'bg-violet-400',  s: 'h-2 w-2 rounded-full',   l: '78%', t: '44%', r: 0   },
  { c: 'bg-amber-300',   s: 'h-1.5 w-4 rounded-full', l: '6%',  t: '14%', r: 35  },
  { c: 'bg-teal-500',    s: 'h-2.5 w-2.5 rounded-sm', l: '92%', t: '34%', r: 14  },
  { c: 'bg-rose-400',    s: 'h-2 w-2 rounded-full',   l: '15%', t: '9%',  r: 0   },
  { c: 'bg-emerald-400', s: 'h-1.5 w-3 rounded-full', l: '90%', t: '10%', r: -18 },
  { c: 'bg-amber-400',   s: 'h-2 w-2 rounded-sm',     l: '33%', t: '12%', r: 28  },
  { c: 'bg-teal-400',    s: 'h-2 w-2 rounded-full',   l: '67%', t: '11%', r: 0   },
  { c: 'bg-violet-400',  s: 'h-2 w-3 rounded-sm',     l: '4%',  t: '36%', r: -30 },
  { c: 'bg-rose-400',    s: 'h-2 w-2 rounded-full',   l: '96%', t: '22%', r: 0   },
]

async function reverseGeocode(lat, lng, setNeighborhood) {
  try {
    const result = await googleReverseGeocode(lat, lng)
    if (result?.neighborhood) setNeighborhood(result.neighborhood)
  } catch { /* géocodage inverse silencieux */ }
}

export default function Checkout() {
  const { items, totals, clearCart } = useCart()
  const navigate = useNavigate()
  const toast = useToast()
  const { user, loading } = useAuth()
  const [step, setStep] = useState(0)
  const [operator, setOperator] = useState('mtn')
  const [phone, setPhone] = useState('')
  const [processing, setProcessing] = useState(false)
  const [serverOrder, setServerOrder] = useState(null)

  const [fullName, setFullName] = useState('')
  const [deliveryPhone, setDeliveryPhone] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [instructions, setInstructions] = useState('')
  const [coordinates, setCoordinates] = useState('')
  const [mapPosition, setMapPosition] = useState(PARAKOU_CENTER)
  const [isLocating, setIsLocating] = useState(false)
  const DELIVERY_FEE = 600

  const deliveryPhoneError = getPhoneError(deliveryPhone)
  const momoPhoneError = getPhoneError(phone)

  // Attendre que l'auth soit initialisée
  if (loading) return null

  // Non connecté → redirection vers la connexion avec retour automatique
  if (!user) {
    return <Navigate to="/connexion" state={{ from: '/paiement' }} replace />
  }

  // Connecté mais pas en tant que client (admin, vendeur, livreur)
  if (user.role !== 'client') {
    return (
      <div className="max-shell container-px py-24 text-center">
        <div className="mx-auto h-20 w-20 rounded-3xl bg-amber-50 flex items-center justify-center mb-5">
          <LockKeyhole size={36} className="text-amber-500" />
        </div>
        <p className="font-display text-2xl font-bold text-ink-900">Accès réservé aux clients</p>
        <p className="mt-2 text-sm text-ink-500">
          Vous êtes connecté en tant que <span className="font-semibold capitalize">{user.role}</span>.<br />
          Seuls les comptes clients peuvent passer des commandes.
        </p>
        <Link to="/" className="btn-primary mt-6 inline-flex">Retour à l'accueil</Link>
      </div>
    )
  }

  if (!items.length && step === 0) {
    return (
      <div className="max-shell container-px py-24 text-center">
        <p className="font-display text-2xl font-bold text-ink-900">Votre panier est vide</p>
        <Link to="/catalogue" className="btn-primary mt-6">Découvrir les produits</Link>
      </div>
    )
  }

  const handleGeolocation = () => {
    if (!navigator.geolocation) { toast.warning("Géolocalisation non supportée par votre navigateur."); return }
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords
        setMapPosition({ lat, lng })
        setCoordinates(`${lat.toFixed(5)}, ${lng.toFixed(5)}`)
        reverseGeocode(lat, lng, setNeighborhood)
        setIsLocating(false)
      },
      () => { toast.error("Impossible de capter votre position."); setIsLocating(false) },
      { enableHighAccuracy: true }
    )
  }

  const handleCreateOrder = async () => {
    if (!neighborhood) { toast.warning('Veuillez préciser votre quartier.'); return }
    if (!validateBeninPhone(phone)) { toast.warning('Veuillez saisir un numéro Mobile Money valide (ex: 0142162127).'); return }
    setProcessing(true)
    try {
      const orderRes = await api.post('/orders', {
        delivery_name: fullName,
        delivery_phone: deliveryPhone,
        delivery_neighborhood: neighborhood,
        delivery_instructions: instructions,
        delivery_coordinates: coordinates,
        payment_method: 'mobile_money',
        payment_operator: operator,
        payment_phone: phone,
        items: items.map(({ product, qty }) => ({
          product_id: product.id,
          qty,
          unit_price: product.price,
          notes: product.customerNotes || null,
        })),
      })
      const order = orderRes.data

      const payRes = await api.post(`/payments/initiate/${order.id}`, {
        operator,
        phone,
      })

      setServerOrder(payRes.data.order || order)
      setStep(2)
      clearCart()
    } catch (err) {
      const errs = err.response?.data?.errors
      const msg = errs
        ? Object.values(errs).flat().join('\n')
        : err.response?.data?.message || 'Une erreur est survenue. Vérifiez vos informations.'
      toast.error(msg)
    } finally {
      setProcessing(false)
    }
  }

  // Génère et télécharge un reçu texte à partir des données réelles de la commande.
  const downloadReceipt = () => {
    if (!serverOrder) return
    const fmt = (n) => Number(n || 0).toLocaleString('fr-FR') + ' FCFA'
    const opName = operators.find(o => o.id === operator)?.name || operator
    const when = new Date(serverOrder.created_at || Date.now()).toLocaleString('fr-FR')
    const lines = [
      'BeniMarket — Reçu de paiement',
      '==============================',
      `Référence    : ${serverOrder.reference}`,
      `Date         : ${when}`,
      `Opérateur    : ${opName}`,
      `Numéro       : ${phone}`,
      '',
      'Articles :',
      ...(serverOrder.items || []).map(it => `  - ${it.qty} x ${it.product_name}  =  ${fmt(it.total)}`),
      '',
      `Sous-total       : ${fmt(serverOrder.subtotal)}`,
      `Frais de service : ${fmt(serverOrder.service_fee)}`,
      `Livraison        : ${fmt(serverOrder.delivery_fee)}`,
      `TOTAL PAYÉ       : ${fmt(serverOrder.total)}`,
      '',
      'Fonds sécurisés jusqu’à la confirmation de livraison.',
      'Merci pour votre commande !',
    ].join('\n')
    const url = URL.createObjectURL(new Blob([lines], { type: 'text/plain;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `recu-${serverOrder.reference}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-shell container-px py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center">
            {steps.map((label, i) => {
              const done = i < step
              const current = i === step
              return (
                <div key={label} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`grid h-10 w-10 place-items-center rounded-full text-sm font-bold shadow-soft transition-colors ${done ? 'bg-gradient-to-br from-teal-600 to-emerald-600 text-white' : current ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white ring-4 ring-amber-100' : 'bg-ink-100 text-ink-400 shadow-none'}`}>
                      {done ? <Check size={18} /> : i + 1}
                    </div>
                    <span className={`mt-2 text-xs font-semibold ${current || done ? 'text-ink-900' : 'text-ink-400'}`}>{label}</span>
                  </div>
                  {i < steps.length - 1 && <div className={`mx-2 h-0.5 flex-1 rounded ${i < step ? 'bg-gradient-to-r from-teal-600 to-emerald-500' : 'bg-ink-200'}`} />}
                </div>
              )
            })}
          </div>
        </div>

        {step === 0 && (
          <div className="card animate-fade-in p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 pb-3">
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
                <MapPin size={20} className="text-teal-700" /> Adresse de livraison
              </h2>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
                📍 Livraison à Parakou
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">Nom complet</label>
                <input className="input" placeholder="Votre nom" value={fullName} onChange={e => setFullName(e.target.value)} required />
              </div>
              <div>
                <label className="label">Téléphone de contact</label>
                <input className={`input ${deliveryPhoneError ? 'ring-2 ring-red-300 border-red-300' : ''}`} inputMode="numeric" placeholder="Ex: 0142162127" value={deliveryPhone} onChange={e => setDeliveryPhone(formatPhoneInput(e.target.value))} required maxLength={10} />
                {deliveryPhoneError && <p className="mt-1 text-xs text-red-500 font-medium">{deliveryPhoneError}</p>}
              </div>
              <div>
                <label className="label">Ville</label>
                <input className="input bg-ink-50 text-ink-500 cursor-not-allowed" value="Parakou" disabled />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Quartier / Repère</label>
                <input className="input" placeholder="Ex. Albarika, Titirou…" value={neighborhood} onChange={e => setNeighborhood(e.target.value)} required />
              </div>

              <div className="sm:col-span-2 pt-2">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div>
                    <label className="text-xs font-bold text-ink-700 uppercase tracking-wider">Épinglez votre position</label>
                    <p className="text-[11px] text-ink-400">Cliquez sur la carte ou utilisez la géolocalisation</p>
                  </div>
                  <button type="button" onClick={handleGeolocation} disabled={isLocating} className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-xl">
                    <Navigation size={12} className={isLocating ? 'animate-bounce' : ''} />
                    {isLocating ? 'Localisation…' : 'Ma position'}
                  </button>
                </div>
                <div className="h-60 w-full rounded-2xl overflow-hidden border border-ink-200 shadow-inner relative z-0">
                  <GoogleMapPicker
                    position={mapPosition}
                    height="240px"
                    onSelect={({ lat, lng }) => {
                      setMapPosition({ lat, lng })
                      setCoordinates(`${lat.toFixed(5)}, ${lng.toFixed(5)}`)
                      reverseGeocode(lat, lng, setNeighborhood)
                    }}
                  />
                </div>
                {coordinates && <p className="mt-2 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md inline-block">📍 {coordinates}</p>}
              </div>

              {/* Frais de livraison fixes */}
              <div className="sm:col-span-2">
                <div className="bg-teal-50 border border-teal-100 rounded-xl px-4 py-3 text-sm flex justify-between items-center">
                  <span className="font-semibold text-teal-800">Frais de livraison</span>
                  <span className="font-bold text-teal-700">{formatXOF(DELIVERY_FEE)}</span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="label">Instructions pour le livreur (optionnel)</label>
                <textarea className="input min-h-[70px] resize-none py-3" placeholder="Précisions utiles…" value={instructions} onChange={e => setInstructions(e.target.value)} />
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Link to="/panier" className="btn-ghost"><ChevronLeft size={18} /> Panier</Link>
              <button onClick={() => {
                if (!fullName.trim()) { toast.warning('Veuillez saisir votre nom complet.'); return }
                if (!deliveryPhone.trim()) { toast.warning('Veuillez saisir un numéro de téléphone.'); return }
                if (!validateBeninPhone(deliveryPhone)) { toast.warning('Le numéro de téléphone doit être au format béninois (ex: 0142162127).'); return }
                if (!neighborhood.trim()) { toast.warning('Veuillez préciser votre quartier.'); return }
                setStep(1)
              }} className="btn-primary bg-gradient-to-r from-teal-600 to-emerald-600 transition hover:brightness-110">
                Continuer vers le paiement
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid animate-fade-in gap-6 lg:grid-cols-[1fr_300px]">
            <div className="card p-6">
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
                <Smartphone size={20} className="text-teal-700" /> Paiement Mobile Money
              </h2>
              <p className="mt-1 text-sm text-ink-500">Sécurisé via FedaPay · Opérateurs béninois</p>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {operators.map(({ id, name, Logo }) => (
                  <button key={id} onClick={() => setOperator(id)} className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${operator === id ? 'border-teal-700 bg-teal-50 shadow-soft' : 'border-ink-200 hover:border-ink-300'}`}>
                    <Logo />
                    <span className="text-xs font-semibold text-ink-700">{name}</span>
                  </button>
                ))}
              </div>

                <div className="mt-5">
                <label className="label">Numéro Mobile Money</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input className={`input pl-10 ${momoPhoneError ? 'ring-2 ring-red-300 border-red-300' : ''}`} inputMode="numeric" value={phone} onChange={e => setPhone(formatPhoneInput(e.target.value))} placeholder="Ex: 0142162127" maxLength={10} />
                </div>
                {momoPhoneError && <p className="mt-1 text-xs text-red-500 font-medium">{momoPhoneError}</p>}
              </div>

              <div className="mt-5 rounded-2xl bg-teal-50 border border-teal-100 p-4 text-sm space-y-2">
                <p className="flex items-center gap-2 font-semibold text-teal-800">
                  <ShieldCheck size={16} className="text-teal-700" /> Paiement sécurisé — Fonds bloqués
                </p>
                <p className="text-ink-600 text-xs leading-relaxed">
                  Vos fonds restent sécurisés sur la plateforme jusqu'à ce que vous confirmiez
                  la réception de votre commande. En cas de problème, vous pouvez ouvrir un litige.
                </p>
              </div>

              <div className="mt-6 flex justify-between">
                <button onClick={() => setStep(0)} className="btn-ghost"><ChevronLeft size={18} /> Retour</button>
                <button onClick={handleCreateOrder} disabled={processing || !validateBeninPhone(phone)} className="btn-accent flex items-center gap-2 disabled:opacity-50">
                  {processing ? <><Loader2 size={18} className="animate-spin" /> Traitement…</> : <>Payer {formatXOF(totals.total)}</>}
                </button>
              </div>
            </div>

            <aside className="card h-fit p-5">
              <h3 className="font-display font-bold text-ink-900">Votre commande</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {items.map(({ product, qty }) => (
                  <li key={product.id} className="flex justify-between gap-2 text-ink-600">
                    <span className="truncate">{qty} × {product.name}</span>
                    <span className="shrink-0 font-medium text-ink-900">{formatXOF(product.price * qty)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-2 border-t border-ink-100 pt-4 text-sm">
                <div className="flex justify-between"><dt className="text-ink-500">Sous-total</dt><dd>{formatXOF(totals.subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-500">Service</dt><dd>{formatXOF(totals.service)}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-500">Livraison</dt><dd>{formatXOF(DELIVERY_FEE)}</dd></div>
                <div className="flex justify-between border-t border-ink-100 pt-2 font-bold text-ink-900">
                  <dt>Total</dt><dd className="text-teal-700">{formatXOF(totals.total)}</dd>
                </div>
              </dl>
            </aside>
          </div>
        )}

        {step === 2 && serverOrder && (
          <div className="mx-auto max-w-lg animate-scale-in">
            <div className="relative overflow-hidden rounded-4xl bg-white shadow-card ring-1 ring-ink-900/5">

              {/* En-tête célébratif */}
              <div className="relative overflow-hidden bg-gradient-to-b from-teal-50 via-emerald-50/40 to-white px-6 pt-12 pb-8 text-center">
                {/* Confettis */}
                {CONFETTI.map((c, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className={`pointer-events-none absolute opacity-90 ${c.s} ${c.c}`}
                    style={{ left: c.l, top: c.t, transform: `rotate(${c.r}deg)` }}
                  />
                ))}

                {/* Badge de validation */}
                <div className="relative mx-auto mb-5 h-24 w-24">
                  <span className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl" />
                  <span className="absolute inset-1 rounded-full bg-emerald-400/30 animate-ping" />
                  <span className="relative grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg ring-8 ring-white">
                    <Check size={46} strokeWidth={3} />
                  </span>
                </div>

                <h2 className="font-display text-2xl font-extrabold text-ink-900 text-balance sm:text-3xl">Paiement réussi !</h2>
                <p className="mt-1.5 text-sm text-ink-500">Votre transaction a bien été effectuée.</p>

                <p className="mt-5 font-display text-4xl font-extrabold tracking-tight text-ink-900">
                  {formatXOF(serverOrder.total || totals.total)}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  <ShieldCheck size={13} /> Fonds sécurisés jusqu'à la livraison
                </span>
              </div>

              {/* Corps : infos + actions */}
              <div className="px-6 pb-6">
                {/* Bloc reçu */}
                <div className="divide-y divide-ink-100 rounded-2xl bg-ink-50 ring-1 ring-ink-100">
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-ink-500">Référence</span>
                    <span className="font-mono text-sm font-bold text-ink-900">{serverOrder.reference}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-ink-500">Opérateur</span>
                    <span className="text-sm font-semibold text-ink-900">{operators.find(o => o.id === operator)?.name}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-ink-500">Numéro Mobile Money</span>
                    <span className="text-sm font-semibold text-ink-900">{phone}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-ink-500">Date</span>
                    <span className="text-sm font-semibold text-ink-900">
                      {new Date(serverOrder.created_at || Date.now()).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-ink-500">Articles</span>
                    <span className="text-sm font-semibold text-ink-900">{serverOrder.items?.length || 0} produit(s)</span>
                  </div>
                </div>

                {/* Suivi de livraison compact */}
                <div className="mt-4 flex items-center justify-between gap-2 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 px-4 py-3 ring-1 ring-teal-100">
                  {[
                    { icon: Check, label: 'Confirmée', done: true },
                    { icon: Truck, label: 'En route', done: false },
                    { icon: MapPin, label: 'Livrée', done: false },
                  ].map(({ icon: Icon, label, done }, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1.5 text-center">
                      <span className={`grid h-8 w-8 place-items-center rounded-xl ${done ? 'bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-soft' : 'bg-white text-ink-400 ring-1 ring-ink-100'}`}>
                        <Icon size={14} />
                      </span>
                      <span className={`text-[11px] ${done ? 'font-semibold text-ink-800' : 'text-ink-400'}`}>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Bouton principal */}
                <button
                  onClick={() => navigate(`/suivi/${serverOrder.id}`)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 py-3.5 text-sm font-bold text-white shadow-soft transition hover:shadow-glow hover:brightness-110"
                >
                  <Truck size={18} /> Suivre ma commande
                </button>

                {/* Liens secondaires */}
                <div className="mt-3 flex items-center justify-center gap-4 text-sm">
                  <button onClick={downloadReceipt} className="inline-flex items-center gap-1.5 font-semibold text-teal-700 transition-colors hover:text-teal-800">
                    <Download size={15} /> Télécharger le reçu
                  </button>
                  <span className="h-3.5 w-px bg-ink-200" />
                  <button onClick={() => navigate('/catalogue')} className="font-semibold text-ink-500 transition-colors hover:text-ink-800">
                    Continuer mes achats
                  </button>
                </div>
              </div>
            </div>

            {/* Réassurance livraison */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-amber-50 px-4 py-3 ring-1 ring-amber-100">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600">
                <Truck size={18} />
              </span>
              <p className="text-xs leading-relaxed text-ink-600">
                <span className="font-semibold text-ink-900">Livraison à Parakou.</span> Un livreur prendra en charge votre commande sous peu — vous recevrez une notification.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
