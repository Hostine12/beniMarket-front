import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import {
  Package, Bell, AlertTriangle, X, MessageSquare,
  ShoppingBag, CheckCircle, ChevronRight, TrendingUp, Inbox, KeyRound
} from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'
import DisputePanel from '../../components/dispute/DisputePanel'
import ProfileSettings from '../../components/dashboard/ProfileSettings'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { formatXOF, formatDate } from '../../utils/format'
import api from '../../api/axios'

const statusColor = {
  pending:   'border-amber-400',
  confirmed: 'border-blue-400',
  preparing: 'border-violet-400',
  shipping:  'border-cyan-400',
  delivered: 'border-emerald-400',
  cancelled: 'border-red-400',
}

export default function ClientDashboard() {
  const location = useLocation()
  const { user } = useAuth()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('dashboard')

  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const [disputeModal, setDisputeModal] = useState({ isOpen: false, orderId: null, orderRef: '' })
  const [disputeReason, setDisputeReason] = useState('')
  const [disputeDesc, setDisputeDesc] = useState('')
  const [disputeSubmitting, setDisputeSubmitting] = useState(false)

  useEffect(() => {
    const hash = location.hash.replace('#', '')
    setActiveTab(hash || 'dashboard')
  }, [location])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get('/orders').then(r => setOrders(r.data.data || [])).catch(() => {}),
      api.get('/notifications').then(r => {
        setNotifications(r.data.notifications || [])
        setUnreadCount(r.data.unread_count || 0)
      }).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (activeTab === 'notifications' && unreadCount > 0) {
      api.put('/notifications/read-all').catch(() => {})
      setUnreadCount(0)
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date() })))
    }
  }, [activeTab])

  const navItems = [
    { to: '#dashboard', label: 'Tableau de bord', icon: 'LayoutDashboard', isActive: activeTab === 'dashboard' },
    { to: '#orders', label: 'Mes commandes', icon: 'Package', isActive: activeTab === 'orders' },
    { to: '#notifications', label: 'Notifications', icon: 'Bell', isActive: activeTab === 'notifications' },
    { to: '#disputes', label: 'Signaler un litige', icon: 'AlertTriangle', isActive: activeTab === 'disputes' },
    { to: '#profile', label: 'Mon compte', icon: 'User', isActive: activeTab === 'profile' },
  ]

  const handleDisputeSubmit = async (e) => {
    e.preventDefault()
    setDisputeSubmitting(true)
    try {
      await api.post('/disputes', {
        order_id: disputeModal.orderId,
        reason: disputeReason,
        description: disputeDesc,
      })
      setDisputeModal({ isOpen: false, orderId: null, orderRef: '' })
      setDisputeReason('')
      setDisputeDesc('')
      const r = await api.get('/notifications')
      setNotifications(r.data.notifications || [])
      toast.success('Litige enregistré. L\'administration vous répondra sous 24h.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la soumission.')
    } finally {
      setDisputeSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-ink-50 text-sm text-ink-500">
        Chargement…
      </div>
    )
  }

  const firstName = user.name?.split(' ')[0] || 'Client'
  const totalSpent = orders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + o.total, 0)
  const deliveredCount = orders.filter(o => o.status === 'delivered').length

  // Notification OTP en attente (livreur à la porte)
  const otpNotif = notifications.find(n => n.type === 'otp_requested' && !n.read_at)
  const otpCode = otpNotif?.data?.otp || null
  const otpOrderId = otpNotif?.data?.order_id || null

  return (
    <DashboardLayout
      title={`Bonjour, ${firstName} 👋`}
      subtitle="Voici un résumé de votre activité"
      navItems={navItems}
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon="Package" label="Commandes" value={orders.length.toString()} tone="teal" />
        <StatCard icon="Wallet" label="Total dépensé" value={formatXOF(totalSpent)} tone="amber" />
        <StatCard icon="Bell" label="Notifications" value={unreadCount.toString()} tone="plum" />
        <StatCard icon="CheckCircle" label="Livrées" value={deliveredCount.toString()} tone="teal" />
      </div>

      {/* ── ALERTE OTP LIVREUR À LA PORTE ── */}
      {otpCode && (
        <div className="mt-5 overflow-hidden rounded-3xl shadow-xl ring-2 ring-amber-400">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-6 text-white">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-white animate-ping" />
                  <p className="text-sm font-bold uppercase tracking-widest">Livreur à votre porte !</p>
                </div>
                <p className="text-amber-100 text-sm mt-1">
                  Donnez ce code à votre livreur pour confirmer la réception du colis.
                </p>
                {otpOrderId && (
                  <Link
                    to={`/suivi/${otpOrderId}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold bg-white/20 hover:bg-white/30 rounded-xl px-3 py-1.5 transition-colors"
                  >
                    Voir le suivi <ChevronRight size={13} />
                  </Link>
                )}
              </div>

              <div className="shrink-0 flex flex-col items-center gap-2">
                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
                  <KeyRound size={22} className="text-white" />
                  <span className="font-display text-5xl font-bold tracking-[0.5em] text-white select-all">
                    {otpCode}
                  </span>
                </div>
                <p className="text-amber-200 text-xs">🔒 En main propre uniquement</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        {activeTab === 'dashboard' && (
          <div className="grid gap-6 lg:grid-cols-3 animate-fade-in">
            {/* Commandes récentes */}
            <div className="lg:col-span-2 card overflow-hidden">
              <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
                <h2 className="font-display text-base font-bold text-ink-900">Commandes récentes</h2>
                <a href="#orders" className="flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline">
                  Tout voir <ChevronRight size={13} />
                </a>
              </div>
              {loading ? (
                <div className="p-8 text-center text-ink-400 text-sm">Chargement…</div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center text-sm text-ink-400">
                  <ShoppingBag className="mx-auto h-10 w-10 text-ink-200 mb-3" />
                  <p className="font-semibold text-ink-600">Aucune commande pour le moment</p>
                  <Link to="/catalogue" className="mt-3 inline-flex text-teal-600 text-xs hover:underline">
                    Explorer le catalogue →
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-ink-100">
                  {orders.slice(0, 5).map(o => (
                    <li key={o.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-ink-50 border-l-4 ${statusColor[o.status] || 'border-transparent'}`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink-900">{o.reference}</p>
                        <p className="text-xs text-ink-400 mt-0.5">
                          {o.items?.length || 0} article(s) · {formatXOF(o.total)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <StatusBadge status={o.status} />
                        <Link to={`/suivi/${o.id}`} className="text-xs text-teal-600 hover:underline flex items-center gap-0.5">
                          Suivre <ChevronRight size={11} />
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Colonne droite */}
            <div className="space-y-4">
              {/* Carte profil */}
              <div className="card overflow-hidden">
                <div className="bg-gradient-to-br from-teal-600 to-emerald-500 px-5 py-6 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-white/10 -translate-y-4 translate-x-4" />
                  <div className="absolute bottom-0 left-0 h-16 w-16 rounded-full bg-white/10 translate-y-4 -translate-x-4" />
                  <Avatar name={user.name} role={user.role} size="lg" rounded="rounded-2xl" withRing className="mx-auto relative z-10" />
                  <p className="mt-3 font-bold text-white relative z-10">{user.name}</p>
                  <p className="text-xs text-teal-100 relative z-10">{user.email || user.phone}</p>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-ink-50 p-3 text-center">
                    <p className="text-xl font-bold text-ink-900">{orders.length}</p>
                    <p className="text-xs text-ink-400 mt-0.5">Commandes</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-3 text-center">
                    <p className="text-xl font-bold text-emerald-700">{deliveredCount}</p>
                    <p className="text-xs text-ink-400 mt-0.5">Livrées</p>
                  </div>
                </div>
              </div>

              {/* Notifications récentes */}
              <div className="card p-4">
                <h3 className="font-bold text-ink-900 text-sm mb-3 flex items-center gap-2">
                  <Bell size={15} className="text-teal-600" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-semibold">
                      {unreadCount}
                    </span>
                  )}
                </h3>
                {notifications.length === 0 ? (
                  <p className="text-xs text-ink-400 text-center py-3">Aucune notification.</p>
                ) : notifications.slice(0, 3).map(n => (
                  <div key={n.id} className="py-2.5 border-b border-ink-50 last:border-0 flex gap-2.5 items-start">
                    <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${!n.read_at ? 'bg-teal-500' : 'bg-ink-300'}`} />
                    <div className="min-w-0">
                      <p className={`text-xs leading-tight ${!n.read_at ? 'font-semibold text-ink-900' : 'text-ink-600'}`}>{n.title}</p>
                      <p className="text-xs text-ink-400 truncate mt-0.5">{n.body}</p>
                    </div>
                  </div>
                ))}
                {notifications.length > 0 && (
                  <a href="#notifications" className="mt-2 block text-center text-xs text-teal-600 hover:underline">
                    Voir tout
                  </a>
                )}
              </div>

              {/* Total dépensé */}
              <div className="card p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <TrendingUp size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-ink-500">Total dépensé</p>
                    <p className="font-bold text-amber-700 text-lg">{formatXOF(totalSpent)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="card max-w-4xl overflow-hidden animate-fade-in">
            <div className="px-5 py-4 border-b border-ink-100">
              <h2 className="font-display text-lg font-bold text-ink-900">Toutes mes commandes</h2>
              <p className="text-xs text-ink-400 mt-0.5">{orders.length} commande(s)</p>
            </div>
            {orders.length === 0 ? (
              <div className="p-12 text-center text-sm text-ink-400">
                <Package className="mx-auto h-12 w-12 text-ink-200 mb-3" />
                <p className="font-semibold text-ink-600">Aucune commande enregistrée</p>
                <Link to="/catalogue" className="mt-3 inline-flex text-teal-600 text-sm hover:underline">
                  Explorer le catalogue →
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-ink-100">
                {orders.map(o => (
                  <li key={o.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 hover:bg-ink-50 border-l-4 ${statusColor[o.status] || 'border-transparent'}`}>
                    <div>
                      <p className="font-bold text-ink-900">{o.reference}</p>
                      <p className="text-xs text-ink-400 mt-0.5">{o.items?.length || 0} article(s) · {formatXOF(o.total)}</p>
                      <div className="mt-2">
                        <StatusBadge status={o.status} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link to={`/suivi/${o.id}`} className="btn-ghost btn-sm text-sm">
                        Suivre
                      </Link>
                      <button
                        onClick={() => setDisputeModal({ isOpen: true, orderId: o.id, orderRef: o.reference })}
                        className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        <AlertTriangle size={12} /> Litige
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="card max-w-2xl overflow-hidden animate-fade-in">
            <div className="px-5 py-4 border-b border-ink-100 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ink-900">Notifications</h2>
              {notifications.filter(n => !n.read_at).length > 0 && (
                <span className="text-xs bg-teal-100 text-teal-700 px-2.5 py-1 rounded-full font-semibold">
                  {notifications.filter(n => !n.read_at).length} non lue(s)
                </span>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="p-12 text-center text-sm text-ink-400">
                <Inbox className="mx-auto h-10 w-10 text-ink-200 mb-3" />
                <p className="font-semibold text-ink-600">Aucune notification</p>
              </div>
            ) : notifications.map(n => (
              <div key={n.id} className={`px-5 py-4 flex gap-3 hover:bg-ink-50 border-b border-ink-100 last:border-0 ${!n.read_at ? 'bg-teal-50/50' : ''}`}>
                <span className={`mt-2 h-2 w-2 rounded-full shrink-0 ${!n.read_at ? 'bg-teal-600' : 'bg-ink-300'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.read_at ? 'font-semibold text-ink-900' : 'text-ink-700'}`}>{n.title}</p>
                  <p className="text-xs text-ink-500 mt-0.5">{n.body}</p>
                  <p className="text-xs text-ink-400 mt-1.5">
                    {n.created_at ? new Date(n.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : ''}
                  </p>
                </div>
                {!n.read_at && (
                  <span className="shrink-0 mt-1 h-2 w-2 rounded-full bg-teal-500" />
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'disputes' && (
          <DisputePanel user={user} orders={orders} />
        )}

        {activeTab === 'profile' && <ProfileSettings />}
      </div>

      {disputeModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={() => setDisputeModal({ isOpen: false, orderId: null, orderRef: '' })} />
          <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-rose-500 px-6 py-5 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Signaler un litige</h3>
                <p className="text-xs text-red-100">{disputeModal.orderRef}</p>
              </div>
              <button
                onClick={() => setDisputeModal({ isOpen: false, orderId: null, orderRef: '' })}
                className="ml-auto h-8 w-8 grid place-items-center rounded-lg bg-white/20 hover:bg-white/30 text-white"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleDisputeSubmit} className="p-6 space-y-4">
              <div>
                <label className="label">Motif</label>
                <select className="input bg-white" value={disputeReason} onChange={e => setDisputeReason(e.target.value)} required>
                  <option value="">Sélectionnez…</option>
                  <option value="Produits gâtés">Produits gâtés / impropres</option>
                  <option value="Panier incomplet">Articles manquants</option>
                  <option value="Livreur injoignable">Livreur jamais venu</option>
                  <option value="Erreur de tarification">Prix incorrect</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input min-h-[80px] resize-none py-2" value={disputeDesc} onChange={e => setDisputeDesc(e.target.value)} required />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setDisputeModal({ isOpen: false, orderId: null, orderRef: '' })} className="btn-ghost flex-1">Annuler</button>
                <button type="submit" disabled={disputeSubmitting} className="btn-primary flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50">
                  {disputeSubmitting ? 'Envoi…' : 'Envoyer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
