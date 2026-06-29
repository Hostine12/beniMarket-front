import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  MapPin, Check, Package, Wallet, Bike, Shield, KeyRound,
  Clock, ChevronRight, TrendingUp, Navigation, CheckCircle2,
  Store, Phone
} from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import DisputePanel from '../../components/dispute/DisputePanel'
import ProfileSettings from '../../components/dashboard/ProfileSettings'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import { formatXOF } from '../../utils/format'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { openDirections } from '../../components/maps/GoogleMapPicker'

/** Regroupe les articles d'une commande par boutique pour l'affichage pickup. */
function getPickupsByShop(order) {
  if (!order?.items) return []
  const map = new Map()
  for (const item of order.items) {
    const shop = item.shop
    if (!shop) continue
    if (!map.has(shop.id)) {
      map.set(shop.id, { shop, items: [] })
    }
    map.get(shop.id).items.push(item)
  }
  return [...map.values()]
}

/** Destination Google Maps : coordonnées GPS si dispo, sinon quartier + ville. */
function getDestination(order) {
  if (order?.delivery_coordinates) return order.delivery_coordinates
  if (order?.delivery_neighborhood) return `${order.delivery_neighborhood}, Parakou, Bénin`
  return null
}

export default function CourierSpace() {
  const location = useLocation()
  const { user } = useAuth()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('missions')
  const [otpModal, setOtpModal] = useState(null)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [available, setAvailable] = useState([])
  const [assigned, setAssigned] = useState([])
  const [history, setHistory] = useState([])

  useEffect(() => {
    const hash = location.hash.replace('#', '')
    setActiveTab(hash || 'missions')
  }, [location])

  const loadData = async () => {
    setLoading(true)
    try {
      const r = await api.get('/deliveries')
      setAvailable(r.data.available || [])
      setAssigned(r.data.assigned || [])
      setHistory(r.data.history || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const navItems = [
    { to: '#missions', label: 'Mes missions', icon: 'Bike', isActive: activeTab === 'missions' },
    { to: '#history', label: 'Historique', icon: 'Package', isActive: activeTab === 'history' },
    { to: '#disputes', label: 'Litiges', icon: 'AlertTriangle', isActive: activeTab === 'disputes' },
    { to: '#profile', label: 'Mon profil', icon: 'User', isActive: activeTab === 'profile' },
  ]

  // Commandes liées au livreur (en cours + historique) pour l'ouverture de litiges
  const courierOrders = [...new Map(
    [...assigned, ...history]
      .map(d => d.order)
      .filter(Boolean)
      .map(o => [o.id, o])
  ).values()]

  const handleAccept = async (deliveryId) => {
    setSubmitting(true)
    try {
      await api.put(`/deliveries/${deliveryId}/accept`)
      await loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRequestOtp = async (deliveryId) => {
    setSubmitting(true)
    try {
      await api.put(`/deliveries/${deliveryId}/request-otp`)
      toast.success('Code OTP envoyé au client !')
      await loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleVerifyOtp = async (deliveryId) => {
    setSubmitting(true)
    try {
      await api.put(`/deliveries/${deliveryId}/verify-otp`, { otp })
      toast.success('Livraison confirmée avec succès !')
      setOtpModal(null)
      setOtp('')
      await loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Code OTP incorrect.')
    } finally {
      setSubmitting(false)
    }
  }

  // Le livreur perçoit un gain fixe de 600 F par course livrée (jamais un % du total).
  const COURIER_FEE = 600
  const totalEarnings = history.length * COURIER_FEE

  if (!user) return <div className="flex h-screen items-center justify-center text-sm text-ink-500">Chargement…</div>

  return (
    <DashboardLayout
      title={`Espace Livreur — ${user.name}`}
      subtitle={`${user.vehicle_type || 'Livreur'} · ${user.zone || 'Parakou'}`}
      navItems={navItems}
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon="Bike" label="En cours" value={assigned.length.toString()} tone="teal" />
        <StatCard icon="Package" label="Disponibles" value={available.length.toString()} tone="amber" />
        <StatCard icon="Check" label="Livrées" value={history.length.toString()} tone="teal" />
        <StatCard icon="Wallet" label="Gains estimés" value={formatXOF(totalEarnings)} tone="plum" />
      </div>

      <div className="mt-6">
        {activeTab === 'missions' && (
          <div className="space-y-6 animate-fade-in">

            {/* Missions en cours */}
            {assigned.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-500 animate-pulse" />
                  <h2 className="font-display font-bold text-ink-900">En cours ({assigned.length})</h2>
                </div>
                <div className="space-y-3">
                  {assigned.map(d => {
                    const pickups = getPickupsByShop(d.order)
                    return (
                    <div key={d.id} className="card p-5 border-l-4 border-teal-500 bg-gradient-to-r from-teal-50/40 to-white">
                      <div className="flex justify-between items-start mb-4 gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold">
                              {d.order?.reference}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              d.status === 'otp_requested'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {d.status === 'otp_requested' ? 'OTP demandé' : 'En route'}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-ink-800">{d.order?.client?.name}</p>
                          <p className="text-sm text-ink-500 flex items-center gap-1 mt-1">
                            <Navigation size={13} className="text-teal-500 shrink-0" />
                            {d.order?.delivery_neighborhood || 'Adresse non précisée'}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-teal-700 text-lg">{formatXOF(d.order?.total || 0)}</p>
                          <p className="text-xs text-ink-400">+{formatXOF((d.order?.total || 0) * 0.1)} gain</p>
                        </div>
                      </div>

                      {/* Récupération chez le(s) vendeur(s) */}
                      {pickups.length > 0 && (
                        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 space-y-3">
                          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                            <Package size={12} /> Colis à récupérer
                          </p>
                          {pickups.map(({ shop, items }, idx) => (
                            <div key={shop.id} className="space-y-1">
                              {pickups.length > 1 && (
                                <p className="text-xs font-semibold text-amber-600">Étape {idx + 1}</p>
                              )}
                              <div className="flex items-start gap-2">
                                <Store size={14} className="text-amber-600 mt-0.5 shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-ink-900">{shop.name}</p>
                                  {shop.phone && (
                                    <p className="text-xs text-ink-500 flex items-center gap-1">
                                      <Phone size={11} /> {shop.phone}
                                    </p>
                                  )}
                                  {(shop.address || shop.city) && (
                                    <p className="text-xs text-ink-500 flex items-center gap-1">
                                      <MapPin size={11} /> {shop.address || shop.city}
                                    </p>
                                  )}
                                  <ul className="mt-1 space-y-0.5">
                                    {items.map(item => (
                                      <li key={item.id} className="text-xs text-ink-600">
                                        · {item.qty}× {item.product_name || item.product?.name}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        {getDestination(d.order) && (
                          <button
                            onClick={() => openDirections(getDestination(d.order))}
                            className="btn-outline text-sm flex items-center justify-center gap-2 shrink-0"
                          >
                            <Navigation size={15} className="text-teal-600" /> Itinéraire
                          </button>
                        )}
                        {d.status === 'in_progress' && (
                          <button
                            onClick={() => handleRequestOtp(d.id)}
                            disabled={submitting}
                            className="btn-primary flex-1 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            <MapPin size={15} /> Arrivé — Envoyer OTP
                          </button>
                        )}
                        {d.status === 'otp_requested' && (
                          <button
                            onClick={() => setOtpModal(d.id)}
                            className="btn-primary flex-1 text-sm bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2"
                          >
                            <KeyRound size={15} /> Saisir code OTP
                          </button>
                        )}
                      </div>
                    </div>
                  )})}
                </div>
              </div>
            )}

            {/* Livraisons disponibles */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-amber-500" />
                <h2 className="font-display font-bold text-ink-900">Disponibles ({available.length})</h2>
              </div>
              {loading ? (
                <div className="card p-12 text-center text-ink-400 text-sm">Chargement…</div>
              ) : available.length === 0 ? (
                <div className="card p-12 text-center text-sm text-ink-400">
                  <Bike className="mx-auto h-10 w-10 text-ink-200 mb-3" />
                  <p className="font-semibold text-ink-600">Aucune livraison pour l'instant</p>
                  <p className="mt-1 text-xs">Les nouvelles missions apparaîtront ici.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {available.map(d => (
                    <div key={d.id} className="card p-5 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4 gap-3">
                        <div className="min-w-0">
                          <span className="font-mono text-xs bg-ink-100 text-ink-600 px-2 py-0.5 rounded-full font-semibold">
                            {d.order?.reference}
                          </span>
                          <p className="text-sm font-semibold text-ink-800 mt-1">{d.order?.client?.name}</p>
                          <p className="text-sm text-ink-500 flex items-center gap-1 mt-1">
                            <MapPin size={13} className="text-ink-400 shrink-0" />
                            {d.order?.delivery_neighborhood || 'Parakou'}
                          </p>
                          <p className="text-xs text-ink-400 mt-1">{d.order?.items?.length || 0} article(s)</p>
                        </div>
                        <div className="shrink-0 text-right bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                          <p className="text-xs text-amber-600 font-medium">Gain estimé</p>
                          <p className="font-bold text-amber-700 text-lg">+{formatXOF((d.order?.total || 0) * 0.1)}</p>
                          <p className="text-xs text-ink-400">{formatXOF(d.order?.total || 0)} cde</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {getDestination(d.order) && (
                          <button
                            onClick={() => openDirections(getDestination(d.order))}
                            className="btn-outline text-sm flex items-center justify-center gap-2 shrink-0"
                          >
                            <Navigation size={15} className="text-teal-600" /> Voir sur la carte
                          </button>
                        )}
                        <button
                          onClick={() => handleAccept(d.id)}
                          disabled={submitting}
                          className="btn-primary flex-1 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <ChevronRight size={15} /> Accepter cette livraison
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-fade-in space-y-4">
            {/* Récapitulatif gains */}
            {history.length > 0 && (
              <div className="card p-5 bg-gradient-to-r from-teal-600 to-emerald-500 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-teal-100">Total des gains</p>
                    <p className="font-display text-3xl font-bold mt-1">{formatXOF(totalEarnings)}</p>
                    <p className="text-xs text-teal-200 mt-1">{history.length} livraison(s) effectuée(s)</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
                    <TrendingUp size={28} className="text-white" />
                  </div>
                </div>
              </div>
            )}

            <div className="card divide-y divide-ink-100">
              <div className="p-5">
                <h2 className="font-display font-bold text-ink-900">Historique des livraisons</h2>
              </div>
              {history.length === 0 ? (
                <div className="p-12 text-center text-sm text-ink-400">
                  <Package className="mx-auto h-10 w-10 text-ink-200 mb-3" />
                  Aucune livraison effectuée.
                </div>
              ) : history.map(d => (
                <div key={d.id} className="p-4 flex items-center gap-3 hover:bg-ink-50">
                  <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink-900">{d.order?.reference}</p>
                    <p className="text-xs text-ink-400">{d.order?.client?.name}</p>
                    <p className="text-xs text-ink-400 mt-0.5">
                      {d.otp_verified_at ? new Date(d.otp_verified_at).toLocaleDateString('fr-FR') : ''}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-emerald-600 text-sm">+{formatXOF((d.order?.total || 0) * 0.1)}</p>
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Livré</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'disputes' && (
          <DisputePanel user={user} orders={courierOrders} />
        )}

        {activeTab === 'profile' && <ProfileSettings />}
      </div>

      {otpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={() => { setOtpModal(null); setOtp('') }} />
          <div className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-500 px-6 py-8 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mb-3">
                <Shield size={30} className="text-white" />
              </div>
              <h3 className="font-display font-bold text-white text-xl">Confirmation OTP</h3>
              <p className="text-sm text-emerald-100 mt-1">Demandez le code 4 chiffres au client</p>
            </div>
            <div className="p-6">
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                className="input text-center text-3xl font-bold tracking-[0.6em] mb-6"
                placeholder="----"
                autoFocus
              />
              <div className="flex gap-3">
                <button onClick={() => { setOtpModal(null); setOtp('') }} className="btn-ghost flex-1">Annuler</button>
                <button
                  onClick={() => handleVerifyOtp(otpModal)}
                  disabled={otp.length < 4 || submitting}
                  className="btn-primary flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                >
                  {submitting ? 'Vérification…' : 'Confirmer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
