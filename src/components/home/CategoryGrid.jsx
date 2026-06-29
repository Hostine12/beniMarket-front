import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '../../api/axios'

const CAT_IMAGES = {
  // Parents
  frais:       '/sous categories produits frais.jpg',
  fruits:      '/sous categorie fruits et legumes.png',
  epices:      '/sous categorie epices et condiments.jpg',
  boissons:    '/sous categories boisson.webp',
  tissus:      '/tissu-africain-nom_2_727c40da-cde4-4681-a6d6-63d16f51a3bb.jpg',
  cosmetiques: '/sous categorie cosmetiques naturels.jpg',
  // Sous-catégories
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

function getImage(slug) {
  return CAT_IMAGES[slug] ?? null
}

// Couleurs d'accent par catégorie pour fallback et accents visuels
const CAT_ACCENTS = {
  teal:  'from-teal-800 to-teal-600',
  amber: 'from-amber-700 to-amber-500',
  plum:  'from-plum-800 to-plum-600',
}

function CategoryCard({ cat }) {
  const image = cat.image ? `/storage/${cat.image}` : getImage(cat.slug)
  const accent = CAT_ACCENTS[cat.accent] ?? CAT_ACCENTS.teal
  const hasSubs = cat.subcategories?.length > 0

  return (
    <Link
      to={`/categorie/${cat.id}/vendeurs`}
      className="group relative overflow-hidden rounded-3xl h-56 sm:h-64"
    >
      {/* Image de fond */}
      {image ? (
        <img
          src={image}
          alt={cat.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={e => e.currentTarget.style.display = 'none'}
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${accent}`} />
      )}

      {/* Overlays — assombrissement renforcé pour lisibilité du texte blanc */}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

      {/* Badge produits — glassmorphism */}
      <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md border border-white/30 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
        {cat.products_count ?? cat.count ?? 0}
        <span className="opacity-90">produits</span>
      </div>

      {/* Contenu bas */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        {/* Titre + flèche */}
        <div className="flex items-end justify-between gap-3 mb-2.5">
          <h3 className="font-display font-bold text-white leading-tight text-lg sm:text-xl drop-shadow-md">
            {cat.name}
          </h3>
          <div className="shrink-0 h-9 w-9 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <ChevronRight size={16} />
          </div>
        </div>

        {/* Sous-catégories en chips glassmorphism */}
        {hasSubs && (
          <div className="flex flex-wrap gap-1.5">
            {cat.subcategories.slice(0, 3).map(sub => (
              <Link
                key={sub.id}
                to={`/categorie/${sub.id}/vendeurs`}
                onClick={e => e.stopPropagation()}
                className="rounded-full bg-black/35 backdrop-blur-md border border-white/30 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/30 transition-colors"
              >
                {sub.name}
              </Link>
            ))}
            {cat.subcategories.length > 3 && (
              <span className="rounded-full bg-black/25 border border-white/20 px-2.5 py-1 text-xs font-medium text-white/80">
                +{cat.subcategories.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/categories')
      .then(r => setCategories(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="categories" className="relative scroll-mt-20 overflow-hidden bg-ink-50 py-16 lg:py-24">
      {/* Halos décoratifs */}
      <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-teal-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl" />

      <div className="relative max-shell container-px">

        {/* Titre section */}
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-100 px-3 py-1 text-xs font-semibold text-teal-700 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
              Marketplace locale
            </span>
            <h2 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl leading-tight">
              Explorez par catégorie
            </h2>
            <p className="mt-2 text-ink-500 max-w-md">
              Trouvez exactement ce dont vous avez besoin, près de chez vous à Parakou.
            </p>
          </div>
          <Link
            to="/catalogue"
            className="hidden shrink-0 sm:inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800 bg-white border border-teal-100 hover:border-teal-300 px-5 py-2.5 rounded-2xl transition-all shadow-soft hover:shadow-card"
          >
            Tout voir <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grille catégories */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-3xl bg-ink-100 animate-pulse h-56 sm:h-64" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map(cat => (
              <CategoryCard key={cat.id} cat={cat} />
            ))}
          </div>
        )}

        {/* CTA mobile */}
        <div className="mt-8 sm:hidden text-center">
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-5 py-3 rounded-2xl transition-colors"
          >
            Voir tout le catalogue <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  )
}
