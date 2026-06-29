import { TrendingUp, TrendingDown } from 'lucide-react'
import { getIcon } from './icons'

const TONES = {
  teal: 'bg-teal-50 text-teal-700',
  amber: 'bg-amber-100 text-amber-600',
  plum: 'bg-plum-100 text-plum-700',
  ink: 'bg-ink-100 text-ink-700',
}

export default function StatCard({ icon, label, value, change, tone = 'teal', hint }) {
  const Icon = getIcon(icon)
  const positive = change >= 0
  return (
    <div className="card p-5 transition-shadow duration-200 hover:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${TONES[tone]}`}>
          <Icon size={20} strokeWidth={2} />
        </div>
        {change != null && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
              positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}
          >
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-2xl font-bold text-ink-900">{value}</p>
      <p className="mt-0.5 text-sm text-ink-500">{label}</p>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  )
}
