import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Check, X, ShieldAlert, Users, Store, Bike, LayoutDashboard,
  Search, TrendingUp, Clock, AlertCircle, CheckCircle2, XCircle
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import BarChart from '../../components/ui/BarChart'
import Avatar from '../../components/ui/Avatar'
import ProfileSettings from '../../components/dashboard/ProfileSettings'
import { formatXOF, formatCompact } from '../../utils/format'
import api from '../../api/axios'
import { useToast } from '../../context/ToastContext'

const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

const disputeStatusStyle = {
  open:      'bg-red-50 text-red-600 border-red-100',
  in_review: 'bg-amber-50 text-amber-700 border-amber-100',
  resolved:  'bg-emerald-50 text-emerald-700 border-emerald-100',
  closed:    'bg-slate-50 text-slate-600 border-slate-100',
}
const disputeStatusLabel = {
  open: 'Ouvert', in_review: 'En révision', resolved: 'Résolu', closed: 'Clos'
}

export default function AdminDashboard() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [pendingVendors, setPendingVendors] = useState([])
  const [pendingCouriers, setPendingCouriers] = useState([])
  const [pendingShops, setPendingShops] = useState([])
  const [disputes, setDisputes] = useState([])
  const [selectedDispute, setSelectedDispute] = useState(null)
  const [adminNote, setAdminNote] = useState('')
  const [resolutionType, setResolutionType] = useState('pending')
  const [refundAmount, setRefundAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const toast = useToast()

  useEffect(() => {
    const hash = location.hash.replace('#', '')
    setActiveTab(hash || 'overview')
  }, [location])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes, pVendors, pCouriers, pShops, disputesRes] = await Promise.all([
        api.get('/admin/stats').catch(() => ({ data: {} })),
        api.get('/admin/users').catch(() => ({ data: { data: [] } })),
        api.get('/admin/vendors/pending').catch(() => ({ data: [] })),
        api.get('/admin/couriers/pending').catch(() => ({ data: [] })),
        api.get('/admin/shops/pending').catch(() => ({ data: [] })),
        api.get('/admin/disputes').catch(() => ({ data: { data: [] } })),
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data.data || [])
      setPendingVendors(pVendors.data || [])
      setPendingCouriers(pCouriers.data || [])
      setPendingShops(pShops.data || [])
      setDisputes(disputesRes.data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const navItems = [
    { to: '#overview',  label: 'Vue d\'ensemble', icon: 'LayoutDashboard', isActive: activeTab === 'overview'  },
    { to: '#vendors',   label: 'Vendeurs',         icon: 'Store',           isActive: activeTab === 'vendors'   },
    { to: '#couriers',  label: 'Livreurs',         icon: 'Bike',            isActive: activeTab === 'couriers'  },
    { to: '#users',     label: 'Utilisateurs',     icon: 'Users',           isActive: activeTab === 'users'     },
    { to: '#disputes',  label: 'Litiges',          icon: 'ShieldAlert',     isActive: activeTab === 'disputes'  },
    { to: '#profile',   label: 'Mon compte',       icon: 'User',            isActive: activeTab === 'profile'   },
  ]

  const handleValidate = async (userId, action) => {
    setSubmitting(true)
    try {
      await api.put(`/admin/accounts/${userId}/validate`, { action })
      toast.success(action === 'approve' ? 'Compte validé et activé !' : 'Compte rejeté.')
      await loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur.')
    } finally { setSubmitting(false) }
  }

  const handleValidateShop = async (shopId, action) => {
    setSubmitting(true)
    try {
      await api.put(`/admin/shops/${shopId}/validate`, { action })
      toast.success(action === 'approve' ? 'Boutique validée et activée !' : 'Boutique rejetée.')
      await loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur.')
    } finally { setSubmitting(false) }
  }

  const handleUserStatus = async (userId, status) => {
    setSubmitting(true)
    try {
      await api.put(`/admin/users/${userId}/status`, { status })
      toast.success('Statut utilisateur mis à jour.')
      await loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur.')
    } finally { setSubmitting(false) }
  }

  const handleResolveDispute = async (disputeId, status) => {
    setSubmitting(true)
    try {
      await api.put(`/admin/disputes/${disputeId}/resolve`, {
        status,
        admin_note: adminNote,
        resolution_type: resolutionType !== 'pending' ? resolutionType : undefined,
        refund_amount: refundAmount ? parseFloat(refundAmount) : undefined,
      })
      setSelectedDispute(null)
      setAdminNote('')
      setResolutionType('pending')
      setRefundAmount('')
      toast.success('Litige traité.')
      await loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur.')
    } finally { setSubmitting(false) }
  }

  const filteredUsers = users.filter(u =>
    !searchTerm ||
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.includes(searchTerm)
  )

  const pendingTotal = pendingVendors.length + pendingCouriers.length + pendingShops.length

  return (
    <DashboardLayout title="Administration BeniMarket" subtitle="Tableau de bord opérationnel" navItems={navItems}>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon="Wallet"      label="Revenu plateforme"   value={formatXOF(stats?.platform_revenue || 0)}  hint="Frais de service uniquement"             tone="teal"  />
        <StatCard icon="Users"       label="Utilisateurs"        value={formatCompact(stats?.total_users || 0)}                                   tone="amber" />
        <StatCard icon="Store"       label="En attente valid."   value={((stats?.pending_vendors || 0) + (stats?.pending_couriers || 0)).toString()} tone="plum"  />
        <StatCard icon="ShieldAlert" label="Litiges ouverts"     value={(stats?.open_disputes || 0).toString()}                                   tone="amber" />
      </div>

      <div className="mt-6">

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid gap-6 lg:grid-cols-2">

              {/* Graphique ventes */}
              <div className="card p-6">
                <h2 className="font-display font-bold text-ink-900 mb-1">Ventes mensuelles</h2>
                <p className="text-xs text-ink-400 mb-4">En FCFA — année en cours</p>
                <BarChart data={stats.sales_by_month || Array(12).fill(0)} labels={months} />
              </div>

              {/* Stats résumées */}
              <div className="card p-6">
                <h2 className="font-display font-bold text-ink-900 mb-4">Indicateurs clés</h2>
                <div className="space-y-1">
                  {[
                    { label: 'Clients',          value: stats.total_clients,  color: 'bg-teal-500'    },
                    { label: 'Vendeurs',          value: stats.total_vendors,  color: 'bg-amber-500'   },
                    { label: 'Livreurs',          value: stats.total_couriers, color: 'bg-blue-500'    },
                    { label: 'Commandes payées',  value: stats.paid_orders,    color: 'bg-emerald-500' },
                    { label: 'Boutiques actives', value: stats.active_shops,   color: 'bg-violet-500'  },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex items-center gap-3 py-2.5 border-b border-ink-50 last:border-0">
                      <div className={`h-2 w-2 rounded-full shrink-0 ${color}`} />
                      <span className="flex-1 text-sm text-ink-600">{label}</span>
                      <span className="font-bold text-ink-900">{value || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Répartition financière — qui perçoit quoi */}
            <div className="card p-6">
              <h2 className="font-display font-bold text-ink-900 mb-1">Répartition des flux financiers</h2>
              <p className="text-xs text-ink-400 mb-4">
                Commandes payées — le revenu de la plateforme correspond <span className="font-semibold text-ink-600">uniquement</span> aux frais de service.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
                  <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide">Revenu plateforme</p>
                  <p className="mt-1 font-display text-xl font-bold text-teal-900">{formatXOF(stats.platform_revenue || 0)}</p>
                  <p className="text-xs text-teal-600 mt-0.5">Frais de service (admin)</p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Versements vendeurs</p>
                  <p className="mt-1 font-display text-xl font-bold text-amber-900">{formatXOF(stats.vendor_payouts || 0)}</p>
                  <p className="text-xs text-amber-600 mt-0.5">Montant des produits</p>
                </div>
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Versements livreurs</p>
                  <p className="mt-1 font-display text-xl font-bold text-blue-900">{formatXOF(stats.courier_payouts || 0)}</p>
                  <p className="text-xs text-blue-600 mt-0.5">600 F par livraison</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-ink-50 px-4 py-3">
                <span className="text-sm text-ink-500">Volume total des transactions (GMV) — n'est pas un revenu</span>
                <span className="font-bold text-ink-700">{formatXOF(stats.gmv || 0)}</span>
              </div>
            </div>

            {/* Comptes et boutiques en attente */}
            {pendingTotal > 0 && (
              <div className="space-y-4">
                {/* Comptes (vendeurs/livreurs) */}
                {(pendingVendors.length + pendingCouriers.length) > 0 && (
                  <div className="card overflow-hidden">
                    <div className="flex items-center gap-2 px-6 py-4 border-b border-ink-100 bg-amber-50">
                      <Clock size={18} className="text-amber-600" />
                      <h2 className="font-display font-bold text-ink-900">Comptes en attente</h2>
                      <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {pendingVendors.length + pendingCouriers.length}
                      </span>
                    </div>
                    <div className="divide-y divide-ink-100">
                      {[...pendingVendors, ...pendingCouriers].map(u => (
                        <div key={u.id} className="flex items-center gap-4 px-6 py-4 hover:bg-ink-50">
                          <Avatar name={u.name} role={u.role} size="sm" rounded="rounded-xl" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-ink-900 truncate">{u.name}</p>
                            <p className="text-xs text-ink-400">{u.role === 'vendor' ? 'Vendeur' : 'Livreur'} · {u.phone}</p>
                            {u.shop && <p className="text-xs text-teal-600 font-medium mt-0.5">{u.shop.name}</p>}
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => handleValidate(u.id, 'approve')} disabled={submitting}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 text-xs font-semibold hover:bg-emerald-200 disabled:opacity-50">
                              <Check size={13} /> Valider
                            </button>
                            <button onClick={() => handleValidate(u.id, 'reject')} disabled={submitting}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-100 text-red-600 text-xs font-semibold hover:bg-red-200 disabled:opacity-50">
                              <X size={13} /> Rejeter
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Boutiques en attente */}
                {pendingShops.length > 0 && (
                  <div className="card overflow-hidden">
                    <div className="flex items-center gap-2 px-6 py-4 border-b border-ink-100 bg-teal-50">
                      <Store size={18} className="text-teal-600" />
                      <h2 className="font-display font-bold text-ink-900">Boutiques en attente</h2>
                      <span className="bg-teal-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pendingShops.length}</span>
                    </div>
                    <div className="divide-y divide-ink-100">
                      {pendingShops.map(s => (
                        <div key={s.id} className="flex items-center gap-4 px-6 py-4 hover:bg-ink-50">
                          <div className="h-9 w-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                            <Store size={18} className="text-amber-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-ink-900 truncate">{s.name}</p>
                            <p className="text-xs text-ink-400">{s.vendor?.name} · {s.city}</p>
                            {s.description && <p className="text-xs text-ink-500 mt-0.5 truncate">{s.description}</p>}
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => handleValidateShop(s.id, 'approve')} disabled={submitting}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 text-xs font-semibold hover:bg-emerald-200 disabled:opacity-50">
                              <Check size={13} /> Activer
                            </button>
                            <button onClick={() => handleValidateShop(s.id, 'reject')} disabled={submitting}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-100 text-red-600 text-xs font-semibold hover:bg-red-200 disabled:opacity-50">
                              <X size={13} /> Rejeter
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── VENDEURS ── */}
        {activeTab === 'vendors' && (
          <div className="space-y-6 animate-fade-in">

            {/* Comptes vendeurs en attente */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-ink-900">Comptes vendeurs en attente</h2>
                <span className="text-sm text-ink-500">{pendingVendors.length} compte(s)</span>
              </div>
              {pendingVendors.length === 0 ? (
                <div className="card p-12 text-center">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-300 mb-3" />
                  <p className="font-semibold text-ink-600">Aucun compte vendeur en attente</p>
                </div>
              ) : pendingVendors.map(v => (
                <div key={v.id} className="card p-5 flex items-start gap-4">
                  <Avatar name={v.name} role="vendor" size="md" rounded="rounded-xl" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-ink-900">{v.name}</p>
                    <p className="text-sm text-ink-500">{v.phone}</p>
                    {v.shop && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full font-medium">{v.shop.name}</span>
                        <span className="text-xs bg-ink-100 text-ink-600 px-2 py-0.5 rounded-full">{v.shop.city}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleValidate(v.id, 'approve')} disabled={submitting}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50">
                      <Check size={14} /> Valider
                    </button>
                    <button onClick={() => handleValidate(v.id, 'reject')} disabled={submitting}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-100 text-red-600 text-sm font-semibold hover:bg-red-200 disabled:opacity-50">
                      <X size={14} /> Rejeter
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Boutiques en attente de validation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-ink-900">Boutiques en attente de validation</h2>
                  <p className="text-xs text-ink-400 mt-0.5">
                    Une boutique validée permet au vendeur d'ajouter ses produits.
                  </p>
                </div>
                <span className="text-sm text-ink-500">{pendingShops.length} boutique(s)</span>
              </div>

              {pendingShops.length === 0 ? (
                <div className="card p-12 text-center">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-300 mb-3" />
                  <p className="font-semibold text-ink-600">Aucune boutique en attente</p>
                  <p className="text-sm text-ink-400 mt-1">Toutes les boutiques ont été traitées.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingShops.map(s => (
                    <div key={s.id} className="card p-5 border-l-4 border-amber-400">
                      <div className="flex items-start gap-4">
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shrink-0">
                          <Store size={20} className="text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className="font-bold text-ink-900">{s.name}</p>
                            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full font-medium">
                              En attente
                            </span>
                          </div>
                          <p className="text-sm text-ink-500 flex items-center gap-1.5">
                            <Avatar name={s.vendor?.name || '?'} role="vendor" size="sm" rounded="rounded-md" />
                            {s.vendor?.name || '–'} · {s.vendor?.phone || '–'}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="text-xs bg-ink-100 text-ink-600 px-2 py-0.5 rounded-full">{s.city || 'Parakou'}</span>
                            {s.phone && <span className="text-xs bg-ink-100 text-ink-600 px-2 py-0.5 rounded-full">{s.phone}</span>}
                          </div>
                          {s.description && (
                            <p className="text-sm text-ink-500 mt-2 line-clamp-2 italic">"{s.description}"</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <button
                            onClick={() => handleValidateShop(s.id, 'approve')}
                            disabled={submitting}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
                          >
                            <Check size={14} /> Activer
                          </button>
                          <button
                            onClick={() => handleValidateShop(s.id, 'reject')}
                            disabled={submitting}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-100 text-red-600 text-sm font-semibold hover:bg-red-200 disabled:opacity-50"
                          >
                            <X size={14} /> Rejeter
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ── LIVREURS ── */}
        {activeTab === 'couriers' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-ink-900">Livreurs en attente</h2>
              <span className="text-sm text-ink-500">{pendingCouriers.length} compte(s)</span>
            </div>
            {pendingCouriers.length === 0 ? (
              <div className="card p-16 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-300 mb-3" />
                <p className="font-semibold text-ink-600">Aucun livreur en attente</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingCouriers.map(c => (
                  <div key={c.id} className="card p-5 flex items-start gap-4">
                    <Avatar name={c.name} role="courier" size="md" rounded="rounded-xl" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-ink-900">{c.name}</p>
                      <p className="text-sm text-ink-500">{c.phone}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {c.vehicle_type && <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">{c.vehicle_type}</span>}
                        {c.plate_number && <span className="text-xs bg-ink-100 text-ink-600 px-2 py-0.5 rounded-full font-mono">{c.plate_number}</span>}
                        <span className="text-xs bg-ink-100 text-ink-600 px-2 py-0.5 rounded-full">{c.zone || 'Parakou'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleValidate(c.id, 'approve')} disabled={submitting}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50">
                        <Check size={14} /> Valider
                      </button>
                      <button onClick={() => handleValidate(c.id, 'reject')} disabled={submitting}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-100 text-red-600 text-sm font-semibold hover:bg-red-200 disabled:opacity-50">
                        <X size={14} /> Rejeter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── UTILISATEURS ── */}
        {activeTab === 'users' && (
          <div className="space-y-4 animate-fade-in">
            <div className="relative max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input className="input pl-9 text-sm" placeholder="Rechercher un utilisateur…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="card overflow-hidden">
              <div className="hidden lg:grid grid-cols-[auto_1fr_120px_120px_150px] gap-4 px-5 py-3 bg-ink-50 border-b border-ink-100 text-xs font-bold text-ink-400 uppercase tracking-wider">
                <span />
                <span>Nom</span>
                <span>Rôle</span>
                <span>Statut</span>
                <span>Actions</span>
              </div>
              {filteredUsers.length === 0 ? (
                <div className="p-12 text-center text-sm text-ink-400">Aucun utilisateur trouvé.</div>
              ) : (
                <div className="divide-y divide-ink-100">
                  {filteredUsers.map(u => (
                    <div key={u.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 hover:bg-ink-50 lg:grid lg:grid-cols-[auto_1fr_120px_120px_150px]">
                      <Avatar name={u.name} role={u.role} size="sm" rounded="rounded-lg" />
                      <div className="min-w-0">
                        <p className="font-semibold text-ink-900 text-sm truncate">{u.name}</p>
                        <p className="text-xs text-ink-400 truncate">{u.email || u.phone}</p>
                      </div>
                      <span className="text-xs font-medium capitalize px-2 py-1 rounded-full bg-ink-100 text-ink-600 w-fit">{u.role}</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full w-fit ${
                        u.status === 'actif'  ? 'bg-emerald-50 text-emerald-600' :
                        u.status === 'banned' ? 'bg-red-50 text-red-600' :
                        'bg-amber-50 text-amber-600'}`}>
                        {u.status}
                      </span>
                      <div className="flex gap-1.5">
                        {u.status !== 'actif' && (
                          <button onClick={() => handleUserStatus(u.id, 'actif')} disabled={submitting}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:opacity-50 font-medium">
                            <CheckCircle2 size={12} /> Activer
                          </button>
                        )}
                        {u.status !== 'banned' && (
                          <button onClick={() => handleUserStatus(u.id, 'banned')} disabled={submitting}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 font-medium">
                            <XCircle size={12} /> Bannir
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            try {
                              const r = await api.post(`/admin/users/${u.id}/password-reset`)
                              toast.success('Lien de réinitialisation généré.')
                              // Copier l'URL dans le presse-papier
                              if (r.data.reset_url) {
                                navigator.clipboard?.writeText(r.data.reset_url)
                                  .then(() => toast.info('URL copiée dans le presse-papier.'))
                                  .catch(() => {})
                              }
                            } catch {
                              toast.error('Erreur lors de la génération du lien.')
                            }
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 font-medium"
                        >
                          🔑 Reset mdp
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── LITIGES ── */}
        {activeTab === 'disputes' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-ink-900">Litiges</h2>
              <span className="text-sm text-ink-500">{disputes.length} au total</span>
            </div>
            {disputes.length === 0 ? (
              <div className="card p-16 text-center">
                <ShieldAlert className="mx-auto h-12 w-12 text-ink-200 mb-3" />
                <p className="font-semibold text-ink-600">Aucun litige enregistré</p>
              </div>
            ) : (
              <div className="space-y-3">
                {disputes.map(d => (
                  <div key={d.id} className={`card p-5 border-l-4 ${d.status === 'open' ? 'border-red-400' : d.status === 'resolved' ? 'border-emerald-400' : 'border-amber-400'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${disputeStatusStyle[d.status] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                            {disputeStatusLabel[d.status] || d.status}
                          </span>
                          <span className="text-xs text-ink-400">Commande : <span className="font-mono font-semibold text-ink-700">{d.order?.reference}</span></span>
                        </div>
                        <p className="font-bold text-ink-900">{d.reason}</p>
                        <p className="text-xs text-ink-500 mt-0.5">Client : {d.client?.name}</p>
                        {d.description && <p className="text-sm text-ink-600 mt-2 line-clamp-2">{d.description}</p>}
                      </div>
                      {d.status === 'open' && (
                        <button onClick={() => setSelectedDispute(d)} className="btn-primary btn-sm shrink-0 flex items-center gap-1.5">
                          <AlertCircle size={14} /> Traiter
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && <ProfileSettings />}
      </div>

      {/* Modal résolution litige */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={() => setSelectedDispute(null)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-white text-lg">Résoudre le litige</h3>
                <button onClick={() => setSelectedDispute(null)} className="h-8 w-8 grid place-items-center rounded-xl bg-white/20 hover:bg-white/30 text-white">
                  <X size={18} />
                </button>
              </div>
              <p className="mt-1 text-sm text-red-100">{selectedDispute.reason} — {selectedDispute.client?.name}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">Note administrative</label>
                <textarea className="input min-h-[90px] resize-none py-3" placeholder="Expliquez la décision prise…" value={adminNote} onChange={e => setAdminNote(e.target.value)} />
              </div>
              <div>
                <label className="label">Décision de remboursement</label>
                <select className="input" value={resolutionType} onChange={e => setResolutionType(e.target.value)}>
                  <option value="pending">En attente (pas encore décidé)</option>
                  <option value="full_refund">Remboursement total</option>
                  <option value="partial_refund">Remboursement partiel</option>
                  <option value="rejected">Réclamation rejetée</option>
                </select>
              </div>
              {resolutionType === 'partial_refund' && (
                <div>
                  <label className="label">Montant à rembourser (FCFA)</label>
                  <input
                    type="number"
                    className="input"
                    placeholder="Ex : 2000"
                    value={refundAmount}
                    onChange={e => setRefundAmount(e.target.value)}
                    min="0"
                  />
                </div>
              )}
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => handleResolveDispute(selectedDispute.id, 'in_review')} disabled={submitting}
                  className="py-2.5 rounded-xl bg-amber-100 text-amber-700 text-sm font-semibold hover:bg-amber-200 disabled:opacity-50">
                  En révision
                </button>
                <button onClick={() => handleResolveDispute(selectedDispute.id, 'resolved')} disabled={submitting}
                  className="py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50">
                  Résoudre
                </button>
                <button onClick={() => handleResolveDispute(selectedDispute.id, 'closed')} disabled={submitting}
                  className="py-2.5 rounded-xl bg-ink-200 text-ink-700 text-sm font-semibold hover:bg-ink-300 disabled:opacity-50">
                  Clore
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
