import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Store, MapPin, Phone, Package, ChevronRight, Star } from 'lucide-react'
import ProductCard from '../components/product/ProductCard'
import { formatXOF } from '../utils/format'
import api from '../api/axios'

function ShopSkeleton() {
  return (
    <div className="max-shell container-px py-8 animate-pulse">
      <div className="h-48 rounded-3xl bg-ink-200 mb-6" />
      <div className="h-6 w-48 rounded-lg bg-ink-200 mb-2" />
      <div className="h-4 w-72 rounded-lg bg-ink-100 mb-8" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-ink-100" />
        ))}
      </div>
    </div>
  )
}

export default function ShopPage() {
  const { id } = useParams()
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get(`/shops/${id}`),
      api.get(`/products?shop_id=${id}`),
    ])
      .then(([shopRes, productsRes]) => {
        setShop(shopRes.data)
        setProducts(productsRes.data?.data || productsRes.data || [])
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <ShopSkeleton />

  if (notFound || !shop) {
    return (
      <div className="max-shell container-px py-24 text-center">
        <div className="mx-auto h-20 w-20 rounded-3xl bg-ink-100 flex items-center justify-center mb-5">
          <Store size={36} className="text-ink-300" />
        </div>
        <p className="font-display text-2xl font-bold text-ink-900">Boutique introuvable</p>
        <p className="mt-2 text-sm text-ink-500">Cette boutique n'existe pas ou a été désactivée.</p>
        <Link to="/catalogue" className="btn-primary mt-6 inline-flex">Explorer le catalogue</Link>
      </div>
    )
  }

  const activeProducts = products.filter(p => p.stock > 0)

  return (
    <div className="max-shell container-px py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-ink-400">
        <Link to="/" className="hover:text-ink-700">Accueil</Link>
        <ChevronRight size={14} />
        <Link to="/catalogue" className="hover:text-ink-700">Catalogue</Link>
        <ChevronRight size={14} />
        <span className="text-ink-700 font-medium">{shop.name}</span>
      </nav>

      {/* Bannière boutique */}
      <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 px-8 py-10 mb-8 text-white shadow-card ring-1 ring-ink-900/5">
        <div className="absolute -top-12 right-0 h-56 w-56 translate-x-12 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-12 left-0 h-40 w-40 -translate-x-8 rounded-full bg-teal-400/20 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-white/20 ring-1 ring-white/25 backdrop-blur">
            <Store size={36} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="font-display text-2xl font-bold">{shop.name}</h1>
              {shop.status === 'active' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold">
                  ✓ Boutique vérifiée
                </span>
              )}
            </div>
            {shop.description && (
              <p className="text-amber-100 text-sm mt-1 max-w-lg">{shop.description}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-amber-100">
              {shop.city && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} /> {shop.city}
                </span>
              )}
              {shop.phone && (
                <a href={`tel:${shop.phone}`} className="flex items-center gap-1.5 hover:text-white">
                  <Phone size={14} /> {shop.phone}
                </a>
              )}
              <span className="flex items-center gap-1.5">
                <Package size={14} /> {products.length} produit(s)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Produits */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold text-ink-900">
            Produits de la boutique
            <span className="ml-2 text-base font-normal text-ink-400">({products.length})</span>
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="card p-16 text-center text-ink-400">
            <Package className="mx-auto h-12 w-12 text-ink-200 mb-3" />
            <p className="font-semibold text-ink-600">Aucun produit pour le moment</p>
            <p className="text-sm mt-1">Cette boutique n'a pas encore publié de produits.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
