import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight, ShoppingBag, Heart, Store, Check } from 'lucide-react'
import SmartImage from '../components/ui/SmartImage'
import { useCart } from '../context/CartContext'
import { formatXOF } from '../utils/format'
import api from '../api/axios'
import { getProductById } from '../data/products'
import SellerRecommendations from '../components/product/SellerRecommendations'

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => {
        setProduct(r.data)
        if (r.data.options?.length > 0) setSelectedOption(r.data.options[0])
      })
      .catch(() => {
        const local = getProductById(id)
        if (local) {
          setProduct(local)
          if (local.options?.length > 0) setSelectedOption(local.options[0])
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="max-shell container-px py-24 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-shell container-px py-24 text-center">
        <p className="font-display text-2xl font-bold text-ink-900">Produit introuvable</p>
        <Link to="/catalogue" className="btn-primary mt-6">Retour au catalogue</Link>
      </div>
    )
  }

  const unitPrice = selectedOption ? product.price * (selectedOption.multiplier || 1) : product.price
  const stock = Number(product.stock ?? 0)

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: unitPrice,
      image: product.images?.[0] || '',
      stock: product.stock,
      shop: product.shop?.name,
    }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-shell container-px py-8">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-ink-400">
        <Link to="/" className="hover:text-ink-700">Accueil</Link>
        <ChevronRight size={14} />
        <Link to="/catalogue" className="hover:text-ink-700">Catalogue</Link>
        <ChevronRight size={14} />
        <span className="text-ink-700 font-medium">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-ink-100 shadow-card ring-1 ring-ink-900/5">
          <SmartImage
            id={product.images?.[0] ?? product.image}
            alt={product.name}
            w={700} h={700}
            className="absolute inset-0 h-full w-full"
          />
          <button
            onClick={() => setIsFavorite(f => !f)}
            className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full shadow-md transition-colors ${isFavorite ? 'bg-rose-500 text-white' : 'bg-white text-ink-500'}`}
          >
            <Heart size={18} fill={isFavorite ? 'white' : 'none'} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {product.tags?.map(t => (
                <span key={t} className="rounded-full bg-teal-50 px-3 py-0.5 text-xs font-medium text-teal-700 border border-teal-100">{t}</span>
              ))}
            </div>
            <h1 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">{product.name}</h1>
            {product.shop && (
              <Link
                to={`/boutique/${product.shop.id}`}
                className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-teal-700 transition-colors"
              >
                <Store size={14} />
                <span>{product.shop.name}</span>
                <ChevronRight size={12} />
              </Link>
            )}
          </div>

          <p className="text-3xl font-bold text-ink-900">{formatXOF(unitPrice)}</p>

          {product.description && (
            <p className="text-sm leading-relaxed text-ink-600">{product.description}</p>
          )}

          {product.options?.length > 0 && (
            <div>
              <p className="label">Format</p>
              <div className="flex flex-wrap gap-2">
                {product.options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOption(opt)}
                    className={`rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all ${selectedOption?.id === opt.id ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-ink-200 text-ink-600 hover:border-ink-300'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="label">Quantité</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="h-10 w-10 rounded-xl border-2 border-ink-200 text-lg font-bold hover:bg-ink-50">−</button>
              <span className="w-8 text-center text-lg font-bold">{qty}</span>
              <button onClick={() => setQty(q => Math.min(stock || 1, q + 1))} className="h-10 w-10 rounded-xl border-2 border-ink-200 text-lg font-bold hover:bg-ink-50">+</button>
              <span className="text-xs text-ink-400">{stock} en stock</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              disabled={stock <= 0}
              className={`btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 ${added ? 'bg-emerald-600' : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:brightness-110'}`}
            >
              {added ? <><Check size={18} /> Ajouté !</> : <><ShoppingBag size={18} /> Ajouter au panier</>}
            </button>
          </div>

          <div className="rounded-2xl bg-teal-50 p-4 text-sm text-teal-800 border border-teal-100">
            <p className="font-semibold">Livraison à Parakou</p>
            <p className="mt-1 text-xs text-teal-600">Livraison express disponible · Confirmation par code OTP</p>
          </div>
        </div>
      </div>

      {/* Recommandations du même vendeur */}
      <div className="mt-12">
        <SellerRecommendations productId={id} />
      </div>
    </div>
  )
}
