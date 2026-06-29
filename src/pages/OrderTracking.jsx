import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Check, Truck, Package, MapPin, Phone, ShieldCheck,
  Clock, RefreshCw, ChevronRight, CircleDot, KeyRound, Bell
} from 'lucide-react'
import StatusBadge from '../components/ui/StatusBadge'
import Avatar from '../components/ui/Avatar'
import { formatXOF, formatDate } from '../utils/format'
import api from '../api/axios'
import SellerRecommendations from '../components/product/SellerRecommendations'
import { useAuth } from '../context/AuthContext'

const orderStatuses = [
  { key: 'pending',   label: 'En attente',      desc: 'Commande enregistrée',               icon: Clock },
  { key: 'confirmed', label: 'Confirmée',        desc: 'Paiement reçu',                      icon: Check },
  { key: 'preparing', label: 'En préparation',   desc: 'Le vendeur prépare votre colis',      icon: Package },
  { key: 'shipping',  label: 'En livraison',     desc: 'Le livreur est en route vers vous',   icon: Truck },
  { key: 'delivered', label: 'Livrée',           desc: 'Colis remis avec code OTP',           icon: ShieldCheck },
]

function TrackingSkeleton() {
  return (
    <div className="max-shell container-px py-8 animate-pulse">
      <div className="h-8 w-56 rounded-xl bg-ink-200 mb-2" />
      <div className="h-4 w-36 rounded-lg bg-ink-100 mb-8" />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="card p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-ink-200 shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 w-32 rounded bg-ink-200" />
                  <div className="h-3 w-48 rounded bg-ink-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-28 rounded bg-ink-200" />
              <div className="h-4 w-20 rounded bg-ink-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function OrderTracking() {
  const { id } = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [confirmingReceipt, setConfirmingReceipt] = useState(false)
  const [receiptConfirmed, setReceiptConfirmed] = useState(false)

  const fetchOrder = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const r = await api.get(`/orders/${id}`)
      setOrder(r.data)
    } catch {
      setOrder(null)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleConfirmReceipt = async () => {
    setConfirmingReceipt(true)
    try {
      await api.post(`/orders/${id}/confirm-received`)
      setReceiptConfirmed(true)
      fetchOrder()
    } catch { /* silencieux */ }
    finally { setConfirmingReceipt(false) }
  }

  useEffect(() => { fetchOrder() }, [id])

  if (loading) return <TrackingSkeleton />

  if (!order) {
    return (
      <div className="max-shell container-px py-24 text-center">
        <div className="mx-auto h-20 w-20 rounded-3xl bg-ink-100 flex items-center justify-center mb-5">
          <Package size={36} className="text-ink-300" />
        </div>
        <p className="font-display text-2xl font-bold text-ink-900">Commande introuvable</p>
        <p className="mt-2 text-sm text-ink-500">Vérifiez votre lien ou consultez votre espace client.</p>
        <Link to="/compte" className="btn-primary mt-6 inline-flex">Mes commandes</Link>
      </div>
    )
  }

  const currentIndex = orderStatuses.findIndex(s => s.key === order.status)

  return (
    <div className="max-shell container-px py-8">
      {/* En-tête */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <nav className="mb-2 flex items-center gap-1.5 text-xs text-ink-400">
            <Link to="/" className="hover:text-ink-700">Accueil</Link>
            <ChevronRight size={12} />
            <Link to="/compte" className="hover:text-ink-700">Mon compte</Link>
            <ChevronRight size={12} />
            <span className="text-ink-700">Suivi</span>
          </nav>
          <h1 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">Suivi de commande</h1>
          <p className="mt-1 text-sm text-ink-500">
            Référence : <span className="font-mono font-semibold text-ink-700">{order.reference}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={order.status} />
          {/* Bouton "Confirmer la réception" — visible pour le client quand la livraison est en cours ou faite */}
          {user && user.role === 'client'
            && ['shipping', 'delivered'].includes(order.status)
            && order.escrow_status === 'held'
            && !receiptConfirmed && (
            <button
              onClick={handleConfirmReceipt}
              disabled={confirmingReceipt}
              className="flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-soft disabled:opacity-50 transition hover:brightness-110"
            >
              <Check size={13} />
              {confirmingReceipt ? 'Confirmation…' : 'J\'ai reçu ma commande'}
            </button>
          )}
          {(receiptConfirmed || order.escrow_status === 'released') && (
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-100 flex items-center gap-1">
              <Check size={12} /> Réception confirmée
            </span>
          )}
          <button
            onClick={() => fetchOrder(true)}
            disabled={refreshing}
            className="h-9 w-9 grid place-items-center rounded-xl border border-ink-200 text-ink-500 hover:bg-ink-50 disabled:opacity-50"
            title="Rafraîchir"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── BANDEAU OTP URGENT ── */}
      {order.status === 'shipping' && order.otp && (
        order.delivery?.status === 'otp_requested' ? (
          /* Livreur à la porte → affichage URGENT */
          <div className="mb-6 overflow-hidden rounded-3xl shadow-xl ring-2 ring-amber-400">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-7 text-center text-white">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="h-2.5 w-2.5 rounded-full bg-white animate-ping" />
                <span className="h-2.5 w-2.5 rounded-full bg-white absolute animate-pulse" />
                <p className="text-sm font-bold uppercase tracking-widest">Le livreur est à votre porte !</p>
              </div>
              <p className="text-amber-100 text-sm mt-1 mb-5">
                Donnez ce code au livreur pour confirmer la réception de votre colis
              </p>

              <div className="inline-flex items-center gap-4 rounded-2xl bg-white/20 backdrop-blur-sm px-8 py-4 mb-4">
                <KeyRound size={26} className="text-white shrink-0" />
                <span className="font-display text-6xl font-bold tracking-[0.5em] text-white select-all">
                  {order.otp}
                </span>
              </div>

              <p className="text-amber-200 text-xs">
                🔒 Ne communiquez ce code qu'au livreur en main propre
              </p>
            </div>
          </div>
        ) : (
          /* Livreur en route → affichage discret de préparation */
          <div className="mb-6 flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <div className="h-11 w-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <KeyRound size={20} className="text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-amber-800 text-sm">Votre code OTP de livraison</p>
              <p className="text-xs text-amber-600 mt-0.5">
                Communiquez ce code au livreur quand il arrive chez vous
              </p>
            </div>
            <div className="shrink-0 text-right">
              <span className="font-display text-3xl font-bold tracking-[0.35em] text-amber-700 select-all">
                {order.otp}
              </span>
            </div>
          </div>
        )
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Colonne gauche */}
        <div className="space-y-5">

          {/* Timeline */}
          <div className="card p-6">
            <h2 className="font-display font-bold text-ink-900 mb-6">Progression</h2>
            <div className="relative">
              {/* Ligne verticale */}
              <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-ink-100" />

              <div className="space-y-6">
                {orderStatuses.map((s, i) => {
                  const done    = i < currentIndex
                  const active  = i === currentIndex
                  const pending = i > currentIndex
                  const Icon    = s.icon

                  return (
                    <div key={s.key} className="relative flex items-start gap-4">
                      {/* Icône */}
                      <div className={`
                        relative z-10 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white
                        ${done   ? 'bg-gradient-to-br from-teal-500 to-emerald-600 shadow-soft'  : ''}
                        ${active ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-soft' : ''}
                        ${pending? 'bg-ink-200'   : ''}
                      `}>
                        {done
                          ? <Check size={14} className="text-white" />
                          : <Icon size={14} className={active ? 'text-white' : 'text-ink-400'} />
                        }
                      </div>

                      {/* Texte */}
                      <div className="flex-1 pb-1">
                        <p className={`text-sm font-semibold ${active ? 'text-amber-600' : done ? 'text-ink-800' : 'text-ink-400'}`}>
                          {s.label}
                          {active && <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />}
                        </p>
                        <p className={`text-xs mt-0.5 ${pending ? 'text-ink-300' : 'text-ink-500'}`}>{s.desc}</p>
                      </div>

                      {done && (
                        <span className="text-xs text-teal-600 font-medium bg-teal-50 px-2 py-0.5 rounded-full shrink-0">
                          Fait
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Carte livreur */}
          {order.delivery?.courier && (
            <div className="card p-5">
              <h2 className="font-display font-bold text-ink-900 mb-4">Votre livreur</h2>
              <div className="flex items-center gap-4">
                <Avatar name={order.delivery.courier.name} role="courier" size="md" rounded="rounded-xl" />
                <div className="flex-1">
                  <p className="font-semibold text-ink-900">{order.delivery.courier.name}</p>
                  <p className="text-sm text-ink-500">
                    {order.delivery.courier.vehicle_type || 'Livreur'}
                    {order.delivery.courier.plate_number && ` · ${order.delivery.courier.plate_number}`}
                  </p>
                </div>
                {order.delivery.courier.phone && (
                  <a
                    href={`tel:${order.delivery.courier.phone}`}
                    className="flex items-center gap-2 text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-100 px-4 py-2 rounded-xl transition-colors"
                  >
                    <Phone size={15} /> Appeler
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Livraison confirmée */}
          {order.status === 'delivered' && (
            <div className="card p-5 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <ShieldCheck size={22} className="text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-800">Livraison confirmée</p>
                  <p className="text-sm text-emerald-600 mt-0.5">Votre colis a bien été remis. Merci d'avoir choisi BeniMarket !</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Colonne droite */}
        <div className="space-y-5">

          {/* Articles */}
          <div className="card p-5">
            <h2 className="font-display font-bold text-ink-900 mb-4">Articles commandés</h2>
            <div className="divide-y divide-ink-100">
              {order.items?.map(item => (
                <div key={item.id} className="py-3 flex justify-between gap-2 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-ink-800 truncate">{item.product_name}</p>
                    {item.option_label && <p className="text-xs text-ink-400">{item.option_label}</p>}
                    <p className="text-xs text-ink-400">× {item.qty}</p>
                  </div>
                  <p className="font-semibold text-ink-900 shrink-0">{formatXOF(item.total)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-ink-200 space-y-2 text-sm">
              <div className="flex justify-between text-ink-500">
                <span>Sous-total</span><span>{formatXOF(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-500">
                <span>Frais de service</span><span>{formatXOF(order.service_fee)}</span>
              </div>
              <div className="flex justify-between text-ink-500">
                <span>Livraison</span><span>{formatXOF(order.delivery_fee)}</span>
              </div>
              <div className="flex justify-between font-bold text-ink-900 text-base border-t border-ink-200 pt-3">
                <span>Total</span>
                <span className="text-teal-700">{formatXOF(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div className="card p-5">
            <h2 className="font-display font-bold text-ink-900 mb-3">Adresse de livraison</h2>
            <div className="flex items-start gap-2.5 text-sm text-ink-600">
              <MapPin size={16} className="mt-0.5 shrink-0 text-teal-600" />
              <div>
                <p className="font-medium text-ink-800">{order.delivery_name || '–'}</p>
                <p>{order.delivery_neighborhood || 'Adresse non précisée'}</p>
                {order.delivery_instructions && (
                  <p className="mt-1 text-xs text-ink-400 italic">"{order.delivery_instructions}"</p>
                )}
              </div>
            </div>
          </div>

          {/* Action retour */}
          <Link to="/catalogue" className="btn-ghost w-full flex justify-center text-sm">
            Continuer mes achats
          </Link>
        </div>
      </div>

      {/* Recommandations post-achat */}
      <div className="max-shell container-px mt-8 pb-10">
        <SellerRecommendations orderId={id} />
      </div>
    </div>
  )
}
