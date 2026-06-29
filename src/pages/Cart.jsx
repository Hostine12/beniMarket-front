import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Store, MessageSquare, Edit2, Check } from 'lucide-react'
import SmartImage from '../components/ui/SmartImage'
import { useCart } from '../context/CartContext'
import { formatXOF } from '../utils/format'

export default function Cart() {
  const { items, updateQty, removeItem, totals, updateNotes } = useCart()

  const [editingId, setEditingId] = useState(null)
  const [tempNote, setTempNote] = useState('')

  const startEditing = (itemId, currentNote) => {
    setEditingId(itemId)
    setTempNote(currentNote || '')
  }

  const saveNote = (itemId) => {
    if (updateNotes) {
      updateNotes(itemId, tempNote)
    } else {
      const item = items.find(i => i.product.id === itemId)
      if (item && item.product) {
        item.product.customerNotes = tempNote.trim()
      }
    }
    setEditingId(null)
  }


  if (!items.length) {
    return (
      <div className="max-shell container-px py-20">
        <div className="card mx-auto max-w-md px-6 py-16 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-soft">
            <ShoppingBag size={36} />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold text-ink-900">Votre panier est vide</h1>
          <p className="mt-2 text-ink-500">Parcourez le catalogue et ajoutez vos produits préférés.</p>
          <Link to="/catalogue" className="btn-primary mt-6">
            Découvrir les produits <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-shell container-px py-8">
      <h1 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">Mon panier</h1>
      <p className="mt-1 text-sm text-ink-500">{totals.count} article(s) dans votre panier</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {items.map(({ product, qty }) => (
            <div key={product.id} className="card flex flex-col p-3 sm:p-4 bg-white border border-ink-100 rounded-2xl shadow-sm">
              <div className="flex gap-4">
                <Link to={`/produit/${product.id}`} className="shrink-0">
                  <SmartImage id={product.images?.[0] ?? product.image} alt={product.name} w={200} h={200} rounded="rounded-xl" className="h-24 w-24 sm:h-28 sm:w-28" />
                </Link>
                
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/produit/${product.id}`} className="min-w-0">
                      <h3 className="line-clamp-2 font-semibold text-ink-900 hover:text-teal-700">{product.name}</h3>
                      
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <span className="inline-flex items-center text-[11px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md border border-teal-100">
                          {product.chosenOption || "Le Tas"}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-ink-50 text-ink-600 px-2 py-0.5 rounded-md">
                          <Store size={10} /> {product.vendor || "Vendeuse"}
                        </span>
                      </div>
                    </Link>

                    <button
                      onClick={() => removeItem(product.id)}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-400 hover:bg-red-50 hover:text-red-600"
                      aria-label="Retirer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                    <div className="flex items-center rounded-xl border border-ink-200 bg-white">
                      <button
                        onClick={() => updateQty(product.id, qty - 1)}
                        className="grid h-10 w-10 place-items-center rounded-l-xl text-ink-700 hover:bg-ink-100 disabled:opacity-40"
                        disabled={qty <= 1}
                        aria-label="Diminuer"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center text-sm font-bold">{qty}</span>
                      <button
                        onClick={() => updateQty(product.id, qty + 1)}
                        className="grid h-10 w-10 place-items-center rounded-r-xl text-ink-700 hover:bg-ink-100"
                        aria-label="Augmenter"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-display text-lg font-bold text-ink-900">
                        {formatXOF(product.price * qty)}
                      </p>
                      <p className="text-xs text-ink-400">
                        {formatXOF(product.price)} l'unité
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consignes de récolte */}
              <div className="mt-3 pt-3 border-t border-ink-50 bg-ink-50/40 rounded-xl p-2.5 flex items-center justify-between gap-4">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <MessageSquare size={14} className="text-teal-600 mt-0.5 shrink-0" />
                  <div className="w-full">
                    <p className="text-[11px] font-bold text-ink-400 uppercase tracking-wide">Mes consignes pour la récolte :</p>
                    {editingId === product.id ? (
                      <input 
                        type="text"
                        value={tempNote}
                        onChange={(e) => setTempNote(e.target.value)}
                        className="w-full mt-1 px-2 py-1 text-xs border border-teal-600 bg-white rounded-lg outline-none focus:ring-1 focus:ring-teal-500 font-medium text-ink-800"
                        placeholder="Ex: Pas trop mûres, piments bien rouges..."
                        autoFocus
                      />
                    ) : (
                      <p className="text-xs text-ink-700 italic mt-0.5 font-medium truncate">
                        {product.customerNotes ? `"${product.customerNotes}"` : "Aucune spécification ajoutée"}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  {editingId === product.id ? (
                    <button 
                      onClick={() => saveNote(product.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors"
                    >
                      <Check size={12} /> Valider
                    </button>
                  ) : (
                    <button 
                      onClick={() => startEditing(product.id, product.customerNotes)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-ink-500 hover:text-teal-700 bg-white px-2 py-1.5 rounded-xl border border-ink-200 shadow-xs transition-colors"
                    >
                      <Edit2 size={12} /> Modifier
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}

          <Link to="/catalogue" className="inline-flex items-center gap-1.5 px-1 pt-2 text-sm font-semibold text-teal-700 hover:gap-2.5">
            <ArrowRight size={16} className="rotate-180" /> Continuer mes achats
          </Link>
        </div>

        {/* Récapitulatif épuré */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="card p-5">
            <h2 className="font-display text-lg font-bold text-ink-900">Récapitulatif</h2>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-500">Sous-total</dt>
                <dd className="font-semibold text-ink-900">{formatXOF(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Frais de service (15%)</dt>
                <dd className="font-semibold text-ink-900">{formatXOF(totals.service)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Livraison</dt>
                <dd className="font-semibold text-ink-900">{formatXOF(totals.delivery)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink-200 pt-3">
                <dt className="font-display text-base font-bold text-ink-900">Total</dt>
                <dd className="font-display text-xl font-extrabold text-teal-700">{formatXOF(totals.total)}</dd>
              </div>
            </dl>

            <Link
              to="/paiement"
              className="btn-accent btn-lg mt-5 w-full flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5"
            >
              Passer à la caisse <ArrowRight size={18} />
            </Link>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink-400">
              <ShieldCheck size={14} className="text-teal-700" /> Paiement 100 % sécurisé
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}