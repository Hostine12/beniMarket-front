import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, X, ChevronRight, Package, ArrowLeft, Store, SlidersHorizontal } from 'lucide-react'
import ProductCard from '../components/product/ProductCard'
import api from '../api/axios'

const CAT_IMAGES = {
  frais:           '/sous categories produits frais.jpg',
  fruits:          '/sous categorie fruits et legumes.png',
  epices:          '/sous categorie epices et condiments.jpg',
  boissons:        '/sous categories boisson.webp',
  tissus:          '/tissu-africain-nom_2_727c40da-cde4-4681-a6d6-63d16f51a3bb.jpg',
  cosmetiques:     '/sous categorie cosmetiques naturels.jpg',
  tomates:         '/tomates categories.jpg',
  oignons:         '/ails et oigons categories.jpg',
  'legumes-verts': '/legumes vert categories.jpg',
  cereales:        '/cereales et tubercules catgeories.webp',
  bananes:         '/banane-plantin.webp',
  mangues:         '/mangues.jpg',
  piment:          '/categories piments.webp',
  gingembre:       '/gingembre categorie.avif',
  karite:          '/beurre de karité.jpg',
  savons:          '/savoir noir.webp',
}

function getImg(cat) {
  if (cat.image) return `/storage/${cat.image}`
  return CAT_IMAGES[cat.slug] ?? null
}

// Card sous-catégorie — style glassmorphism image
function SubcatCard({ cat, parentSlug, onClick }) {
  const img = getImg(cat) ?? CAT_IMAGES[parentSlug] ?? null

  return (
    <button
      onClick={() => onClick(cat)}
      className="group relative overflow-hidden rounded-2xl h-40 sm:h-44 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
    >
      {img ? (
        <img
          src={img}
          alt={cat.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-teal-700 to-teal-500" />
      )}

      {/* Overlays — assombrissement pour texte blanc bien lisible */}
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

      {/* Badge produits */}
      {(cat.products_count ?? 0) > 0 && (
        <span className="absolute top-2.5 right-2.5 rounded-full bg-black/45 backdrop-blur-sm border border-white/25 px-2.5 py-1 text-xs font-bold text-white">
          {cat.products_count} produit{cat.products_count > 1 ? 's' : ''}
        </span>
      )}

      {/* Nom + flèche */}
      <div className="absolute bottom-0 left-0 right-0 px-3.5 py-3 flex items-center justify-between gap-1">
        <span className="font-bold text-base text-white leading-tight text-left drop-shadow-md">
          {cat.name}
        </span>
        <div className="shrink-0 h-7 w-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200">
          <ChevronRight size={13} className="text-white" />
        </div>
      </div>
    </button>
  )
}

// Section d'une catégorie parente
function ParentSection({ parent, onSubcategoryClick }) {
  const img = getImg(parent)
  const hasSubs = parent.subcategories?.length > 0

  return (
    <div className="mb-10">
      {/* Header catégorie parente */}
      <div className="flex items-center gap-3 mb-4">
        {img && (
          <div className="h-11 w-11 rounded-xl overflow-hidden border border-ink-200 shrink-0">
            <img src={img} alt={parent.name} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-ink-900">{parent.name}</h2>
          {parent.description && (
            <p className="text-xs text-ink-400 mt-0.5 truncate">{parent.description}</p>
          )}
        </div>
        <Link
          to={`/categorie/${parent.id}/vendeurs`}
          className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-100 px-3 py-1.5 rounded-xl transition-colors"
        >
          <Store size={12} /> Vendeurs
        </Link>
      </div>

      {/* Grid sous-catégories */}
      {hasSubs ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {parent.subcategories.map(sub => (
            <SubcatCard
              key={sub.id}
              cat={sub}
              parentSlug={parent.slug}
              onClick={onSubcategoryClick}
            />
          ))}
          {/* Carte "Voir tous les vendeurs" */}
          <Link
            to={`/categorie/${parent.id}/vendeurs`}
            className="group relative overflow-hidden rounded-2xl h-40 sm:h-44 border-2 border-dashed border-teal-200 hover:border-teal-400 bg-teal-50 hover:bg-teal-100 flex flex-col items-center justify-center gap-2 transition-colors"
          >
            <div className="h-10 w-10 rounded-2xl bg-white shadow-soft flex items-center justify-center">
              <Store size={18} className="text-teal-600 group-hover:text-teal-700 transition-colors" />
            </div>
            <span className="text-sm font-bold text-teal-700 group-hover:text-teal-800 text-center leading-tight px-2">
              Tous les vendeurs
            </span>
          </Link>
        </div>
      ) : (
        <button
          onClick={() => onSubcategoryClick(parent)}
          className="flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-800 transition-colors"
        >
          <Package size={14} />
          Voir les produits
          <ChevronRight size={13} />
        </button>
      )}

      <div className="mt-6 h-px bg-gradient-to-r from-ink-100 via-ink-200 to-transparent" />
    </div>
  )
}

// Vue produits d'une sous-catégorie
function ProductsView({ category, onBack }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('rating')

  useEffect(() => {
    setLoading(true)
    api.get(`/categories/${category.id}/products`, { params: { sort } })
      .then(r => setProducts(r.data.products?.data ?? r.data.products ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [category.id, sort])

  const filtered = products.filter(p =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.shop?.name?.toLowerCase().includes(search.toLowerCase())
  )

  const img = getImg(category)

  return (
    <div className="animate-fade-in">
      {/* Hero bannière sous-catégorie */}
      <div className="relative overflow-hidden rounded-3xl h-40 mb-6">
        {img ? (
          <img src={img} alt={category.name} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-teal-700 to-teal-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

        {/* Contenu hero */}
        <div className="absolute inset-0 flex items-center px-6 gap-4">
          <button
            onClick={onBack}
            className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors shrink-0"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <p className="text-white/70 text-xs font-medium mb-0.5">Sous-catégorie</p>
            <h2 className="font-display font-bold text-white text-2xl">{category.name}</h2>
          </div>
          <div className="ml-auto bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-2 text-center">
            <p className="font-bold text-white text-lg leading-none">{filtered.length}</p>
            <p className="text-white/70 text-xs">produit{filtered.length > 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Barre outils */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Chercher dans ${category.name}…`}
            className="input pl-9 text-sm h-10"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={13} className="text-ink-400" />
            </button>
          )}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="input w-auto text-sm h-10"
        >
          <option value="rating">Mieux notés</option>
          <option value="price">Prix ↑</option>
          <option value="created_at">Récents</option>
        </select>
        <Link
          to={`/categorie/${category.id}/vendeurs`}
          className="flex items-center gap-1.5 text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-100 px-3 py-2 rounded-xl transition-colors h-10"
        >
          <Store size={14} /> Boutiques
        </Link>
      </div>

      {/* Grille produits */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => <div key={i} className="h-64 rounded-2xl bg-ink-100 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <Package size={40} className="mx-auto text-ink-200 mb-3" />
          <p className="text-ink-400 text-sm">Aucun produit dans cette sous-catégorie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}

// Page principale catalogue
export default function Catalog() {
  const [searchParams] = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') || '')
  const [categories, setCategories] = useState([])
  const [loadingCats, setLoadingCats] = useState(true)
  const [selectedSubcat, setSelectedSubcat] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    api.get('/categories')
      .then(r => setCategories(r.data))
      .catch(() => {})
      .finally(() => setLoadingCats(false))
  }, [])

  const doSearch = useCallback((query) => {
    if (!query.trim()) { setSearchResults([]); return }
    setSearching(true)
    api.get('/products', { params: { search: query, per_page: 24 } })
      .then(r => setSearchResults(r.data.data || r.data))
      .catch(() => setSearchResults([]))
      .finally(() => setSearching(false))
  }, [])

  useEffect(() => {
    const t = setTimeout(() => doSearch(q), 350)
    return () => clearTimeout(t)
  }, [q, doSearch])

  const isSearching = q.trim().length > 0

  return (
    <div className="max-shell container-px py-6 sm:py-8">

      {/* Header + barre de recherche */}
      <div className="mb-8">
        <span className="badge-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
          Marketplace locale · Parakou
        </span>
        <h1 className="mt-3 mb-1 font-display text-2xl font-bold text-ink-900 sm:text-3xl">Catalogue</h1>
        <p className="text-ink-400 text-sm mb-5">Parcourez nos catégories ou recherchez directement un produit.</p>

        <div className="relative max-w-2xl">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
          <input
            value={q}
            onChange={e => { setQ(e.target.value); if (!e.target.value) setSelectedSubcat(null) }}
            placeholder="Rechercher un produit, une boutique, une catégorie…"
            className="w-full h-12 rounded-2xl border border-ink-200 bg-white pl-12 pr-12 text-sm shadow-soft focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition"
          />
          {q ? (
            <button
              onClick={() => { setQ(''); setSearchResults([]) }}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-ink-100 hover:bg-ink-200 flex items-center justify-center transition-colors"
            >
              <X size={13} className="text-ink-500" />
            </button>
          ) : (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-ink-300">
              <SlidersHorizontal size={15} />
            </div>
          )}
        </div>
      </div>

      {/* Vue : Résultats de recherche */}
      {isSearching && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-ink-500">
              {searching
                ? 'Recherche en cours…'
                : `${searchResults.length} résultat${searchResults.length > 1 ? 's' : ''} pour « ${q} »`}
            </p>
          </div>
          {searching ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => <div key={i} className="h-64 rounded-2xl bg-ink-100 animate-pulse" />)}
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-20 text-center">
              <Package size={40} className="mx-auto text-ink-200 mb-3" />
              <p className="text-ink-500 font-medium">Aucun produit trouvé pour « {q} »</p>
              <p className="text-ink-400 text-sm mt-1">Essayez un autre mot-clé ou explorez les catégories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {searchResults.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      )}

      {/* Vue : Sous-catégorie sélectionnée */}
      {!isSearching && selectedSubcat && (
        <ProductsView category={selectedSubcat} onBack={() => setSelectedSubcat(null)} />
      )}

      {/* Vue : Catalogue par catégories */}
      {!isSearching && !selectedSubcat && (
        <div className="animate-fade-in">
          {loadingCats ? (
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-11 w-11 rounded-xl bg-ink-100 animate-pulse" />
                    <div className="h-5 w-40 rounded-xl bg-ink-100 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-40 sm:h-44 rounded-2xl bg-ink-100 animate-pulse" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            categories.map(parent => (
              <ParentSection
                key={parent.id}
                parent={parent}
                onSubcategoryClick={setSelectedSubcat}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
