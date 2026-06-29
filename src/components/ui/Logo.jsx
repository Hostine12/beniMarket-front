import { Link } from 'react-router-dom'

export default function Logo({ to = '/', light = false, className = '' }) {
  const textColor = light ? 'text-white' : 'text-ink-900'

  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-3 ${className}`}
    >
      <span className="relative overflow-hidden rounded-xl shadow-glow transition-transform duration-200 group-hover:scale-105">
        <img
          src="/icon4.png"
          alt="BeniMarket"
          className="h-10 w-10 object-cover rounded-xl"
        />
      </span>

      <span
        className={`font-display text-xl font-extrabold tracking-tight ${textColor}`}
      >
        Beni<span className="text-amber-500">Market</span>
      </span>
    </Link>
  )
}