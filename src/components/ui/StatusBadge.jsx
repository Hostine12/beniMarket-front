// Pastille de statut de commande/livraison réutilisable.
const MAP = {
  confirmed: { label: 'Confirmée', cls: 'bg-teal-50 text-teal-700' },
  preparing: { label: 'En préparation', cls: 'bg-amber-100 text-amber-700' },
  shipping: { label: 'En livraison', cls: 'bg-plum-100 text-plum-700' },
  in_progress: { label: 'En cours', cls: 'bg-plum-100 text-plum-700' },
  pending: { label: 'À récupérer', cls: 'bg-ink-100 text-ink-600' },
  delivered: { label: 'Livrée', cls: 'bg-emerald-100 text-emerald-700' },
}

export default function StatusBadge({ status }) {
  const s = MAP[status] || { label: status, cls: 'bg-ink-100 text-ink-600' }
  return (
    <span className={`chip ${s.cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {s.label}
    </span>
  )
}
