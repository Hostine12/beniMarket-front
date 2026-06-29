import { useState } from 'react'
import { img } from '../../utils/format'

export default function SmartImage({ id, alt = '', w = 800, h = 600, className = '', rounded = '' }) {
  const [failed, setFailed] = useState(false)

  const isLocal = id && (id.startsWith('/') || id.startsWith('data:'))
  const src = isLocal ? id : (id ? img(id, w, h) : null)

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-teal-700 via-teal-800 to-plum-700 ${rounded} ${className}`}
      >
        <span className="px-4 text-center text-sm font-semibold text-white/90 line-clamp-2">
          {alt || 'BeniMarket'}
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`object-cover ${rounded} ${className}`}
    />
  )
}
