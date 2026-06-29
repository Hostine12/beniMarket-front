import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Store } from 'lucide-react'
import api from '../../api/axios'
import { formatXOF } from '../../utils/format'
import SmartImage from '../ui/SmartImage'
import Avatar from '../ui/Avatar'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'

function MiniProductCard({ product, onAdd }) {
  return (
    <div className="card bg-white rounded-xl border border-ink-100 flex flex-col overflow-hidden hover:shadow-card transition-shadow">
      <Link to={`/produit/${product.id}`} className="block">
        <div className="h-32 bg-ink-50 overflow-hidden">
          <SmartImage
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <div className="p-3 flex flex-col flex-1">
        <Link to={`/produit/${product.id}`} className="text-sm font-medium text-ink-800 hover:text-teal-700 line-clamp-2 mb-1">
          {product.name}
        </Link>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="font-bold text-teal-700 text-sm">{formatXOF(product.price)}</span>
          <button
            onClick={() => onAdd(product)}
            disabled={product.status === 'out_of_stock' || product.stock <= 0}
            className="p-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Ajouter au panier"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Affiche les recommandations du même vendeur.
 * Props :
 *   productId  – si on est sur une page produit
 *   orderId    – si on est après un achat (post-order)
 */
export default function SellerRecommendations({ productId, orderId }) {
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const { showToast } = useToast()

  useEffect(() => {
    if (!productId && !orderId) return

    const url = orderId
      ? `/orders/recommendations?order_id=${orderId}`
      : `/products/${productId}/recommendations`

    api.get(url)
      .then(r => {
        if (orderId) {
          setProducts(r.data || [])
        } else {
          setShop(r.data.shop)
          setProducts(r.data.recommendations || [])
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [productId, orderId])

  const handleAdd = (product) => {
    addItem(product, 1)
    showToast(`${product.name} ajouté au panier`, 'success')
  }

  if (loading || products.length === 0) return null

  return (
    <section className="py-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display text-xl font-bold text-ink-900">
            {orderId
              ? 'Autres produits de ces vendeurs'
              : 'Autres produits de cette boutique'}
          </h3>
          {shop && (
            <Link to={`/boutique/${shop.id}`} className="flex items-center gap-2 mt-1 text-sm text-teal-700 hover:underline">
              <Avatar src={shop.vendor?.avatar} name={shop.vendor?.name} size="xs" />
              <Store size={13} />
              {shop.name}
            </Link>
          )}
        </div>
        {shop && (
          <Link to={`/boutique/${shop.id}`} className="text-sm text-teal-700 hover:underline whitespace-nowrap">
            Voir la boutique →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map(p => (
          <MiniProductCard key={p.id} product={p} onAdd={handleAdd} />
        ))}
      </div>
    </section>
  )
}
