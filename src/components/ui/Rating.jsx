import { Star } from 'lucide-react'

export default function Rating({ value = 0, reviews, size = 14, showValue = true, className = '' }) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  return (
    <div className={`inline-flex items-center gap-1 ${className}`} aria-label={`Note ${value} sur 5`}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full
          const isHalf = i === full && half
          return (
            <Star
              key={i}
              size={size}
              className={
                filled || isHalf ? 'fill-amber-400 text-amber-400' : 'fill-ink-200 text-ink-200'
              }
              strokeWidth={1.5}
            />
          )
        })}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-ink-700">
          {value.toFixed(1)}
          {reviews != null && <span className="font-normal text-ink-400"> ({reviews})</span>}
        </span>
      )}
    </div>
  )
}
