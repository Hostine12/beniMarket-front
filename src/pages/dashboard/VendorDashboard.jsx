import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Plus, X, Trash2, Pencil, Package, ShoppingCart, Wallet, Settings,
  LayoutDashboard, Check, Store, ImagePlus, Camera, TrendingUp,
  ChevronRight, AlertCircle, CheckCircle2, Phone, MapPin
} from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import DisputePanel from '../../components/dispute/DisputePanel'
import ProfileSettings from '../../components/dashboard/ProfileSettings'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'
import BarChart from '../../components/ui/BarChart'
import { formatXOF, formatDate, validateBeninPhone, formatPhoneInput, getPhoneError } from '../../utils/format'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

export default function VendorDashboard() {
  const location = useLocation()
  const { user } = useAuth()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('overview')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null) // fiche détaillée d'une commande (#9)
  const [wallet, setWallet] = useState(null)
  const [categories, setCategories] = useState([])
  const [noShop, setNoShop] = useState(false)
  const [shopForm, setShopForm] = useState({ name: '', description: '', city: 'Parakou', phone: '' })
  const [creatingShop, setCreatingShop] = useState(false)
  // Édition de la boutique existante (#7)
  const [shopEdit, setShopEdit] = useState({ name: '', description: '', city: '', address: '', phone: '', opening_hours: '', logo: null })
  const [savingShop, setSavingShop] = useState(false)
  const shopLogoRef = useRef(null)

  const [productForm, setProductForm] = useState({
    name: '', parent_category_id: '', category_id: '', description: '', price: '', stock: '',
  })
  // Sous-catégories disponibles selon la catégorie parente choisie
  const subcategories = productForm.parent_category_id
    ? (categories.find(c => c.id === parseInt(productForm.parent_category_id))?.subcategories ?? [])
    : []
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const hash = location.hash.replace('#', '')
    setActiveTab(hash || 'overview')
  }, [location])

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [shopRes, productsRes, ordersRes, catsRes, walletRes] = await Promise.all([
        api.get('/vendor/shop').catch(e => e.response?.status === 404 ? { data: null, status: 404 } : Promise.reject(e)),
        api.get('/vendor/products').catch(() => ({ data: [] })),
        api.get('/orders').catch(() => ({ data: { data: [] } })),
        api.get('/categories').catch(() => ({ data: [] })),
        api.get('/wallet').catch(() => ({ data: null })),
      ])

      if (shopRes.status === 404 || !shopRes.data) {
        setNoShop(true)
      } else {
        setShop(shopRes.data)
        setNoShop(false)
      }

      setProducts(productsRes.data || [])
      setOrders(ordersRes.data.data || ordersRes.data || [])
      setWallet(walletRes.data || null)
      setCategories(catsRes.data || [])
    } catch (err) {
      if (err.response?.status === 404) setNoShop(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // Synchronise le formulaire d'édition quand la boutique est chargée
  useEffect(() => {
    if (shop) setShopEdit({
      name: shop.name || '', description: shop.description || '', city: shop.city || '',
      address: shop.address || '', phone: shop.phone || '', opening_hours: shop.opening_hours || '',
      logo: shop.logo || null,
    })
  }, [shop])

  const onShopLogo = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Image trop lourde (max 2 Mo).'); return }
    const reader = new FileReader()
    reader.onload = ev => setShopEdit(s => ({ ...s, logo: ev.target.result }))
    reader.readAsDataURL(file)
  }

  const handleShopUpdate = async (e) => {
    e.preventDefault()
    if (!shop) return
    if (shopEdit.phone && !validateBeninPhone(shopEdit.phone)) {
      toast.error('Le numéro de téléphone doit être au format béninois (ex: 0142162127).')
      return
    }
    setSavingShop(true)
    try {
      const r = await api.put(`/shops/${shop.id}`, shopEdit)
      setShop(prev => ({ ...prev, ...r.data }))
      toast.success('Boutique mise à jour !')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour.')
    } finally {
      setSavingShop(false)
    }
  }

  // Marque une commande « en préparation » (depuis la liste ou la fiche détaillée)
  const markPreparing = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: 'preparing' })
      toast.success('Commande marquée en préparation.')
      setSelectedOrder(null)
      loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur.')
    }
  }

  const navItems = [
    { to: '#overview', label: 'Vue d\'ensemble', icon: 'LayoutDashboard', isActive: activeTab === 'overview' },
    { to: '#products', label: 'Mes produits', icon: 'Package', isActive: activeTab === 'products' },
    { to: '#orders', label: 'Commandes', icon: 'ShoppingCart', isActive: activeTab === 'orders' },
    { to: '#wallet', label: 'Portefeuille', icon: 'Wallet', isActive: activeTab === 'wallet' },
    { to: '#disputes', label: 'Litiges', icon: 'AlertTriangle', isActive: activeTab === 'disputes' },
    { to: '#settings', label: 'Boutique', icon: 'Settings', isActive: activeTab === 'settings' },
    { to: '#profile', label: 'Mon compte', icon: 'User', isActive: activeTab === 'profile' },
  ]

  const handleCreateShop = async (e) => {
    e.preventDefault()
    if (shopForm.phone && !validateBeninPhone(shopForm.phone)) {
      toast.error('Le numéro de téléphone doit être au format béninois (ex: 0142162127).')
      return
    }
    setCreatingShop(true)
    try {
      const res = await api.post('/shops', shopForm)
      setShop(res.data)
      setNoShop(false)
      toast.success('Boutique créée ! En attente de validation par l\'administration.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la création.')
    } finally {
      setCreatingShop(false)
    }
  }

  const openEdit = (p) => {
    setEditingProduct(p)
    // Trouver la catégorie parente du produit
    const directCat = categories.find(c => c.id === (p.category_id || p.category?.id))
    const isSubcat = directCat?.parent_id !== null && directCat?.parent_id !== undefined
    const parentId = isSubcat
      ? String(directCat.parent_id)
      : String(directCat?.id ?? '')
    setProductForm({
      name: p.name || '',
      parent_category_id: parentId,
      category_id: isSubcat ? String(p.category_id || p.category?.id || '') : '',
      description: p.description || '',
      price: p.price || '',
      stock: p.stock || '',
    })
    setImagePreview(p.images?.[0] || null)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingProduct(null)
    setProductForm({ name: '', parent_category_id: '', category_id: '', description: '', price: '', stock: '' })
    setImagePreview(null)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    // Sécurise les valeurs numériques : on n'envoie jamais NaN/0 par accident.
    const priceVal = parseFloat(productForm.price)
    const stockVal = parseInt(productForm.stock, 10)
    if (Number.isNaN(priceVal) || priceVal < 0) { toast.error('Veuillez saisir un prix valide.'); return }
    if (!Number.isInteger(stockVal) || stockVal < 0) { toast.error('Veuillez saisir une quantité en stock valide.'); return }
    setIsSubmitting(true)
    // category_id = sous-catégorie si choisie, sinon la catégorie parente
    const finalCategoryId = productForm.category_id || productForm.parent_category_id || null
    const payload = {
      name: productForm.name,
      description: productForm.description,
      price: priceVal,
      stock: stockVal,
      category_id: finalCategoryId ? parseInt(finalCategoryId) : null,
      images: imagePreview ? [imagePreview] : [],
    }
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload)
        toast.success('Produit mis à jour !')
      } else {
        await api.post('/products', payload)
        toast.success('Produit publié avec succès !')
      }
      closeForm()
      await loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return
    try {
      await api.delete(`/products/${id}`)
      setProducts(prev => prev.filter(p => p.id !== id))
      toast.success('Produit supprimé.')
    } catch (err) {
      toast.error('Erreur lors de la suppression.')
    }
  }

  // Le vendeur ne perçoit que le montant des produits (subtotal) : ni les frais de
  // service (revenu plateforme), ni la livraison (reversée au livreur).
  const revenue = orders.filter(o => o.escrow_status === 'released').reduce((s, o) => s + (o.subtotal ?? 0), 0)
  const pendingRevenue = orders.filter(o => o.payment_status === 'paid' && o.escrow_status === 'held').reduce((s, o) => s + (o.subtotal ?? 0), 0)
  // Solde réel du portefeuille (somme des paiements crédités). Fallback sur le
  // calcul local tant que l'API portefeuille n'a pas répondu.
  const walletBalance = wallet ? wallet.balance : revenue
  const walletTxns = wallet?.transactions?.data ?? []
  const pending = orders.filter(o => ['pending', 'confirmed', 'preparing'].includes(o.status)).length
  const lowStock = products.filter(p => p.stock <= 5).length

  if (!user) return <div className="flex h-screen items-center justify-center text-sm text-ink-500">Chargement…</div>

  if (noShop) {
    return (
      <DashboardLayout title="Espace Vendeur" subtitle="Créez votre boutique pour commencer à vendre" navItems={navItems}>
        <div className="max-w-lg mx-auto card p-8 text-center">
          <Store size={48} className="mx-auto text-teal-600 mb-4" />
          <h2 className="font-display text-xl font-bold text-ink-900 mb-2">Créez votre boutique</h2>
          <p className="text-sm text-ink-500 mb-6">Une fois créée, l'administration validera votre boutique sous 72h.</p>
          <form onSubmit={handleCreateShop} className="space-y-4 text-left">
            <div>
              <label className="label">Nom de la boutique</label>
              <input className="input" placeholder="Ex: Saveurs de Mama Aïssa" value={shopForm.name} onChange={e => setShopForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input min-h-[80px] resize-none py-2" placeholder="Décrivez vos produits…" value={shopForm.description} onChange={e => setShopForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div>
              <label className="label">Ville</label>
              <input className="input" value={shopForm.city} onChange={e => setShopForm(p => ({ ...p, city: e.target.value }))} />
            </div>
            <div>
              <label className="label">Téléphone de la boutique</label>
              <input className={`input ${getPhoneError(shopForm.phone) ? 'ring-2 ring-red-300 border-red-300' : ''}`} type="tel" inputMode="numeric" placeholder="Ex: 0142162127" value={shopForm.phone} onChange={e => setShopForm(p => ({ ...p, phone: formatPhoneInput(e.target.value) }))} maxLength={10} />
              {getPhoneError(shopForm.phone) && <p className="mt-1 text-xs text-red-500 font-medium">{getPhoneError(shopForm.phone)}</p>}
            </div>
            <button type="submit" disabled={creatingShop} className="btn-primary w-full disabled:opacity-50">
              {creatingShop ? 'Création…' : 'Créer ma boutique'}
            </button>
          </form>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title={`Mon étal — ${shop?.name || ''}`}
      subtitle={
        shop?.status === 'pending' ? 'En attente de validation admin'
        : shop?.status === 'active' ? 'Boutique active'
        : shop?.status
      }
      navItems={navItems}
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon="Wallet" label="Encaissés" value={formatXOF(walletBalance)} tone="teal" />
        <StatCard icon="ShoppingCart" label="Commandes" value={orders.length.toString()} tone="amber" />
        <StatCard icon="Package" label="Produits" value={products.length.toString()} tone="plum" />
        <StatCard icon="AlertTriangle" label="Stock bas" value={lowStock.toString()} tone="amber" />
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-5 animate-fade-in">
            {/* Bannière revenus */}
            <div className="card p-5 bg-gradient-to-r from-teal-600 to-emerald-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-teal-100">Solde du portefeuille</p>
                  <p className="font-display text-3xl font-bold mt-1">{formatXOF(walletBalance)}</p>
                  <p className="text-xs text-teal-200 mt-1">
                    {orders.filter(o => o.escrow_status === 'released').length} commande(s) livrée(s) et confirmée(s)
                  </p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
                  <TrendingUp size={28} className="text-white" />
                </div>
              </div>
              {pendingRevenue > 0 && (
                <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2 text-sm text-teal-100">
                  <AlertCircle size={15} className="text-amber-300 shrink-0" />
                  {formatXOF(pendingRevenue)} en séquestre · libéré après confirmation de livraison
                </div>
              )}
              {pending > 0 && (
                <div className="mt-2 flex items-center gap-2 text-sm text-teal-100">
                  <AlertCircle size={15} className="text-amber-300 shrink-0" />
                  {pending} commande(s) en attente de préparation
                </div>
              )}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {/* Commandes récentes */}
              <div className="card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
                  <h2 className="font-display font-bold text-ink-900 text-sm">Commandes récentes</h2>
                  <a href="#orders" className="flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline">
                    Voir tout <ChevronRight size={12} />
                  </a>
                </div>
                {orders.length === 0 ? (
                  <div className="px-5 py-10 text-center text-sm text-ink-400">
                    <ShoppingCart className="mx-auto h-8 w-8 text-ink-200 mb-2" />
                    Aucune commande pour le moment.
                  </div>
                ) : (
                  <div className="divide-y divide-ink-100">
                    {orders.slice(0, 5).map(o => (
                      <div key={o.id} className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-ink-50">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-ink-900 truncate">{o.reference}</p>
                          <p className="text-xs text-ink-400">{formatXOF(o.total)}</p>
                        </div>
                        <StatusBadge status={o.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Produits */}
              <div className="card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
                  <h2 className="font-display font-bold text-ink-900 text-sm">Mes produits</h2>
                  <a href="#products" className="flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline">
                    Gérer <ChevronRight size={12} />
                  </a>
                </div>
                {products.length === 0 ? (
                  <div className="px-5 py-10 text-center text-sm text-ink-400">
                    <Package className="mx-auto h-8 w-8 text-ink-200 mb-2" />
                    Aucun produit. Ajoutez-en un !
                  </div>
                ) : (
                  <div className="divide-y divide-ink-100">
                    {products.slice(0, 5).map(p => (
                      <div key={p.id} className="px-5 py-3 flex items-center gap-3 hover:bg-ink-50">
                        <div className="h-10 w-10 rounded-xl bg-ink-100 overflow-hidden shrink-0">
                          {p.images?.[0]
                            ? <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                            : <div className="h-full w-full flex items-center justify-center"><Package size={16} className="text-ink-300" /></div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-ink-800 truncate">{p.name}</p>
                          <p className="text-xs text-ink-400">{formatXOF(p.price)}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${p.stock <= 5 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {p.stock <= 5 ? `Bas (${p.stock})` : `${p.stock}`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="font-display font-bold text-ink-900">Mes produits ({products.length})</h2>
              {shop?.status === 'active' && (
                <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
                  <Plus size={16} /> Ajouter un produit
                </button>
              )}
              {shop?.status !== 'active' && (
                <p className="text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">Boutique en attente de validation</p>
              )}
            </div>

            {products.length === 0 ? (
              <div className="card p-12 text-center text-ink-400 text-sm">
                <Package className="mx-auto h-12 w-12 text-ink-200 mb-3" />
                Aucun produit enregistré.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map(p => (
                  <div key={p.id} className="card overflow-hidden group">
                    <div className="relative h-40 bg-ink-100">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100">
                          <Package size={36} className="text-teal-300" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(p)}
                          className="h-8 w-8 grid place-items-center rounded-lg bg-white/90 text-teal-600 hover:bg-teal-50 shadow"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="h-8 w-8 grid place-items-center rounded-lg bg-white/90 text-red-400 hover:bg-red-50 hover:text-red-600 shadow"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <span className={`absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium ${p.stock <= 5 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                        {p.stock <= 5 ? `Stock bas (${p.stock})` : `En stock (${p.stock})`}
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-ink-900 truncate">{p.name}</p>
                      <p className="text-xs text-ink-400 mt-0.5">{p.category?.name || 'Sans catégorie'}</p>
                      <p className="text-sm font-bold text-teal-700 mt-2">{formatXOF(p.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="card max-w-3xl overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
              <div>
                <h2 className="font-display font-bold text-ink-900">Commandes reçues</h2>
                <p className="text-xs text-ink-400 mt-0.5">{orders.length} commande(s) au total</p>
              </div>
              {pending > 0 && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold">
                  {pending} en attente
                </span>
              )}
            </div>
            {orders.length === 0 ? (
              <div className="p-12 text-center text-sm text-ink-400">
                <ShoppingCart className="mx-auto h-10 w-10 text-ink-200 mb-3" />
                <p className="font-semibold text-ink-600">Aucune commande reçue</p>
              </div>
            ) : orders.map(o => (
              <div key={o.id} className={`px-5 py-4 flex items-center gap-4 hover:bg-ink-50 border-b border-ink-100 last:border-0 ${o.status === 'pending' ? 'border-l-4 border-l-amber-400' : o.status === 'preparing' ? 'border-l-4 border-l-violet-400' : 'border-l-4 border-l-transparent'}`}>
                <button onClick={() => setSelectedOrder(o)} className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-ink-900">{o.reference}</p>
                  <p className="text-xs text-ink-400 mt-0.5">
                    {o.items?.length || 0} article(s) · {formatXOF(o.total)}
                    {o.client?.name && ` · ${o.client.name}`}
                  </p>
                  <p className="text-[11px] text-ink-400 mt-0.5">{formatDate(o.created_at)}</p>
                </button>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={o.status} />
                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="flex items-center gap-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-100 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    Détails <ChevronRight size={13} />
                  </button>
                  {o.status === 'pending' && (
                    <button
                      onClick={() => markPreparing(o.id)}
                      className="flex items-center gap-1 text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-xl transition-colors"
                    >
                      <CheckCircle2 size={13} /> Préparer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="space-y-5 animate-fade-in">
            {/* Solde */}
            <div className="card p-6 bg-gradient-to-r from-teal-600 to-emerald-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-teal-100">Solde du portefeuille</p>
                  <p className="font-display text-4xl font-bold mt-1">{formatXOF(walletBalance)}</p>
                  <p className="text-xs text-teal-200 mt-2">
                    Total reçu : {formatXOF(wallet?.total_received ?? walletBalance)}
                    {pendingRevenue > 0 && ` · ${formatXOF(pendingRevenue)} en séquestre`}
                  </p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Wallet size={28} className="text-white" />
                </div>
              </div>
            </div>

            {/* Historique des paiements reçus */}
            <div className="card overflow-hidden">
              <div className="px-6 py-4 border-b border-ink-100">
                <h2 className="font-display font-bold text-ink-900">Historique des paiements reçus</h2>
                <p className="text-xs text-ink-400 mt-0.5">Versements crédités après confirmation de livraison</p>
              </div>
              {walletTxns.length === 0 ? (
                <div className="px-6 py-12 text-center text-sm text-ink-400">
                  <Wallet className="mx-auto h-8 w-8 text-ink-200 mb-2" />
                  Aucun paiement reçu pour le moment.
                </div>
              ) : (
                <div className="divide-y divide-ink-100">
                  {walletTxns.map(tx => (
                    <div key={tx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-ink-50">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${tx.type === 'debit' ? 'bg-red-100' : 'bg-emerald-100'}`}>
                        <Wallet size={18} className={tx.type === 'debit' ? 'text-red-600' : 'text-emerald-600'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-ink-900 truncate">{tx.description || 'Paiement reçu'}</p>
                        <p className="text-xs text-ink-400">
                          {tx.order?.reference ? `Commande ${tx.order.reference} · ` : ''}{formatDate(tx.created_at)}
                        </p>
                      </div>
                      <span className={`font-bold shrink-0 ${tx.type === 'debit' ? 'text-red-600' : 'text-emerald-600'}`}>
                        {tx.type === 'debit' ? '−' : '+'}{formatXOF(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'disputes' && (
          <DisputePanel user={user} orders={orders} />
        )}

        {activeTab === 'settings' && shop && (
          <form onSubmit={handleShopUpdate} className="card max-w-2xl p-6 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display font-bold text-ink-900">Informations de la boutique</h2>
                <p className="text-xs text-ink-400 mt-0.5">Mettez à jour les informations visibles par vos clients.</p>
              </div>
              <StatusBadge status={shop.status} />
            </div>

            {/* Logo de la boutique */}
            <div className="flex items-center gap-4">
              <Avatar name={shopEdit.name || shop.name} role="vendor" src={shopEdit.logo} size="xl" rounded="rounded-2xl" />
              <div>
                <input ref={shopLogoRef} type="file" accept="image/*" className="hidden" onChange={onShopLogo} />
                <button type="button" onClick={() => shopLogoRef.current?.click()} className="btn-ghost btn-sm inline-flex items-center gap-1.5">
                  <ImagePlus size={14} /> Logo de la boutique
                </button>
                {shopEdit.logo && (
                  <button type="button" onClick={() => setShopEdit(s => ({ ...s, logo: null }))} className="ml-2 text-xs text-red-500 hover:underline">
                    Retirer
                  </button>
                )}
                <p className="text-xs text-ink-400 mt-1">JPG ou PNG, 2 Mo max.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label">Nom de la boutique</label>
                <input className="input" value={shopEdit.name} onChange={e => setShopEdit(s => ({ ...s, name: e.target.value }))} required />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Description</label>
                <textarea className="input min-h-[80px] resize-none py-2" value={shopEdit.description} onChange={e => setShopEdit(s => ({ ...s, description: e.target.value }))} placeholder="Décrivez votre boutique…" />
              </div>
              <div>
                <label className="label">Ville</label>
                <input className="input" value={shopEdit.city} onChange={e => setShopEdit(s => ({ ...s, city: e.target.value }))} />
              </div>
              <div>
                <label className="label">Téléphone</label>
                <input className={`input ${getPhoneError(shopEdit.phone) ? 'ring-2 ring-red-300 border-red-300' : ''}`} type="tel" inputMode="numeric" placeholder="Ex: 0142162127" value={shopEdit.phone} onChange={e => setShopEdit(s => ({ ...s, phone: formatPhoneInput(e.target.value) }))} maxLength={10} />
                {getPhoneError(shopEdit.phone) && <p className="mt-1 text-xs text-red-500 font-medium">{getPhoneError(shopEdit.phone)}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="label">Adresse</label>
                <input className="input" value={shopEdit.address} onChange={e => setShopEdit(s => ({ ...s, address: e.target.value }))} placeholder="Quartier, rue…" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Horaires d'ouverture</label>
                <input className="input" value={shopEdit.opening_hours} onChange={e => setShopEdit(s => ({ ...s, opening_hours: e.target.value }))} placeholder="Ex : Lun–Sam : 08h–19h" />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={savingShop} className="btn-primary inline-flex items-center gap-1.5 disabled:opacity-50">
                <Check size={15} /> {savingShop ? 'Enregistrement…' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'profile' && <ProfileSettings />}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-ink-100">
              <h3 className="font-display font-bold text-ink-900 text-lg">
                {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
              </h3>
              <button onClick={closeForm} className="h-8 w-8 grid place-items-center rounded-xl hover:bg-ink-100 text-ink-500">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              <form onSubmit={handleProductSubmit} id="product-form" className="p-6 space-y-5">

                {/* Zone upload image */}
                <div>
                  <label className="label mb-2">Photo du produit</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative cursor-pointer group rounded-2xl border-2 border-dashed border-ink-200 hover:border-teal-400 transition-colors overflow-hidden"
                  >
                    {imagePreview ? (
                      <div className="relative h-48">
                        <img src={imagePreview} alt="Aperçu" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-ink-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex items-center gap-2 text-white text-sm font-semibold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                            <Camera size={16} /> Changer la photo
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-40 flex flex-col items-center justify-center gap-2 text-ink-400 group-hover:text-teal-600 transition-colors">
                        <div className="h-12 w-12 rounded-2xl bg-ink-100 group-hover:bg-teal-50 flex items-center justify-center transition-colors">
                          <ImagePlus size={24} />
                        </div>
                        <p className="text-sm font-medium">Cliquez pour ajouter une photo</p>
                        <p className="text-xs text-ink-300">JPG, PNG, WebP — max 5 Mo</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label">Nom du produit</label>
                  <input className="input" placeholder="Ex: Tomates fraîches" value={productForm.name} onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))} required />
                </div>

                {/* Catégorie parente */}
                <div>
                  <label className="label">Catégorie</label>
                  <select
                    className="input bg-white"
                    value={productForm.parent_category_id}
                    onChange={e => setProductForm(p => ({ ...p, parent_category_id: e.target.value, category_id: '' }))}
                    required
                  >
                    <option value="">Choisir une catégorie…</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                {/* Sous-catégorie (conditionnel) */}
                {subcategories.length > 0 && (
                  <div>
                    <label className="label">
                      Sous-catégorie
                      <span className="ml-1 text-xs text-ink-400 font-normal">(optionnel mais recommandé)</span>
                    </label>
                    <select
                      className="input bg-white"
                      value={productForm.category_id}
                      onChange={e => setProductForm(p => ({ ...p, category_id: e.target.value }))}
                    >
                      <option value="">— Catégorie générale uniquement —</option>
                      {subcategories.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-ink-400">
                      Choisir une sous-catégorie aide les clients à trouver votre produit plus facilement.
                    </p>
                  </div>
                )}

                <div>
                  <label className="label">Description</label>
                  <textarea className="input min-h-[80px] resize-none py-3" placeholder="Décrivez votre produit…" value={productForm.description} onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Prix (FCFA)</label>
                    <input className="input" type="number" min="0" placeholder="500" value={productForm.price} onChange={e => setProductForm(p => ({ ...p, price: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="label">Stock</label>
                    <input className="input" type="number" min="0" placeholder="10" value={productForm.stock} onChange={e => setProductForm(p => ({ ...p, stock: e.target.value }))} required />
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-ink-100 flex gap-3 bg-white">
              <button type="button" onClick={closeForm} className="btn-ghost flex-1">Annuler</button>
              <button type="submit" form="product-form" disabled={isSubmitting} className="btn-primary flex-1 disabled:opacity-50">
                {isSubmitting
                  ? (editingProduct ? 'Mise à jour…' : 'Ajout en cours…')
                  : (editingProduct ? 'Enregistrer les modifications' : 'Publier le produit')
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Fiche détaillée d'une commande (#9) ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5 text-white">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-teal-100">Commande #{selectedOrder.id}</p>
                  <h3 className="font-display text-lg font-bold truncate">{selectedOrder.reference}</h3>
                  <p className="mt-0.5 text-xs text-teal-100">{formatDate(selectedOrder.created_at)}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/20 hover:bg-white/30">
                  <X size={18} />
                </button>
              </div>
              <div className="mt-3"><StatusBadge status={selectedOrder.status} /></div>
            </div>

            {/* Corps */}
            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              {/* Client */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">Client</p>
                <div className="rounded-2xl border border-ink-100 bg-ink-50/60 p-3 text-sm">
                  <p className="font-semibold text-ink-900">{selectedOrder.delivery_name || selectedOrder.client?.name || '—'}</p>
                  {(selectedOrder.delivery_phone || selectedOrder.client?.phone) && (
                    <a href={`tel:${selectedOrder.delivery_phone || selectedOrder.client?.phone}`} className="mt-1 inline-flex items-center gap-1.5 font-medium text-teal-700 hover:underline">
                      <Phone size={13} /> {selectedOrder.delivery_phone || selectedOrder.client?.phone}
                    </a>
                  )}
                </div>
              </div>

              {/* Adresse de livraison */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">Adresse de livraison</p>
                <div className="flex items-start gap-2 rounded-2xl border border-ink-100 bg-ink-50/60 p-3 text-sm">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-teal-600" />
                  <div className="min-w-0">
                    <p className="text-ink-800">{selectedOrder.delivery_neighborhood ? `${selectedOrder.delivery_neighborhood}, Parakou` : 'Quartier non précisé'}</p>
                    {selectedOrder.delivery_instructions && (
                      <p className="mt-1 text-xs italic text-ink-500">"{selectedOrder.delivery_instructions}"</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Produits commandés */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">
                  Produits commandés ({selectedOrder.items?.length || 0})
                </p>
                <div className="divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100">
                  {selectedOrder.items?.map(it => (
                    <div key={it.id} className="flex items-start justify-between gap-3 p-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink-900">{it.product_name}</p>
                        {it.option_label && <p className="text-xs text-ink-400">{it.option_label}</p>}
                        <p className="mt-0.5 text-xs text-ink-500">{it.qty} × {formatXOF(it.unit_price)}</p>
                        {it.notes && <p className="mt-1 text-xs italic text-amber-600">📝 {it.notes}</p>}
                      </div>
                      <p className="shrink-0 text-sm font-bold text-ink-900">{formatXOF(it.total)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totaux */}
              <div className="space-y-1.5 rounded-2xl border border-ink-100 bg-ink-50/60 p-3 text-sm">
                <div className="flex justify-between text-ink-500"><span>Sous-total produits</span><span>{formatXOF(selectedOrder.subtotal)}</span></div>
                <div className="flex justify-between text-ink-500"><span>Frais de service</span><span>{formatXOF(selectedOrder.service_fee)}</span></div>
                <div className="flex justify-between text-ink-500"><span>Livraison</span><span>{formatXOF(selectedOrder.delivery_fee)}</span></div>
                <div className="flex justify-between border-t border-ink-200 pt-1.5 font-bold text-ink-900"><span>Total</span><span className="text-teal-700">{formatXOF(selectedOrder.total)}</span></div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 border-t border-ink-100 bg-white p-4">
              <button onClick={() => setSelectedOrder(null)} className="btn-ghost flex-1">Fermer</button>
              {selectedOrder.status === 'pending' && (
                <button onClick={() => markPreparing(selectedOrder.id)} className="btn-primary flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-violet-500 hover:brightness-110">
                  <CheckCircle2 size={16} /> Préparer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
