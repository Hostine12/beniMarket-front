import { Link } from 'react-router-dom'
import { Plus, Store, ChevronRight } from 'lucide-react'
import SmartImage from '../ui/SmartImage'
import { formatXOF } from '../../utils/format'
import { useCart } from '../../context/CartContext'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const stock = Number(product.stock ?? 0)
  const lowStock = stock > 0 && stock <= 10
  const out = stock <= 0 || product.status === 'out_of_stock'
  const shopName = product.shop?.name ?? null
  const shopId   = product.shop?.id ?? null

  return (
    <article className="group relative bg-white rounded-2xl border border-ink-100 overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-0.5 flex flex-col">

      {/* Image + overlays */}
      <Link to={`/produit/${product.id}`} className="relative block overflow-hidden shrink-0">
        <div className="aspect-[4/3]">
          <SmartImage
            id={product.images?.[0] ?? product.image}
            alt={product.name}
            w={500}
            h={400}
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Gradient bas image */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge tag (coin haut gauche) */}
        {product.tags?.length > 0 && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center rounded-full bg-white/80 backdrop-blur-sm border border-white/60 px-2.5 py-0.5 text-[11px] font-semibold text-ink-700 shadow-sm">
              {product.tags[0]}
            </span>
          </div>
        )}

        {/* Badge stock (coin haut droit) */}
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center gap-1 rounded-full backdrop-blur-sm border px-2 py-0.5 text-[11px] font-semibold shadow-sm ${
            out
              ? 'bg-red-50/90 border-red-100 text-red-600'
              : lowStock
                ? 'bg-amber-50/90 border-amber-100 text-amber-700'
                : 'bg-white/80 border-white/60 text-emerald-600'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${out ? 'bg-red-400' : lowStock ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            {out ? 'Épuisé' : lowStock ? `${stock} restants` : `${stock} en stock`}
          </span>
        </div>

        {/* Réduction éventuelle */}
        {product.oldPrice && (
          <div className="absolute bottom-2 left-2">
            <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
              -{Math.round((1 - product.price / product.oldPrice) * 100)}%
            </span>
          </div>
        )}
      </Link>

      {/* Corps de la carte */}
      <div className="flex flex-col flex-1 p-3">

        {/* Nom */}
        <Link to={`/produit/${product.id}`}>
          <h3 className="font-semibold text-sm leading-snug text-ink-900 group-hover:text-teal-700 transition-colors line-clamp-2 mb-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Badge "Disponible chez" — glassmorphism */}
        {shopName && (
          <div className="mb-2.5">
            {shopId ? (
              <Link
                to={`/boutique/${shopId}`}
                className="group/shop inline-flex items-center gap-1.5 w-full rounded-xl border border-teal-100 bg-teal-50 hover:bg-teal-100 hover:border-teal-200 px-2.5 py-1.5 transition-colors"
              >
                <div className="h-4 w-4 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
                  <Store size={9} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium text-teal-600 leading-none mb-0.5">Disponible chez</p>
                  <p className="text-xs font-bold text-teal-800 truncate leading-none">{shopName}</p>
                </div>
                <ChevronRight size={11} className="text-teal-400 group-hover/shop:text-teal-600 shrink-0 transition-colors" />
              </Link>
            ) : (
              <div className="inline-flex items-center gap-1.5 w-full rounded-xl border border-ink-100 bg-ink-50 px-2.5 py-1.5">
                <div className="h-4 w-4 rounded-full bg-ink-300 flex items-center justify-center shrink-0">
                  <Store size={9} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium text-ink-400 leading-none mb-0.5">Disponible chez</p>
                  <p className="text-xs font-bold text-ink-700 truncate leading-none">{shopName}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Prix + bouton panier */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-display text-base font-bold text-ink-900 leading-none">
              {formatXOF(product.price)}
            </p>
            {product.oldPrice && (
              <p className="text-[11px] text-ink-400 line-through mt-0.5">
                {formatXOF(product.oldPrice)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => addItem(product)}
            disabled={out}
            aria-label={`Ajouter ${product.name} au panier`}
            className="h-9 w-9 shrink-0 grid place-items-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-soft transition-all duration-200 hover:shadow-glow hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={17} />
          </button>
        </div>
      </div>
    </article>
  )
}
