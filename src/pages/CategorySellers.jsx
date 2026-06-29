import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Star, Package, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react'
import api from '../api/axios'
import { formatXOF } from '../utils/format'
import SmartImage from '../components/ui/SmartImage'
import Avatar from '../components/ui/Avatar'

function RatingStars({ value = 0 }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          size={12}
          className={s <= Math.round(value) ? 'text-amber-400 fill-amber-400' : 'text-ink-200 fill-ink-200'}
        />
      ))}
      <span className="ml-1 text-xs text-ink-500">{value?.toFixed(1)}</span>
    </span>
  )
}

function SellerCard({ shop }) {
  const firstProduct = shop.products?.[0]

  return (
    <div className="card group overflow-hidden rounded-2xl border border-ink-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      {/* Bannière produit */}
      <div className="relative h-36 overflow-hidden bg-ink-50">
        {firstProduct?.images?.[0] ? (
          <SmartImage
            src={firstProduct.images[0]}
            alt={firstProduct.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-300">
            <Package size={48} />
          </div>
        )}
        {/* Badge nombre de produits */}
        <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-xs font-semibold text-ink-700 px-2 py-0.5 rounded-full border border-ink-100">
          {shop.products?.length} produit{shop.products?.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Infos vendeur */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar src={shop.vendor?.avatar} name={shop.vendor?.name} size="sm" />
          <div>
            <h3 className="font-semibold text-ink-900 text-sm">{shop.name}</h3>
            <p className="text-xs text-ink-400">{shop.city}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-3">
          <RatingStars value={shop.avg_rating} />
          <span className="text-xs text-ink-400">{shop.total_stock} en stock</span>
        </div>

        {/* Fourchette de prix */}
        <div className="mb-4">
          <span className="text-xs text-ink-400">Prix : </span>
          <span className="text-sm font-semibold text-teal-700">
            {formatXOF(shop.min_price)}
            {shop.max_price !== shop.min_price && ` – ${formatXOF(shop.max_price)}`}
          </span>
        </div>

        {/* Aperçu des produits */}
        <div className="space-y-1 mb-4">
          {shop.products?.slice(0, 3).map(p => (
            <div key={p.id} className="flex items-center justify-between text-xs">
              <span className="text-ink-600 truncate flex-1 mr-2">{p.name}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="font-semibold text-ink-900">{formatXOF(p.price)}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  p.stock > 0 ? 'bg-teal-50 text-teal-700' : 'bg-red-50 text-red-600'
                }`}>
                  {p.stock > 0 ? `${p.stock} dispo` : 'Rupture'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Link
          to={`/boutique/${shop.id}`}
          className="btn-primary w-full text-center text-sm flex items-center justify-center gap-1 bg-gradient-to-r from-teal-600 to-emerald-600 transition hover:brightness-110"
        >
          Voir la boutique <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  )
}

export default function CategorySellers() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const [category, setCategory] = useState(null)
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('avg_rating') // avg_rating | min_price | total_stock

  // Sous-catégorie sélectionnée (depuis parent)
  const [subcategories, setSubcategories] = useState([])
  const [activeSubcat, setActiveSubcat] = useState(null)

  useEffect(() => {
    const targetId = activeSubcat ?? id
    setLoading(true)

    Promise.all([
      api.get(`/categories/${id}`),
      api.get(`/categories/${targetId}/sellers`),
    ])
      .then(([catRes, sellersRes]) => {
        setCategory(catRes.data)
        setSubcategories(catRes.data.subcategories || [])
        setSellers(sellersRes.data.sellers || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id, activeSubcat])

  const filtered = sellers
    .filter(s =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.vendor?.name?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'min_price')    return a.min_price - b.min_price
      if (sortBy === 'total_stock')  return b.total_stock - a.total_stock
      return (b.avg_rating || 0) - (a.avg_rating || 0)
    })

  return (
    <div className="max-shell container-px py-10">
      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-1 text-sm text-ink-400 mb-6">
        <Link to="/" className="hover:text-teal-700">Accueil</Link>
        <ChevronRight size={14} />
        <Link to="/catalogue" className="hover:text-teal-700">Catalogue</Link>
        {category && (
          <>
            <ChevronRight size={14} />
            <span className="text-ink-700 font-medium">{category.name}</span>
          </>
        )}
      </nav>

      {/* En-tête catégorie */}
      {category && (
        <div className="mb-8">
          <span className="badge-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
            Vendeurs · {category.name}
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-ink-900 text-balance">{category.name}</h1>
          {category.description && (
            <p className="mt-1 text-ink-500">{category.description}</p>
          )}
        </div>
      )}

      {/* Filtres sous-catégories */}
      {subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveSubcat(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !activeSubcat
                ? 'bg-teal-700 text-white'
                : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
            }`}
          >
            Tout
          </button>
          {subcategories.map(sub => (
            <button
              key={sub.id}
              onClick={() => setActiveSubcat(sub.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeSubcat === sub.id
                  ? 'bg-teal-700 text-white'
                  : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
              }`}
            >
              {sub.name}
              <span className="ml-1 text-xs opacity-70">({sub.products_count})</span>
            </button>
          ))}
        </div>
      )}

      {/* Barre de recherche + tri */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un vendeur ou une boutique…"
            className="input pl-9 w-full"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} className="text-ink-400" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-ink-400" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="input text-sm"
          >
            <option value="avg_rating">Mieux notés</option>
            <option value="min_price">Prix le plus bas</option>
            <option value="total_stock">Plus de stock</option>
          </select>
        </div>
      </div>

      {/* Résultats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card animate-pulse h-80 bg-ink-100 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <Package size={48} className="mx-auto text-ink-200 mb-4" />
          <p className="text-ink-400">Aucun vendeur trouvé pour cette catégorie.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-ink-400 mb-4">
            {filtered.length} vendeur{filtered.length > 1 ? 's' : ''} proposant ce produit
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(shop => (
              <SellerCard key={shop.id} shop={shop} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
