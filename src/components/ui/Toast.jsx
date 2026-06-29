import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const icons = {
  success: CheckCircle2,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
}

const styles = {
  success: 'bg-white border-l-4 border-emerald-500',
  error:   'bg-white border-l-4 border-red-500',
  warning: 'bg-white border-l-4 border-amber-500',
  info:    'bg-white border-l-4 border-teal-500',
}

const iconStyles = {
  success: 'text-emerald-500',
  error:   'text-red-500',
  warning: 'text-amber-500',
  info:    'text-teal-500',
}

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false)
  const Icon = icons[toast.type] || Info

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onRemove(toast.id), 300)
    }, toast.duration || 4000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={`
        flex items-start gap-3 min-w-[280px] max-w-sm w-full
        rounded-2xl shadow-lg p-4 pointer-events-auto
        transition-all duration-300
        ${styles[toast.type] || styles.info}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <Icon size={20} className={`shrink-0 mt-0.5 ${iconStyles[toast.type] || iconStyles.info}`} />
      <p className="flex-1 text-sm font-medium text-ink-800 leading-snug">{toast.message}</p>
      <button
        onClick={() => { setVisible(false); setTimeout(() => onRemove(toast.id), 300) }}
        className="shrink-0 text-ink-400 hover:text-ink-600"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  )
}
