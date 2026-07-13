import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import {
  Package, Bell, AlertTriangle, X, ShoppingBag, 
  ChevronRight, TrendingUp, Inbox, KeyRound
} from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'
import DisputePanel from '../../components/dispute/DisputePanel'
import ProfileSettings from '../../components/dashboard/ProfileSettings'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { formatXOF } from '../../utils/format'
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

  const otpNotif = notifications.find(n => n.type === 'otp_requested' && !n.read_at)
  const otpCode = otpNotif?.data?.otp || null
  const otpOrderId = otpNotif?.data?.order_id || null

  return (
    <DashboardLayout
      title={`Bonjour, ${firstName} 👋`}
      subtitle="Voici un résumé de votre activité"
      navItems={navItems}
    >
      {/* ── CONTENEUR ANTI-DEBORDEMENT DE SECOURS ── */}
      <div className="w-full max-w-full overflow-x-hidden px-1 py-2">
        
        {/* Grille de stats forcée en 1 seule colonne sur mobile si besoin */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <StatCard icon="Package" label="Commandes" value={orders.length.toString()} tone="teal" />
          <StatCard icon="Wallet" label="Total" value={formatXOF(totalSpent)} tone="amber" />
          <StatCard icon="Bell" label="Notifications" value={unreadCount.toString()} tone="plum" />
          <StatCard icon="CheckCircle" label="Livrées" value={deliveredCount.toString()} tone="teal" />
        </div>

        {/* Alerte OTP sécurisée */}
        {otpCode && (
          <div className="mt-5 overflow-hidden rounded-2xl shadow-lg ring-1 ring-amber-400 w-full">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 sm:p-6 text-white">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="text-center lg:text-left min-w-0 w-full lg:w-auto">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                    <span className="h-2 w-2 rounded-full bg-white animate-ping shrink-0" />
                    <p className="text-xs font-bold uppercase tracking-wider">Livreur à votre porte !</p>
                  </div>
                  <p className="text-amber-100 text-xs mt-1 break-words">
                    Donnez ce code à votre livreur pour confirmer la réception.
                  </p>
                </div>

                <div className="shrink-0 w-full sm:w-auto flex flex-col items-center gap-1.5">
                  <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 w-full sm:w-auto">
                    <KeyRound size={16} className="text-white shrink-0" />
                    <span className="font-display text-2xl sm:text-3xl font-bold tracking-[0.2em] text-white select-all">
                      {otpCode}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 w-full">
          {activeTab === 'dashboard' && (
            <div className="grid gap-6 lg:grid-cols-3">
              
              {/* Commandes récentes */}
              <div className="lg:col-span-2 card overflow-hidden w-full">
                <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
                  <h2 className="font-display text-sm font-bold text-ink-900 truncate">Commandes récentes</h2>
                  <a href="#orders" className="text-xs font-semibold text-teal-700 hover:underline shrink-0">
                    Tout voir →
                  </a>
                </div>
                {loading ? (
                  <div className="p-6 text-center text-ink-400 text-xs">Chargement…</div>
                ) : orders.length === 0 ? (
                  <div className="p-8 text-center text-xs text-ink-400">
                    <p className="font-semibold text-ink-600">Aucune commande</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-ink-100 w-full overflow-hidden">
                    {orders.slice(0, 5).map(o => (
                      <li key={o.id} className={`flex items-center justify-between gap-3 px-4 py-3 hover:bg-ink-50 border-l-4 ${statusColor[o.status] || 'border-transparent'}`}>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-ink-900 truncate">{o.reference}</p>
                          <p className="text-[11px] text-ink-400 mt-0.5 truncate">
                            {o.items?.length || 0} art. · {formatXOF(o.total)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <StatusBadge status={o.status} />
                          <Link to={`/suivi/${o.id}`} className="text-[10px] text-teal-600 hover:underline">
                            Suivre →
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Colonne droite */}
              <div className="space-y-4 w-full">
                {/* Carte profil */}
                <div className="card overflow-hidden w-full">
                  <div className="bg-gradient-to-br from-teal-600 to-emerald-500 px-4 py-5 text-center relative overflow-hidden">
                    <Avatar name={user.name} role={user.role} size="md" rounded="rounded-xl" className="mx-auto relative z-10" />
                    <p className="mt-2 text-sm font-bold text-white relative z-10 truncate">{user.name}</p>
                  </div>
                  <div className="p-3 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-ink-50 p-2 text-center min-w-0">
                      <p className="text-base font-bold text-ink-900 truncate">{orders.length}</p>
                      <p className="text-[10px] text-ink-400 truncate">Commandes</p>
                    </div>
                    <div className="rounded-lg bg-emerald-50 p-2 text-center min-w-0">
                      <p className="text-base font-bold text-emerald-700 truncate">{deliveredCount}</p>
                      <p className="text-[10px] text-ink-400 truncate">Livrées</p>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="card p-3 w-full">
                  <h3 className="font-bold text-ink-900 text-xs mb-2 flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                  </h3>
                  {notifications.length === 0 ? (
                    <p className="text-[10px] text-ink-400 text-center py-2">Aucune.</p>
                  ) : notifications.slice(0, 3).map(n => (
                    <div key={n.id} className="py-2 border-b border-ink-50 last:border-0 flex gap-2 items-start">
                      <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${!n.read_at ? 'bg-teal-500' : 'bg-ink-300'}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium text-ink-900 truncate">{n.title}</p>
                        <p className="text-[10px] text-ink-400 truncate">{n.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {activeTab === 'orders' && (
            <div className="card w-full overflow-hidden">
              <div className="px-4 py-3 border-b border-ink-100">
                <h2 className="font-display text-base font-bold text-ink-900">Toutes mes commandes</h2>
              </div>
              <ul className="divide-y divide-ink-100 w-full">
                {orders.map(o => (
                  <li key={o.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-l-4 ${statusColor[o.status] || 'border-transparent'}`}>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-ink-900 truncate">{o.reference}</p>
                      <p className="text-xs text-ink-400">{o.items?.length || 0} art. · {formatXOF(o.total)}</p>
                      <div className="mt-1"><StatusBadge status={o.status} /></div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto justify-end mt-1 sm:mt-0">
                      <Link to={`/suivi/${o.id}`} className="flex-1 sm:flex-none text-center text-xs font-semibold bg-ink-50 hover:bg-ink-100 px-3 py-2 rounded-xl">
                        Suivre
                      </Link>
                      <button
                        onClick={() => setDisputeModal({ isOpen: true, orderId: o.id, orderRef: o.reference })}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl"
                      >
                        Litige
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Onglets complémentaires */}
          {activeTab === 'notifications' && (
            <div className="card w-full overflow-hidden">
              <div className="px-4 py-3 border-b border-ink-100">
                <h2 className="font-display text-base font-bold text-ink-900">Notifications</h2>
              </div>
              <div className="divide-y divide-ink-100 w-full">
                {notifications.map(n => (
                  <div key={n.id} className="px-4 py-3 flex gap-3 min-w-0">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-ink-900 break-words">{n.title}</p>
                      <p className="text-[11px] text-ink-500 break-words mt-0.5">{n.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'disputes' && <DisputePanel user={user} orders={orders} />}
          {activeTab === 'profile' && <ProfileSettings />}
        </div>

      </div>

      {/* Modal de Litige */}
      {disputeModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={() => setDisputeModal({ isOpen: false, orderId: null, orderRef: '' })} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-red-600 px-4 py-3 flex items-center justify-between shrink-0">
              <span className="font-bold text-white text-sm truncate">Litige : {disputeModal.orderRef}</span>
              <button onClick={() => setDisputeModal({ isOpen: false, orderId: null, orderRef: '' })} className="text-white">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleDisputeSubmit} className="p-4 space-y-3 overflow-y-auto">
              <div>
                <label className="block text-[11px] font-semibold text-ink-500 mb-1">Motif</label>
                <select className="w-full rounded-lg border border-ink-200 p-2 text-xs bg-white" value={disputeReason} onChange={e => setDisputeReason(e.target.value)} required>
                  <option value="">Sélectionnez…</option>
                  <option value="Produits gâtés">Produits gâtés / impropres</option>
                  <option value="Panier incomplet">Articles manquants</option>
                  <option value="Livreur injoignable">Livreur jamais venu</option>
                  <option value="Erreur de tarification">Prix incorrect</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-ink-500 mb-1">Description</label>
                <textarea className="w-full rounded-lg border border-ink-200 p-2 text-xs min-h-[80px]" value={disputeDesc} onChange={e => setDisputeDesc(e.target.value)} required />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setDisputeModal({ isOpen: false, orderId: null, orderRef: '' })} className="flex-1 py-2 rounded-lg border border-ink-200 text-xs">Annuler</button>
                <button type="submit" disabled={disputeSubmitting} className="flex-1 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold">Envoyer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}